  import crypto from 'crypto';
 class StringAnalysis {
  constructor(value) {
    this.id = this.generateSHA256(value);
    this.value = value;
    this.properties = this.analyzeString(value);
    this.created_at = new Date().toISOString();
  }

  generateSHA256(text) {
  
    return crypto.createHash('sha256').update(text).digest('hex');
  }

  analyzeString(str) {
    // Remove whitespace and convert to lowercase for palindrome check
    const cleanStr = str.replace(/\s/g, '').toLowerCase();
    const reversed = cleanStr.split('').reverse().join('');
    
    // Character frequency map
    const frequencyMap = {};
    for (const char of str) {
      frequencyMap[char] = (frequencyMap[char] || 0) + 1;
    }

    // Word count (split by whitespace and filter empty strings)
    const words = str.trim().split(/\s+/).filter(word => word.length > 0);
    
    // Unique characters (case sensitive)
    const uniqueChars = new Set(str.split('')).size;

    return {
      length: str.length,
      is_palindrome: cleanStr === reversed,
      unique_characters: uniqueChars,
      word_count: words.length,
      sha256_hash: this.id,
      character_frequency_map: frequencyMap
    };
  }
}

export {StringAnalysis};