
const validateStringInput = (req, res, next) => {
  const { value } = req.body;

  if (!value) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Invalid request body or missing "value" field'
    });
  }

  if (typeof value !== 'string') {
    return res.status(422).json({
      error: 'Unprocessable Entity',
      message: 'invalid data type for "value" (must be string)'
    });
  }

  next();
};

const validateQueryParams = (req, res, next) => {
  console.log('Validating query params:', req.query);

  const validParams = ['is_palindrome', 'min_length', 'max_length', 'word_count', 'contains_character'];
  const providedParams = Object.keys(req.query);

//   if (providedParams.length === 0) {
//     return res.status(400).json({
//       error: 'Bad Request',
//       message: 'At least one query parameter (is_palindrome, min_length, max_length, word_count, contains_character) is required'
//     });
//   }

  for (const param of providedParams) {
    if (!validParams.includes(param)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid query parameter values or types'
      });
    }
  }

  if (req.query.is_palindrome && !['true', 'false'].includes(req.query.is_palindrome)) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Invalid query parameter values or types'
    });
  }

  if (req.query.min_length && (isNaN(req.query.min_length) || parseInt(req.query.min_length) < 0)) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Invalid query parameter values or types'
    });
  }

  if (req.query.max_length && (isNaN(req.query.max_length) || parseInt(req.query.max_length) < 0)) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Invalid query parameter values or types'
    });
  }

  if (req.query.min_length && req.query.max_length && parseInt(req.query.min_length) > parseInt(req.query.max_length)) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'min_length cannot be greater than max_length'
    });
  }

  if (req.query.word_count && (isNaN(req.query.word_count) || parseInt(req.query.word_count) < 0)) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Invalid query parameter values or types'
    });
  }

  if (req.query.contains_character && (typeof req.query.contains_character !== 'string' || req.query.contains_character.length !== 1)) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Invalid query parameter values or types'
    });
  }

  next();
};

export const stringValidation = {
  validateStringInput,
  validateQueryParams
};