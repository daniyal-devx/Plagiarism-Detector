'use client';

import React from 'react';
import { Settings, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

interface DetectorConfig {
  kGramSize: number;
  plagiarismThreshold: number;
  useWinnowing: boolean;
  winnowingWindowSize: number;
  removeStopWords: boolean;
  useWordNGrams: boolean;
  wordNGramSize: number;
}

interface ConfigurationPanelProps {
  config: DetectorConfig;
  onConfigChange: (config: DetectorConfig) => void;
}

export function ConfigurationPanel({ config, onConfigChange }: ConfigurationPanelProps) {
  const updateConfig = (key: keyof DetectorConfig, value: any) => {
    onConfigChange({ ...config, [key]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5" />
          <span>Detection Settings</span>
        </CardTitle>
        <CardDescription>
          Configure the plagiarism detection algorithm parameters
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* K-Gram Size */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              K-Gram Size: {config.kGramSize}
            </label>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              title="Size of character sequences used for fingerprinting"
            >
              <Info className="h-4 w-4" />
            </Button>
          </div>
          <Slider
            value={[config.kGramSize]}
            onValueChange={([value]) => updateConfig('kGramSize', value)}
            min={3}
            max={10}
            step={1}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Smaller values detect shorter matches, larger values detect longer sequences
          </p>
        </div>

        {/* Plagiarism Threshold */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              Plagiarism Threshold: {(config.plagiarismThreshold * 100).toFixed(0)}%
            </label>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              title="Minimum similarity percentage to flag as plagiarism"
            >
              <Info className="h-4 w-4" />
            </Button>
          </div>
          <Slider
            value={[config.plagiarismThreshold * 100]}
            onValueChange={([value]) => updateConfig('plagiarismThreshold', value / 100)}
            min={10}
            max={90}
            step={5}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Documents with similarity above this threshold are flagged as plagiarized
          </p>
        </div>

        {/* Use Winnowing */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <label className="text-sm font-medium">
              Use Winnowing Algorithm
            </label>
            <p className="text-xs text-muted-foreground">
              More robust to minor text modifications
            </p>
          </div>
          <Button
            variant={config.useWinnowing ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateConfig('useWinnowing', !config.useWinnowing)}
          >
            {config.useWinnowing ? 'Enabled' : 'Disabled'}
          </Button>
        </div>

        {config.useWinnowing && (
          <div className="space-y-3 pl-4 border-l-2 border-primary/20">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                Window Size: {config.winnowingWindowSize}
              </label>
            </div>
            <Slider
              value={[config.winnowingWindowSize]}
              onValueChange={([value]) => updateConfig('winnowingWindowSize', value)}
              min={2}
              max={10}
              step={1}
              className="w-full"
            />
          </div>
        )}

        {/* Use Word N-Grams */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <label className="text-sm font-medium">
              Use Word N-Grams
            </label>
            <p className="text-xs text-muted-foreground">
              Analyze word sequences instead of characters
            </p>
          </div>
          <Button
            variant={config.useWordNGrams ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateConfig('useWordNGrams', !config.useWordNGrams)}
          >
            {config.useWordNGrams ? 'Enabled' : 'Disabled'}
          </Button>
        </div>

        {config.useWordNGrams && (
          <div className="space-y-3 pl-4 border-l-2 border-primary/20">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                Word N-Gram Size: {config.wordNGramSize}
              </label>
            </div>
            <Slider
              value={[config.wordNGramSize]}
              onValueChange={([value]) => updateConfig('wordNGramSize', value)}
              min={2}
              max={5}
              step={1}
              className="w-full"
            />
          </div>
        )}

        {/* Remove Stop Words */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <label className="text-sm font-medium">
              Remove Stop Words
            </label>
            <p className="text-xs text-muted-foreground">
              Filter common words (the, is, and, etc.)
            </p>
          </div>
          <Button
            variant={config.removeStopWords ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateConfig('removeStopWords', !config.removeStopWords)}
          >
            {config.removeStopWords ? 'Enabled' : 'Disabled'}
          </Button>
        </div>

        {/* Reset Button */}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            onConfigChange({
              kGramSize: 5,
              plagiarismThreshold: 0.5,
              useWinnowing: false,
              winnowingWindowSize: 4,
              removeStopWords: false,
              useWordNGrams: false,
              wordNGramSize: 3,
            });
          }}
        >
          Reset to Defaults
        </Button>
      </CardContent>
    </Card>
  );
}
