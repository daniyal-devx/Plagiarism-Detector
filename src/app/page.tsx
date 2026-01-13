'use client';

import React, { useState } from 'react';
import { FileSearch, BookOpen, Play, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DocumentUploader } from '@/components/DocumentUploader';
import { ConfigurationPanel } from '@/components/ConfigurationPanel';
import { ResultsDashboard } from '@/components/ResultsDashboard';

interface DocumentInput {
  id: string;
  name: string;
  content: string;
  type: 'file' | 'url';
  source: string;
  size?: number;
}

interface DetectorConfig {
  kGramSize: number;
  plagiarismThreshold: number;
  useWinnowing: boolean;
  winnowingWindowSize: number;
  removeStopWords: boolean;
  useWordNGrams: boolean;
  wordNGramSize: number;
}

export default function Home() {
  const [documents, setDocuments] = useState<DocumentInput[]>([]);
  const [config, setConfig] = useState<DetectorConfig>({
    kGramSize: 5,
    plagiarismThreshold: 0.5,
    useWinnowing: false,
    winnowingWindowSize: 4,
    removeStopWords: false,
    useWordNGrams: false,
    wordNGramSize: 3,
  });
  const [results, setResults] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const handleAnalyze = async () => {
    if (documents.length < 2) {
      alert('Please upload at least 2 documents to analyze');
      return;
    }

    setIsAnalyzing(true);
    setResults([]);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documents,
          config,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResults(data.results);
      } else {
        console.error('Analysis failed:', data.error);
        alert('Analysis failed: ' + data.error);
      }
    } catch (error) {
      console.error('Error during analysis:', error);
      alert('An error occurred during analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 p-2">
                <FileSearch className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Plagiarism Detector
                </h1>
                <p className="text-sm text-muted-foreground">
                  Fingerprinting via Hashing & Set Theory
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowInfo(!showInfo)}
            >
              <Info className="mr-2 h-4 w-4" />
              About
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Information Card */}
          {showInfo && (
            <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/20 animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Discrete Mathematics Concepts</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">1. Set Theory</h4>
                  <p className="text-muted-foreground">
                    Documents are represented as sets of fingerprints. We compute:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                    <li><strong>Intersection (A ∩ B)</strong>: Common fingerprints between documents</li>
                    <li><strong>Union (A ∪ B)</strong>: All unique fingerprints from both documents</li>
                    <li><strong>Cardinality |A|</strong>: Number of elements in a set</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">2. Hashing Functions</h4>
                  <p className="text-muted-foreground">
                    Maps text segments (k-grams) to numerical fingerprints: h: String → Integer
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                    <li>Polynomial rolling hash with modular arithmetic</li>
                    <li>FNV-1a hash for better collision resistance</li>
                    <li>Deterministic: same input always produces same hash</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">3. Jaccard Similarity</h4>
                  <p className="text-muted-foreground">
                    Core similarity metric: <code className="bg-white dark:bg-slate-900 px-2 py-1 rounded">J(A, B) = |A ∩ B| / |A ∪ B|</code>
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                    <li>Range: 0 (no similarity) to 1 (identical)</li>
                    <li>Measures ratio of common elements to total unique elements</li>
                    <li>Symmetric: J(A, B) = J(B, A)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">4. K-Gram Generation</h4>
                  <p className="text-muted-foreground">
                    Sliding window algorithm that creates overlapping character sequences
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                    <li>For text of length n, generates (n - k + 1) k-grams</li>
                    <li>Each k-gram is a substring of length k</li>
                    <li>Captures local text patterns for comparison</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">5. Algorithm Pipeline</h4>
                  <p className="text-muted-foreground">
                    Complete detection process:
                  </p>
                  <ol className="list-decimal list-inside mt-2 space-y-1 text-muted-foreground">
                    <li>Preprocess text (normalize, remove punctuation)</li>
                    <li>Generate k-grams using sliding window</li>
                    <li>Apply hash function to create fingerprints</li>
                    <li>Store fingerprints as sets (no duplicates)</li>
                    <li>Compute set operations (intersection, union)</li>
                    <li>Calculate Jaccard similarity coefficient</li>
                    <li>Compare against threshold to detect plagiarism</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Grid */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column: Upload & Config */}
            <div className="space-y-8 lg:col-span-2">
              <section>
                <h2 className="text-xl font-semibold mb-4">Upload Documents</h2>
                <DocumentUploader
                  documents={documents}
                  onDocumentsChange={setDocuments}
                />
              </section>

              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Results</h2>
                  <Button
                    onClick={handleAnalyze}
                    disabled={documents.length < 2 || isAnalyzing}
                    size="lg"
                    className="shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Documents'}
                  </Button>
                </div>
                <ResultsDashboard results={results} isAnalyzing={isAnalyzing} />
              </section>
            </div>

            {/* Right Column: Configuration */}
            <div className="space-y-8">
              <ConfigurationPanel config={config} onConfigChange={setConfig} />

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Documents</span>
                    <span className="font-medium">{documents.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Comparisons</span>
                    <span className="font-medium">
                      {documents.length >= 2
                        ? (documents.length * (documents.length - 1)) / 2
                        : 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Threshold</span>
                    <span className="font-medium">
                      {(config.plagiarismThreshold * 100).toFixed(0)}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Discrete Mathematics Project • Fingerprinting using Hashing and Set Theory
          </p>
        </div>
      </footer>
    </div>
  );
}
