import { NextRequest, NextResponse } from 'next/server';
import { PlagiarismDetector } from '@/lib/algorithms/plagiarism-detector';

export async function POST(request: NextRequest) {
  try {
    const startTime = Date.now();
    const { documents, config } = await request.json();

    if (!documents || !Array.isArray(documents) || documents.length < 2) {
      return NextResponse.json(
        { success: false, error: 'At least 2 documents are required' },
        { status: 400 }
      );
    }

    // Initialize detector with config
    const detector = new PlagiarismDetector(config);

    // Create fingerprints for all documents
    const fingerprints = documents.map((doc: any) =>
      detector.createDocumentFingerprint(doc.id, doc.name, doc.content)
    );

    // Compare all documents
    const results = detector.compareAll(fingerprints, config.plagiarismThreshold);

    const processingTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      results,
      metadata: {
        totalDocuments: documents.length,
        totalComparisons: results.length,
        processingTime,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Analysis failed',
      },
      { status: 500 }
    );
  }
}
