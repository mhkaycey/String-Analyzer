class NaturalLanguageParser {
  parseQuery(query) {
    const lowerQuery = query.toLowerCase();
    const filters = {};

    try {
      // Palindrome
      if (lowerQuery.includes('palindrome')) {
        filters.is_palindrome = !lowerQuery.includes('non');
      }

      // Word count
      if (lowerQuery.includes('single word') || lowerQuery.includes('one word')) {
        filters.word_count = 1;
      }
      const wordCountMatch = lowerQuery.match(/(\d+)\s+words?/);
      if (wordCountMatch) {
        filters.word_count = parseInt(wordCountMatch[1]);
      }

      // Length conditions
      const longerThanMatch = lowerQuery.match(/longer than (\d+) characters?/);
      if (longerThanMatch) {
        filters.min_length = parseInt(longerThanMatch[1]) + 1;
      }
      const shorterThanMatch = lowerQuery.match(/shorter than (\d+) characters?/);
      if (shorterThanMatch) {
        filters.max_length = parseInt(shorterThanMatch[1]) - 1;
      }

      // Character containment
      const multipleCharsMatch = lowerQuery.match(/contain(?:s|ing)? (?:the letters |letters )([a-z,\s]+)/);
      if (multipleCharsMatch) {
        filters.contains_characters = multipleCharsMatch[1].replace(/\s+/g, '').split(',');
      } else {
        const containsMatch = lowerQuery.match(/contain(?:s|ing)? (?:the letter |the character )?([a-z])/);
        if (containsMatch) {
          filters.contains_character = containsMatch[1];
        }
      }

      // Heuristic vowel reference
      if (lowerQuery.includes('first vowel') || lowerQuery.includes('letter a')) {
        filters.contains_character = 'a';
      }

      if (Object.keys(filters).length === 0) {
        throw new Error('Unable to parse natural language query');
      }

      return {
        original: query,
        parsed_filters: filters
      };

    } catch (error) {
      throw new Error('Unable to parse natural language query');
    }
  }

  validateFilters(filters) {
    if (filters.min_length && filters.max_length && filters.min_length > filters.max_length) {
      throw new Error('Conflicting filters: min_length cannot be greater than max_length');
    }
    return true;
  }
}

export const naturalLanguageParser = new NaturalLanguageParser();
