/**
 * Hashing and Fingerprinting Module
 * 
 * Discrete Math Concepts Applied:
 * - Hash Functions: h: String → Integer (deterministic mapping)
 * - Modular Arithmetic for hash computation
 * - Collision-resistant hashing for uniqueness
 * - Set representation via hash values
 */

export class HashingEngine {
  /**
   * Simple polynomial rolling hash function
   * 
   * Discrete Math Concept: POLYNOMIAL HASH FUNCTION
   * Hash(s) = (s[0] * p^0 + s[1] * p^1 + ... + s[n-1] * p^(n-1)) mod m
   * 
   * Where:
   * - p is a prime number (base)
   * - m is a large prime (modulo)
   * - Provides good distribution and low collision rate
   * 
   * @param str - String to hash
   * @returns Hash value as number
   */
  static simpleHash(str: string): number {
    const prime = 31; // Prime base for polynomial hashing
    const mod = 1e9 + 9; // Large prime modulo
    let hash = 0;
    let power = 1;
    
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      hash = (hash + charCode * power) % mod;
      power = (power * prime) % mod;
    }
    
    return hash;
  }

  /**
   * FNV-1a hash function (Fowler-Noll-Vo)
   * Better distribution than simple polynomial hash
   * 
   * Discrete Math Concept: BITWISE OPERATIONS & MODULAR ARITHMETIC
   * - Uses XOR and multiplication for mixing
   * - Provides excellent avalanche effect
   */
  static fnvHash(str: string): number {
    const FNV_PRIME = 0x01000193;
    const FNV_OFFSET = 0x811c9dc5;
    
    let hash = FNV_OFFSET;
    
    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash = Math.imul(hash, FNV_PRIME);
    }
    
    return hash >>> 0; // Convert to unsigned 32-bit integer
  }

  /**
   * Generates fingerprint set from k-grams using hashing
   * 
   * Discrete Math Concept: SET CONSTRUCTION VIA HASHING
   * - Maps each k-gram to a unique hash value
   * - Creates a SET (no duplicates) of fingerprints
   * - Set representation enables efficient similarity computation
   * 
   * @param kGrams - Array of k-grams
   * @returns Set of hash values (fingerprints)
   */
  static generateFingerprints(kGrams: string[]): Set<number> {
    const fingerprints = new Set<number>();
    
    for (const kGram of kGrams) {
      const hash = this.fnvHash(kGram);
      fingerprints.add(hash);
    }
    
    return fingerprints;
  }

  /**
   * Generates winnowing fingerprints (robust to minor changes)
   * 
   * Discrete Math Concept: WINNOWING ALGORITHM
   * - Selects minimum hash in each window (sliding window minimum)
   * - More robust to insertions/deletions than full k-gram hashing
   * - Guarantees: if two documents share a substring of length > w,
   *   they will share at least one fingerprint
   * 
   * @param kGrams - Array of k-grams
   * @param windowSize - Size of winnowing window
   * @returns Set of selected fingerprints
   */
  static generateWinnowingFingerprints(
    kGrams: string[],
    windowSize: number = 4
  ): Set<number> {
    if (kGrams.length === 0) return new Set();
    
    // Hash all k-grams
    const hashes = kGrams.map(kg => this.fnvHash(kg));
    const fingerprints = new Set<number>();
    
    // Apply winnowing: select minimum hash in each window
    for (let i = 0; i <= hashes.length - windowSize; i++) {
      const window = hashes.slice(i, i + windowSize);
      const minHash = Math.min(...window);
      fingerprints.add(minHash);
    }
    
    return fingerprints;
  }

  /**
   * Computes MinHash signatures for approximate Jaccard similarity
   * 
   * Discrete Math Concept: MINHASH - PROBABILISTIC SET REPRESENTATION
   * - Uses multiple hash functions to create compact signature
   * - Probability that signatures match ≈ Jaccard similarity
   * - Enables fast similarity estimation with small memory footprint
   * 
   * @param elements - Set of elements
   * @param numHashes - Number of hash functions to use
   * @returns MinHash signature array
   */
  static generateMinHashSignature(
    elements: Set<string>,
    numHashes: number = 100
  ): number[] {
    const signature: number[] = [];
    const elementsArray = Array.from(elements);
    
    for (let i = 0; i < numHashes; i++) {
      let minHash = Infinity;
      
      for (const element of elementsArray) {
        // Create different hash by combining element with seed
        const hash = this.fnvHash(element + i.toString());
        minHash = Math.min(minHash, hash);
      }
      
      signature.push(minHash);
    }
    
    return signature;
  }

  /**
   * Estimates Jaccard similarity from MinHash signatures
   * 
   * Discrete Math: |A ∩ B| / |A ∪ B| ≈ matching_hashes / total_hashes
   */
  static estimateSimilarityFromMinHash(
    sig1: number[],
    sig2: number[]
  ): number {
    if (sig1.length !== sig2.length) {
      throw new Error('Signatures must have same length');
    }
    
    let matches = 0;
    for (let i = 0; i < sig1.length; i++) {
      if (sig1[i] === sig2[i]) {
        matches++;
      }
    }
    
    return matches / sig1.length;
  }
}
