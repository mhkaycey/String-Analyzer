class NaturalLanguageParser {
  parseQuery(query) {
    const lowerQuery = query.toLowerCase();
    const filters = {};

    try {
      // Parse for palindrome
      if (lowerQuery.includes('palindrome')) {
        filters.is_palindrome = true;
      }

      // Parse for single word
      if (lowerQuery.includes('single word') || lowerQuery.includes('one word')) {
        filters.word_count = 1;
      }

      // Parse for length conditions
      const longerThanMatch = lowerQuery.match(/longer than (\d+) characters?/);
      if (longerThanMatch) {
        filters.min_length = parseInt(longerThanMatch[1]) + 1;
      }

      const shorterThanMatch = lowerQuery.match(/shorter than (\d+) characters?/);
      if (shorterThanMatch) {
        filters.max_length = parseInt(shorterThanMatch[1]) - 1;
      }

      // Parse for character containment
      const containsMatch = lowerQuery.match(/contain(s|ing)? (the letter |the character )?([a-z])/);
      if (containsMatch) {
        filters.contains_character = containsMatch[3];
      }

      // Parse for specific character mentions (like "first vowel")
      if (lowerQuery.includes('first vowel') || lowerQuery.includes('letter a')) {
        filters.contains_character = 'a';
      }

      // Parse for exact word count
      const wordCountMatch = lowerQuery.match(/(\d+) words?/);
      if (wordCountMatch) {
        filters.word_count = parseInt(wordCountMatch[1]);
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
    // Check for conflicting filters
    if (filters.min_length !== undefined && filters.max_length !== undefined) {
      if (filters.min_length > filters.max_length) {
        throw new Error('Conflicting filters: min_length cannot be greater than max_length');
      }
    }

    return true;
  }
}

export const naturalLanguageParser = new NaturalLanguageParser();