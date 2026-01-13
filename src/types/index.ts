/**
 * Type definitions for the plagiarism detection application
 */

export interface DocumentInput {
  id: string;
  name: string;
  content: string;
  type: 'file' | 'url';
  source: string;
  size?: number;
}

export interface AnalysisRequest {
  documents: DocumentInput[];
  config: {
    kGramSize: number;
    plagiarismThreshold: number;
    useWinnowing: boolean;
    winnowingWindowSize: number;
    removeStopWords: boolean;
    useWordNGrams: boolean;
    wordNGramSize: number;
  };
}

export interface AnalysisResponse {
  success: boolean;
  results?: ComparisonResult[];
  error?: string;
  metadata: {
    totalDocuments: number;
    totalComparisons: number;
    processingTime: number;
    timestamp: string;
  };
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
  similarity: {
    jaccardSimilarity: number;
    cosineSimilarity: number;
    overlapCoefficient: number;
    intersectionSize: number;
    unionSize: number;
    set1Size: number;
    set2Size: number;
  };
  similarityPercentage: number;
  classification: {
    level: 'none' | 'low' | 'medium' | 'high' | 'very-high';
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

export interface DetectorConfig {
  kGramSize: number;
  plagiarismThreshold: number;
  useWinnowing: boolean;
  winnowingWindowSize: number;
  removeStopWords: boolean;
  useWordNGrams: boolean;
  wordNGramSize: number;
}

export interface HighlightedText {
  documentId: string;
  segments: Array<{
    text: string;
    isMatch: boolean;
    matchWith?: string;
  }>;
}
