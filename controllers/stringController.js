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
        message: 'String already exists in the system'
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
    const decodedValue = decodeURIComponent(string_value);
    const stringAnalysis = storage.findByValue(decodedValue);

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
  try {
    const filters = {};
    
    // Convert query parameters to appropriate types
    if (req.query.is_palindrome !== undefined) {
      filters.is_palindrome = req.query.is_palindrome === 'true';
    }
    
    if (req.query.min_length !== undefined) {
      filters.min_length = parseInt(req.query.min_length);
    }
    
    if (req.query.max_length !== undefined) {
      filters.max_length = parseInt(req.query.max_length);
    }
    
    if (req.query.word_count !== undefined) {
      filters.word_count = parseInt(req.query.word_count);
    }
    
    if (req.query.contains_character !== undefined) {
      filters.contains_character = req.query.contains_character;
    }

    const filteredStrings = storage.filterStrings(filters);

    res.status(200).json({
      data: filteredStrings,
      count: filteredStrings.length,
      filters_applied: filters
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const filterByNaturalLanguage = (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing "query" parameter'
      });
    }

    // Parse natural language query
    const interpretedQuery = naturalLanguageParser.parseQuery(query);
    
    // Validate the parsed filters
    naturalLanguageParser.validateFilters(interpretedQuery.parsed_filters);

    // Apply filters
    const filteredStrings = storage.filterStrings(interpretedQuery.parsed_filters);

    res.status(200).json({
      data: filteredStrings,
      count: filteredStrings.length,
      interpreted_query: interpretedQuery
    });

  } catch (error) {
    if (error.message === 'Unable to parse natural language query') {
      return res.status(400).json({
        error: 'Bad Request',
        message: error.message
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
    const decodedValue = decodeURIComponent(string_value);
    
    const stringAnalysis = storage.findByValue(decodedValue);
    if (!stringAnalysis) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'String does not exist in the system'
      });
    }

    storage.deleteByHash(stringAnalysis.id);
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