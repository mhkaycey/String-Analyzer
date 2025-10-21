import { StringAnalysis } from '../models/stringAnalysis.js';
import { storage } from '../storage/inMemoryStorage.js';
import {naturalLanguageParser} from './naturalLanguageParser.js';

const analyzeString = (req, res) => {
  try {
    const { value } = req.body;

    // Check if string already exists
    const existingString = storage.findByValue(value);
    if (existingString) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'String already exists'
      });
    }

    // Create new string analysis
    const stringAnalysis = new StringAnalysis(value);
    storage.save(stringAnalysis);

    res.status(201).json(stringAnalysis);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getString = (req, res) => {
  try {
    const { string_value } = req.params;
    
    // URL decode the string value
    // const decodedValue = decodeURIComponent(string_value);
    const stringAnalysis = storage.findByValue(string_value);

    if (!stringAnalysis) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'String does not exist in the system'
      });
    }

    res.status(200).json(stringAnalysis);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
const getAllStrings = (req, res) => {
  console.log('Raw query:', req.query);
  console.log('Query keys:', Object.keys(req.query));
  console.log('is_palindrome value:', req.query.is_palindrome);
  console.log('is_palindrome type:', typeof req.query.is_palindrome);

  try {
    const filters = {};

    if (req.query.is_palindrome !== undefined) {
      console.log('Processing is_palindrome:', req.query.is_palindrome);
      filters.is_palindrome = req.query.is_palindrome === 'true' || req.query.is_palindrome === true;
    }

    if (req.query.min_length !== undefined) {
      console.log('Processing min_length:', req.query.min_length);
      filters.min_length = parseInt(req.query.min_length);
    }

    if (req.query.max_length !== undefined) {
      console.log('Processing max_length:', req.query.max_length);
      filters.max_length = parseInt(req.query.max_length);
    }

    if (req.query.word_count !== undefined) {
      console.log('Processing word_count:', req.query.word_count);
      filters.word_count = parseInt(req.query.word_count);
    }

    if (req.query.contains_character !== undefined) {
      console.log('Processing contains_character:', req.query.contains_character);
      filters.contains_character = req.query.contains_character;
    }

    console.log('Final filters before filterStrings:', filters);
    const filteredStrings = storage.filterStrings(filters);
    console.log('Filtered count:', filteredStrings.length);

    res.status(200).json({
      data: filteredStrings,
      count: filteredStrings.length,
      filters_applied: Object.keys(filters).length > 0 ? filters : { none: 'No filters applied' }
    });
  } catch (error) {
    console.error('Error in getAllStrings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const filterByNaturalLanguage = (req, res) => {
  
  try {
 const query = req.query.query || req.query.q;

    if (!query || typeof query !== 'string' || query.trim() === '') {
    return res.status(422).json({
     error: 'Unprocessable Entity',
     message: 'Query parsed but resulted in conflicting filters'
    });
  }


    const interpretedQuery = naturalLanguageParser.parseQuery(query);
    naturalLanguageParser.validateFilters(interpretedQuery.parsed_filters);

    let filteredStrings;
    try {
      filteredStrings = storage.filterStrings(interpretedQuery.parsed_filters);
    } catch (err) {
      return res.status(422).json({
        error: 'Unprocessable Entity',
        message: 'Query parsed but resulted in conflicting filters'
      });
    }

    res.status(200).json({
      data: filteredStrings,
      count: filteredStrings.length,
      interpreted_query: interpretedQuery
    });

  } catch (error) {
    console.error('Error in filterByNaturalLanguage:', error);
    if (error.message === 'Unable to parse natural language query') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Unable to parse natural language query'
      });
    }
    
    if (error.message.includes('Conflicting filters')) {
      return res.status(422).json({
        error: 'Unprocessable Entity',
        message: error.message
      });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteString = (req, res) => {
  try {
    const { string_value } = req.params;
   
    
    const stringAnalysis = storage.findByValue(string_value);
    if (!stringAnalysis) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'String does not exist in the system'
      });
    }

    storage.deleteValue(stringAnalysis.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const stringController = {
  analyzeString,
  getString,
  getAllStrings,
  filterByNaturalLanguage,
  deleteString
};