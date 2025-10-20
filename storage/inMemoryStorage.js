import crypto from 'crypto';
class InMemoryStorage {
  constructor() {
    this.strings = new Map(); }

  save(stringData) {
    this.strings.set(stringData.id, stringData);
    return stringData;
  }

  findByHash(hash) {
    return this.strings.get(hash) || null;
  }

  findByValue(value) {
    const hash = this.generateSHA256(value);
    return this.strings.get(hash) || null;
  }

  findAll() {
    return Array.from(this.strings.values());
  }

  deleteByHash(hash) {
    return this.strings.delete(hash);
  }

  generateSHA256(text) {
   
    return crypto.createHash('sha256').update(text).digest('hex');
  }

  // Filter strings based on criteria
  filterStrings(filters) {
    let allStrings = this.findAll();
    
    if (filters.is_palindrome !== undefined) {
      allStrings = allStrings.filter(s => s.properties.is_palindrome === filters.is_palindrome);
    }
    
    if (filters.min_length !== undefined) {
      allStrings = allStrings.filter(s => s.properties.length >= filters.min_length);
    }
    
    if (filters.max_length !== undefined) {
      allStrings = allStrings.filter(s => s.properties.length <= filters.max_length);
    }
    
    if (filters.word_count !== undefined) {
      allStrings = allStrings.filter(s => s.properties.word_count === filters.word_count);
    }
    
    if (filters.contains_character !== undefined) {
      allStrings = allStrings.filter(s => 
        s.value.toLowerCase().includes(filters.contains_character.toLowerCase())
      );
    }
    
    return allStrings;
  }
}


export const storage = new InMemoryStorage();