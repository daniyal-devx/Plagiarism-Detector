'use client';

import React from 'react';
import { AlertCircle, CheckCircle, Download, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn, downloadJSON, generateReportFilename } from '@/lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface ComparisonResult {
  doc1: { id: string; name: string };
  doc2: { id: string; name: string };
  similarity: any;
  similarityPercentage: number;
  classification: {
    level: string;
    label: string;
    color: string;
  };
  isPlagiarized: boolean;
  commonKGrams: any[];
}

interface ResultsDashboardProps {
  results: ComparisonResult[];
  isAnalyzing: boolean;
}

export function ResultsDashboard({ results, isAnalyzing }: ResultsDashboardProps) {
  if (isAnalyzing) {
    return (
      <Card>
        <CardContent className="p-12">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
            <div>
              <p className="text-lg font-medium">Analyzing documents...</p>
              <p className="text-sm text-muted-foreground">
                Computing fingerprints and similarity metrics
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="p-12">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <BarChart3 className="h-12 w-12 text-muted-foreground" />
            <div>
              <p className="text-lg font-medium">No results yet</p>
              <p className="text-sm text-muted-foreground">
                Upload at least 2 documents and click "Analyze" to detect plagiarism
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const plagiarizedCount = results.filter((r) => r.isPlagiarized).length;
  const averageSimilarity =
    results.reduce((sum, r) => sum + r.similarityPercentage, 0) / results.length;

  const chartData = results.slice(0, 10).map((result) => ({
    name: `${result.doc1.name.substring(0, 15)} vs ${result.doc2.name.substring(0, 15)}`,
    similarity: result.similarityPercentage,
    isPlagiarized: result.isPlagiarized,
  }));

  const handleDownloadReport = () => {
    downloadJSON(
      {
        timestamp: new Date().toISOString(),
        summary: {
          totalComparisons: results.length,
          plagiarizedPairs: plagiarizedCount,
          averageSimilarity: averageSimilarity.toFixed(2),
        },
        results: results.map((r) => ({
          document1: r.doc1.name,
          document2: r.doc2.name,
          similarityPercentage: r.similarityPercentage.toFixed(2),
          isPlagiarized: r.isPlagiarized,
          jaccardSimilarity: r.similarity.jaccardSimilarity.toFixed(4),
          cosineSimilarity: r.similarity.cosineSimilarity.toFixed(4),
        })),
      },
      generateReportFilename()
    );
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Comparisons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{results.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Plagiarized Pairs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-3xl font-bold text-red-600">{plagiarizedCount}</div>
              {plagiarizedCount > 0 && (
                <AlertCircle className="h-6 w-6 text-red-600" />
              )}
              {plagiarizedCount === 0 && (
                <CheckCircle className="h-6 w-6 text-green-600" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Similarity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {averageSimilarity.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Results */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>
                Detailed similarity analysis between documents
              </CardDescription>
            </div>
            <Button onClick={handleDownloadReport} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="chart">Chart View</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-4 mt-6">
              {results.map((result, index) => (
                <Card
                  key={index}
                  className={cn(
                    'border-l-4',
                    result.isPlagiarized
                      ? 'border-l-red-500'
                      : 'border-l-green-500'
                  )}
                >
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="font-medium">
                            {result.doc1.name} vs {result.doc2.name}
                          </p>
                          <p className={cn('text-sm font-medium', result.classification.color)}>
                            {result.classification.label}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">
                            {result.similarityPercentage.toFixed(1)}%
                          </p>
                          {result.isPlagiarized && (
                            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/20 dark:text-red-400">
                              Plagiarized
                            </span>
                          )}
                        </div>
                      </div>

                      <Progress
                        value={result.similarityPercentage}
                        className="h-2"
                      />

                      <div className="grid grid-cols-3 gap-4 pt-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Jaccard</p>
                          <p className="font-medium">
                            {(result.similarity.jaccardSimilarity * 100).toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Cosine</p>
                          <p className="font-medium">
                            {(result.similarity.cosineSimilarity * 100).toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Overlap</p>
                          <p className="font-medium">
                            {(result.similarity.overlapCoefficient * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 text-sm text-muted-foreground">
                        <p>
                          Common fingerprints: {result.similarity.intersectionSize} / {result.similarity.unionSize}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="chart" className="mt-6">
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      label={{
                        value: 'Similarity %',
                        angle: -90,
                        position: 'insideLeft',
                      }}
                    />
                    <Tooltip />
                    <Bar dataKey="similarity" radius={[8, 8, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.isPlagiarized ? '#ef4444' : '#22c55e'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
