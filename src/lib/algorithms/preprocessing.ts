/**
 * Text Preprocessing Module
 * 
 * Discrete Math Concepts Applied:
 * - String operations as sequence transformations
 * - Character sets and alphabet mapping
 * - Normalization as set operations
 */

export class TextPreprocessor {
  /**
   * Normalizes text to lowercase and removes punctuation
   * Mathematical Operation: String → String (transformation function)
   */
  static normalize(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')  // Remove punctuation
      .replace(/\s+/g, ' ')      // Normalize whitespace
      .trim();
  }

  /**
   * Tokenizes text into words
   * Mathematical Operation: String → Set of Strings
   */
  static tokenize(text: string): string[] {
    return this.normalize(text).split(' ').filter(word => word.length > 0);
  }

  /**
   * Generates k-grams (sliding window of k consecutive characters)
   * 
   * Discrete Math Concept: SLIDING WINDOW & SEQUENCE GENERATION
   * - For a text of length n, generates (n - k + 1) k-grams
   * - Each k-gram is a substring of length k
   * - Used for fingerprinting and local similarity detection
   * 
   * @param text - Input text
   * @param k - Size of each gram
   * @returns Array of k-grams
   */
  static generateKGrams(text: string, k: number = 5): string[] {
    const normalized = this.normalize(text);
    const kGrams: string[] = [];
    
    for (let i = 0; i <= normalized.length - k; i++) {
      kGrams.push(normalized.substring(i, i + k));
    }
    
    return kGrams;
  }

  /**
   * Generates word-level n-grams (shingles)
   * 
   * Discrete Math Concept: SHINGLE GENERATION
   * - Creates overlapping sequences of n words
   * - More semantic than character-level k-grams
   * 
   * @param text - Input text
   * @param n - Number of words per shingle
   * @returns Array of word n-grams
   */
  static generateWordNGrams(text: string, n: number = 3): string[] {
    const words = this.tokenize(text);
    const nGrams: string[] = [];
    
    for (let i = 0; i <= words.length - n; i++) {
      nGrams.push(words.slice(i, i + n).join(' '));
    }
    
    return nGrams;
  }

  /**
   * Removes common stop words
   * Mathematical Operation: Set difference (original_words \ stop_words)
   */
  static removeStopWords(text: string): string {
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'is', 'was', 'are', 'were', 'be', 'been', 'being',
      'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
      'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those'
    ]);
    
    const words = this.tokenize(text);
    return words.filter(word => !stopWords.has(word)).join(' ');
  }
}
