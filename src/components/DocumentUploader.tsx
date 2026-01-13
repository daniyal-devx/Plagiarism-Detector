'use client';

import React, { useState, useCallback } from 'react';
import { Upload, X, FileText, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn, formatFileSize } from '@/lib/utils';

interface DocumentInput {
  id: string;
  name: string;
  content: string;
  type: 'file' | 'url';
  source: string;
  size?: number;
}

interface DocumentUploaderProps {
  documents: DocumentInput[];
  onDocumentsChange: (documents: DocumentInput[]) => void;
}

export function DocumentUploader({ documents, onDocumentsChange }: DocumentUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const files = Array.from(e.dataTransfer.files);
      await processFiles(files);
    },
    [documents]
  );

  const handleFileInput = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const files = Array.from(e.target.files);
        await processFiles(files);
      }
    },
    [documents]
  );

  const processFiles = async (files: File[]) => {
    const newDocuments: DocumentInput[] = [];

    for (const file of files) {
      const content = await readFileContent(file);
      newDocuments.push({
        id: generateId(),
        name: file.name,
        content,
        type: 'file',
        source: file.name,
        size: file.size,
      });
    }

    onDocumentsChange([...documents, ...newDocuments]);
  };

  const readFileContent = async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (ext === 'txt') {
      return await file.text();
    } else if (ext === 'pdf' || ext === 'docx') {
      // For demo purposes - in production, parse these on server
      return `[Content from ${file.name}]`;
    }

    return '';
  };

  const handleAddUrl = async () => {
    if (!urlInput.trim()) return;

    setIsLoadingUrl(true);
    try {
      // In production, fetch URL content via API
      const response = await fetch('/api/fetch-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput }),
      });

      if (response.ok) {
        const data = await response.json();
        const newDoc: DocumentInput = {
          id: generateId(),
          name: new URL(urlInput).hostname,
          content: data.text,
          type: 'url',
          source: urlInput,
        };
        onDocumentsChange([...documents, newDoc]);
        setUrlInput('');
      }
    } catch (error) {
      console.error('Error fetching URL:', error);
    } finally {
      setIsLoadingUrl(false);
    }
  };

  const removeDocument = (id: string) => {
    onDocumentsChange(documents.filter((doc) => doc.id !== id));
  };

  const generateId = () => {
    return `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  return (
    <div className="space-y-6">
      {/* File Drop Zone */}
      <Card className={cn(
        'border-2 border-dashed transition-colors',
        dragActive ? 'border-primary bg-primary/5' : 'border-muted'
      )}>
        <CardContent className="p-8">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className="flex flex-col items-center justify-center space-y-4 text-center"
          >
            <Upload className="h-12 w-12 text-muted-foreground" />
            <div>
              <p className="text-lg font-medium">
                Drop files here or click to browse
              </p>
              <p className="text-sm text-muted-foreground">
                Supports TXT, PDF, DOCX files
              </p>
            </div>
            <input
              type="file"
              multiple
              accept=".txt,.pdf,.docx"
              onChange={handleFileInput}
              className="hidden"
              id="file-input"
            />
            <Button asChild>
              <label htmlFor="file-input" className="cursor-pointer">
                Select Files
              </label>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* URL Input */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <LinkIcon className="h-5 w-5 text-muted-foreground" />
            <input
              type="url"
              placeholder="Enter URL to fetch document..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddUrl()}
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <Button onClick={handleAddUrl} disabled={isLoadingUrl || !urlInput.trim()}>
              {isLoadingUrl ? 'Loading...' : 'Add URL'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Document List */}
      {documents.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            Uploaded Documents ({documents.length})
          </h3>
          <div className="space-y-2">
            {documents.map((doc) => (
              <Card key={doc.id} className="group hover:shadow-md transition-shadow">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {doc.type === 'file' && doc.size && formatFileSize(doc.size)}
                        {doc.type === 'url' && `URL: ${doc.source}`}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeDocument(doc.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
