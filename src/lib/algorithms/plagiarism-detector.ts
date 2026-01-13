/**
 * Main Plagiarism Detection Engine
 * Orchestrates preprocessing, hashing, and similarity computation
 * 
 * DISCRETE MATHEMATICS CONCEPTS USED:
 * 
 * 1. SET THEORY
 *    - Documents represented as sets of fingerprints
 *    - Set operations: Union (∪), Intersection (∩), Difference (\)
 *    - Cardinality: |A| represents size of set A
 * 
 * 2. HASHING
 *    - Hash function: h: String → Integer (deterministic mapping)
 *    - Modular arithmetic for hash computation
 *    - Collision resistance through polynomial rolling hash
 * 
 * 3. JACCARD SIMILARITY
 *    - J(A, B) = |A ∩ B| / |A ∪ B|
 *    - Measures similarity between two sets
 *    - Range: [0, 1], where 1 = identical, 0 = no overlap
 * 
 * 4. K-GRAM GENERATION
 *    - Sliding window algorithm
 *    - Sequence generation from strings
 *    - Creates local text signatures
 * 
 * 5. FINGERPRINTING
 *    - Maps k-grams to hash values
 *    - Creates compact document representation
 *    - Enables efficient comparison
 */

import { TextPreprocessor } from './preprocessing';
import { HashingEngine } from './hashing';
import { SimilarityEngine, type SimilarityResult } from './similarity';

export interface PlagiarismConfig {
  kGramSize: number;
  useWinnowing: boolean;
  winnowingWindowSize: number;
  removeStopWords: boolean;
  useWordNGrams: boolean;
  wordNGramSize: number;
}

export interface DocumentFingerprint {
  documentId: string;
  documentName: string;
  content: string;
  kGrams: string[];
  fingerprints: Set<number>;
  preprocessedText: string;
}

export interface ComparisonResult {
  doc1: {
    id: string;
    name: string;
  };
  doc2: {
    id: string;
    name: string;
  };
  similarity: SimilarityResult;
  similarityPercentage: number;
  classification: {
    level: string;
    label: string;
    color: string;
  };
  isPlagiarized: boolean;
  commonKGrams: Array<{
    kgram: string;
    positions1: number[];
    positions2: number[];
  }>;
}

export class PlagiarismDetector {
  private config: PlagiarismConfig;

  constructor(config: Partial<PlagiarismConfig> = {}) {
    this.config = {
      kGramSize: config.kGramSize ?? 5,
      useWinnowing: config.useWinnowing ?? false,
      winnowingWindowSize: config.winnowingWindowSize ?? 4,
      removeStopWords: config.removeStopWords ?? false,
      useWordNGrams: config.useWordNGrams ?? false,
      wordNGramSize: config.wordNGramSize ?? 3,
    };
  }

  /**
   * STEP 1: Preprocess text
   * - Normalize to lowercase
   * - Remove punctuation
   * - Optionally remove stop words
   */
  private preprocessText(text: string): string {
    let processed = TextPreprocessor.normalize(text);
    
    if (this.config.removeStopWords) {
      processed = TextPreprocessor.removeStopWords(processed);
    }
    
    return processed;
  }

  /**
   * STEP 2: Generate k-grams
   * Creates overlapping subsequences of length k
   */
  private generateKGrams(text: string): string[] {
    if (this.config.useWordNGrams) {
      return TextPreprocessor.generateWordNGrams(text, this.config.wordNGramSize);
    } else {
      return TextPreprocessor.generateKGrams(text, this.config.kGramSize);
    }
  }

  /**
   * STEP 3: Generate fingerprints using hashing
   * Maps k-grams to hash values, creating a set of fingerprints
   */
  private generateFingerprints(kGrams: string[]): Set<number> {
    if (this.config.useWinnowing) {
      return HashingEngine.generateWinnowingFingerprints(
        kGrams,
        this.config.winnowingWindowSize
      );
    } else {
      return HashingEngine.generateFingerprints(kGrams);
    }
  }

  /**
   * Creates a fingerprint for a document
   * Full pipeline: Text → Preprocessing → K-grams → Hashing → Fingerprint Set
   */
  createDocumentFingerprint(
    documentId: string,
    documentName: string,
    content: string
  ): DocumentFingerprint {
    const preprocessedText = this.preprocessText(content);
    const kGrams = this.generateKGrams(preprocessedText);
    const fingerprints = this.generateFingerprints(kGrams);

    return {
      documentId,
      documentName,
      content,
      kGrams,
      fingerprints,
      preprocessedText,
    };
  }

  /**
   * STEP 4: Compare two documents using Jaccard Similarity
   * 
   * Mathematical Formula:
   * Similarity = |Fingerprints_A ∩ Fingerprints_B| / |Fingerprints_A ∪ Fingerprints_B|
   * 
   * Where:
   * - ∩ = Intersection (common elements)
   * - ∪ = Union (all unique elements)
   * - |·| = Cardinality (size of set)
   */
  compareDocuments(
    doc1: DocumentFingerprint,
    doc2: DocumentFingerprint,
    plagiarismThreshold: number = 0.5
  ): ComparisonResult {
    // Compute all similarity metrics using Set Theory
    const similarity = SimilarityEngine.computeAllSimilarities(
      doc1.fingerprints,
      doc2.fingerprints
    );

    // Convert to percentage
    const similarityPercentage = similarity.jaccardSimilarity * 100;

    // Classify similarity level
    const classification = SimilarityEngine.classifySimilarity(
      similarity.jaccardSimilarity
    );

    // Determine if plagiarized based on threshold
    const isPlagiarized = similarity.jaccardSimilarity >= plagiarismThreshold;

    // Find common k-grams for highlighting
    const commonKGrams = SimilarityEngine.findCommonKGrams(
      doc1.kGrams,
      doc2.kGrams
    );

    return {
      doc1: {
        id: doc1.documentId,
        name: doc1.documentName,
      },
      doc2: {
        id: doc2.documentId,
        name: doc2.documentName,
      },
      similarity,
      similarityPercentage,
      classification,
      isPlagiarized,
      commonKGrams: commonKGrams.slice(0, 100), // Limit for performance
    };
  }

  /**
   * Compare one document against multiple documents
   * Returns array of comparison results sorted by similarity
   */
  compareAgainstMultiple(
    targetDoc: DocumentFingerprint,
    documents: DocumentFingerprint[],
    plagiarismThreshold: number = 0.5
  ): ComparisonResult[] {
    const results = documents
      .filter(doc => doc.documentId !== targetDoc.documentId)
      .map(doc => this.compareDocuments(targetDoc, doc, plagiarismThreshold))
      .sort((a, b) => b.similarityPercentage - a.similarityPercentage);

    return results;
  }

  /**
   * Batch compare all documents against each other
   * Returns matrix of pairwise comparisons
   */
  compareAll(
    documents: DocumentFingerprint[],
    plagiarismThreshold: number = 0.5
  ): ComparisonResult[] {
    const results: ComparisonResult[] = [];

    for (let i = 0; i < documents.length; i++) {
      for (let j = i + 1; j < documents.length; j++) {
        const result = this.compareDocuments(
          documents[i],
          documents[j],
          plagiarismThreshold
        );
        results.push(result);
      }
    }

    return results.sort((a, b) => b.similarityPercentage - a.similarityPercentage);
  }

  /**
   * Get detector configuration
   */
  getConfig(): PlagiarismConfig {
    return { ...this.config };
  }

  /**
   * Update detector configuration
   */
  updateConfig(newConfig: Partial<PlagiarismConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}
