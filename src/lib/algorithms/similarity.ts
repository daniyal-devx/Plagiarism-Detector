/**
 * Similarity Computation Module
 * 
 * Discrete Math Concepts Applied:
 * - SET THEORY: Union, Intersection, Cardinality
 * - JACCARD SIMILARITY: |A ∩ B| / |A ∪ B|
 * - COSINE SIMILARITY: Vector operations
 * - OVERLAP COEFFICIENT: |A ∩ B| / min(|A|, |B|)
 */

export interface SimilarityResult {
  jaccardSimilarity: number;
  cosineSimilarity: number;
  overlapCoefficient: number;
  intersectionSize: number;
  unionSize: number;
  set1Size: number;
  set2Size: number;
}

export class SimilarityEngine {
  /**
   * Computes set intersection
   * 
   * Discrete Math: A ∩ B = {x | x ∈ A AND x ∈ B}
   * 
   * @param set1 - First set
   * @param set2 - Second set
   * @returns Intersection set
   */
  static intersection<T>(set1: Set<T>, set2: Set<T>): Set<T> {
    const result = new Set<T>();
    
    // Iterate through smaller set for efficiency
    const [smaller, larger] = set1.size < set2.size 
      ? [set1, set2] 
      : [set2, set1];
    
    for (const item of smaller) {
      if (larger.has(item)) {
        result.add(item);
      }
    }
    
    return result;
  }

  /**
   * Computes set union
   * 
   * Discrete Math: A ∪ B = {x | x ∈ A OR x ∈ B}
   * 
   * @param set1 - First set
   * @param set2 - Second set
   * @returns Union set
   */
  static union<T>(set1: Set<T>, set2: Set<T>): Set<T> {
    const result = new Set<T>(set1);
    
    for (const item of set2) {
      result.add(item);
    }
    
    return result;
  }

  /**
   * Computes set difference
   * 
   * Discrete Math: A \ B = {x | x ∈ A AND x ∉ B}
   * 
   * @param set1 - First set
   * @param set2 - Second set
   * @returns Difference set (elements in set1 but not in set2)
   */
  static difference<T>(set1: Set<T>, set2: Set<T>): Set<T> {
    const result = new Set<T>();
    
    for (const item of set1) {
      if (!set2.has(item)) {
        result.add(item);
      }
    }
    
    return result;
  }

  /**
   * Computes Jaccard Similarity Coefficient
   * 
   * Discrete Math Concept: JACCARD SIMILARITY
   * 
   * J(A, B) = |A ∩ B| / |A ∪ B|
   * 
   * Properties:
   * - Range: [0, 1]
   * - J(A, B) = 1 if A = B
   * - J(A, B) = 0 if A ∩ B = ∅
   * - Symmetric: J(A, B) = J(B, A)
   * 
   * @param set1 - First set of fingerprints
   * @param set2 - Second set of fingerprints
   * @returns Jaccard similarity (0 to 1)
   */
  static computeJaccardSimilarity<T>(set1: Set<T>, set2: Set<T>): number {
    if (set1.size === 0 && set2.size === 0) {
      return 1.0; // Both empty sets are identical
    }
    
    const intersection = this.intersection(set1, set2);
    const union = this.union(set1, set2);
    
    return intersection.size / union.size;
  }

  /**
   * Computes Overlap Coefficient (Szymkiewicz–Simpson coefficient)
   * 
   * Discrete Math Concept: OVERLAP COEFFICIENT
   * 
   * O(A, B) = |A ∩ B| / min(|A|, |B|)
   * 
   * More lenient than Jaccard - measures if smaller set is subset of larger
   * Useful when documents have significantly different sizes
   * 
   * @param set1 - First set
   * @param set2 - Second set
   * @returns Overlap coefficient (0 to 1)
   */
  static computeOverlapCoefficient<T>(set1: Set<T>, set2: Set<T>): number {
    if (set1.size === 0 || set2.size === 0) {
      return 0;
    }
    
    const intersection = this.intersection(set1, set2);
    const minSize = Math.min(set1.size, set2.size);
    
    return intersection.size / minSize;
  }

