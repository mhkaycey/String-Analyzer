const validateStringInput = (req, res, next) => {
  const { value } = req.body;

  if (value === undefined) {
    return res.status(400).json({ 
      error: 'Bad Request', 
      message: 'Missing "value" field in request body' 
    });
  }

  if (typeof value !== 'string') {
    return res.status(422).json({ 
      error: 'Unprocessable Entity', 
      message: 'Invalid data type for "value" (must be string)' 
    });
  }

  next();
};

const validateQueryParams = (req, res, next) => {
  const { 
    is_palindrome, 
    min_length, 
    max_length, 
    word_count, 
    contains_character 
  } = req.query;

  // Validate is_palindrome
  if (is_palindrome && !['true', 'false'].includes(is_palindrome)) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Invalid value for is_palindrome (must be true or false)'
    });
  }

  // Validate min_length and max_length
  if (min_length && (isNaN(min_length) || parseInt(min_length) < 0)) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Invalid value for min_length (must be positive integer)'
    });
  }

  if (max_length && (isNaN(max_length) || parseInt(max_length) < 0)) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Invalid value for max_length (must be positive integer)'
    });
  }

  if (min_length && max_length && parseInt(min_length) > parseInt(max_length)) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'min_length cannot be greater than max_length'
    });
  }

  // Validate word_count
  if (word_count && (isNaN(word_count) || parseInt(word_count) < 0)) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Invalid value for word_count (must be positive integer)'
    });
  }

  // Validate contains_character
  if (contains_character && (typeof contains_character !== 'string' || contains_character.length !== 1)) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Invalid value for contains_character (must be a single character)'
    });
  }

  next();
};

export const stringValidation = {
  validateStringInput,
  validateQueryParams
};