  /**
   * Computes Cosine Similarity using set-based approach
   * 
   * Discrete Math Concept: COSINE SIMILARITY
   * 
   * cos(A, B) = |A ∩ B| / sqrt(|A| * |B|)
   * 
   * Treats sets as binary vectors (1 if element present, 0 otherwise)
   * 
   * @param set1 - First set
   * @param set2 - Second set
   * @returns Cosine similarity (0 to 1)
   */
  static computeCosineSimilarity<T>(set1: Set<T>, set2: Set<T>): number {
    if (set1.size === 0 || set2.size === 0) {
      return 0;
    }
    
    const intersection = this.intersection(set1, set2);
    const denominator = Math.sqrt(set1.size * set2.size);
    
    return intersection.size / denominator;
  }

  /**
   * Computes Dice Coefficient (Sørensen–Dice coefficient)
   * 
   * Discrete Math: D(A, B) = 2|A ∩ B| / (|A| + |B|)
   * 
   * Emphasizes intersection more than Jaccard
   */
  static computeDiceCoefficient<T>(set1: Set<T>, set2: Set<T>): number {
    if (set1.size === 0 && set2.size === 0) {
      return 1.0;
    }
    
    const intersection = this.intersection(set1, set2);
    return (2 * intersection.size) / (set1.size + set2.size);
  }

  /**
   * Computes comprehensive similarity metrics
   * 
   * @param set1 - First set of fingerprints
   * @param set2 - Second set of fingerprints
   * @returns Object containing multiple similarity metrics
   */
  static computeAllSimilarities<T>(
    set1: Set<T>,
    set2: Set<T>
  ): SimilarityResult {
    const intersection = this.intersection(set1, set2);
    const union = this.union(set1, set2);
    
    return {
      jaccardSimilarity: this.computeJaccardSimilarity(set1, set2),
      cosineSimilarity: this.computeCosineSimilarity(set1, set2),
      overlapCoefficient: this.computeOverlapCoefficient(set1, set2),
      intersectionSize: intersection.size,
      unionSize: union.size,
      set1Size: set1.size,
      set2Size: set2.size,
    };
  }

  /**
   * Finds common k-grams between two texts
   * 
   * @param kGrams1 - K-grams from first text
   * @param kGrams2 - K-grams from second text
   * @returns Array of common k-grams with their positions
   */
  static findCommonKGrams(
    kGrams1: string[],
    kGrams2: string[]
  ): Array<{ kgram: string; positions1: number[]; positions2: number[] }> {
    const kGramMap1 = new Map<string, number[]>();
    const kGramMap2 = new Map<string, number[]>();
    
    // Build position maps
    kGrams1.forEach((kg, idx) => {
      if (!kGramMap1.has(kg)) {
        kGramMap1.set(kg, []);
      }
      kGramMap1.get(kg)!.push(idx);
    });
    
    kGrams2.forEach((kg, idx) => {
      if (!kGramMap2.has(kg)) {
        kGramMap2.set(kg, []);
      }
      kGramMap2.get(kg)!.push(idx);
    });
    
    // Find common k-grams
    const common: Array<{ kgram: string; positions1: number[]; positions2: number[] }> = [];
    
    for (const [kgram, positions1] of kGramMap1.entries()) {
      if (kGramMap2.has(kgram)) {
        common.push({
          kgram,
          positions1,
          positions2: kGramMap2.get(kgram)!,
        });
      }
    }
    
    return common;
  }

  /**
   * Classifies similarity level based on threshold
   * 
   * @param similarity - Similarity score (0 to 1)
   * @returns Classification label
   */
  static classifySimilarity(similarity: number): {
    level: 'none' | 'low' | 'medium' | 'high' | 'very-high';
    label: string;
    color: string;
  } {
    if (similarity >= 0.8) {
      return {
        level: 'very-high',
        label: 'Very High Similarity',
        color: 'text-red-600 dark:text-red-400',
      };
    } else if (similarity >= 0.6) {
      return {
        level: 'high',
        label: 'High Similarity',
        color: 'text-orange-600 dark:text-orange-400',
      };
    } else if (similarity >= 0.4) {
      return {
        level: 'medium',
        label: 'Medium Similarity',
        color: 'text-yellow-600 dark:text-yellow-400',
      };
    } else if (similarity >= 0.2) {
      return {
        level: 'low',
        label: 'Low Similarity',
        color: 'text-blue-600 dark:text-blue-400',
      };
    } else {
      return {
        level: 'none',
        label: 'Minimal Similarity',
        color: 'text-green-600 dark:text-green-400',
      };
    }
  }
}
