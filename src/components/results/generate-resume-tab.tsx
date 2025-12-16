'use client';

import { useState } from 'react';
import type { MatchAnalysis, GeneratedResumeResult, OptimizationMode } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Wand2, ArrowRight, Save } from 'lucide-react';
import { LoadingIndicator } from './loading-indicator';
import { ResumeDiff } from './resume-diff';

type GenerateResumeTabProps = {
  isSavedView?: boolean;
  matchAnalysis: MatchAnalysis | null;
  loading: boolean;
  handleGenerate: (mode: OptimizationMode) => void;
  generationResult: GeneratedResumeResult | null;
  originalResumeText: string;
  onSaveGeneratedResume: (title: string, content: string) => void;
};

export function GenerateResumeTab({
  isSavedView,
  matchAnalysis,
  loading,
  handleGenerate,
  generationResult,
  originalResumeText,
  onSaveGeneratedResume
}: GenerateResumeTabProps) {
  const [optimizationMode, setOptimizationMode] =
    useState<OptimizationMode>('Balanced');

  if (isSavedView) {
    return (
      <div className="text-center text-sm text-muted-foreground p-8 border-2 border-dashed rounded-lg min-h-[400px] flex flex-col justify-center items-center gap-4">
        <Wand2 className="h-8 w-8 text-muted-foreground" />
        <p className="max-w-xs">
          The AI Resume Generator is disabled for saved analyses. Go to the main
          page to generate a new resume version.
        </p>
      </div>
    );
  }

  if (!matchAnalysis) {
    return (
      <div className="text-center text-sm text-muted-foreground p-8 border-2 border-dashed rounded-lg min-h-[400px] flex flex-col justify-center items-center gap-4">
        <Wand2 className="h-8 w-8 text-muted-foreground" />
        <p className="max-w-xs">
          Run an analysis first to unlock the AI Resume Generator. The AI uses
          the analysis data to optimize your resume.
        </p>
      </div>
    );
  }

  if (loading) {
    return <LoadingIndicator text="Generating your new resume..." />;
  }
  
  if (generationResult) {
    return (
      <div className="space-y-4">
        <Card className="bg-green-50/50 border-green-200">
            <CardHeader>
                <CardTitle className="font-headline text-lg">Generation Complete!</CardTitle>
                <CardDescription>{generationResult.improvementSummary}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-around gap-4">
                 <div className="text-center">
                    <p className="font-headline text-sm text-muted-foreground">
                        Original Score
                    </p>
                    <p className="text-4xl font-bold">{matchAnalysis.matchScore}%</p>
                </div>
                <ArrowRight className="h-8 w-8 text-green-500" />
                <div className="text-center">
                    <p className="font-headline text-sm text-primary">New Score</p>
                    <p className="text-4xl font-bold text-primary">
                        {generationResult.matchScore}%
                    </p>
                </div>
            </CardContent>
        </Card>

        <ResumeDiff oldStr={originalResumeText} newStr={generationResult.generatedResume} />
        
        <Button onClick={() => onSaveGeneratedResume(`Generated - ${new Date().toLocaleTimeString()}`, generationResult.generatedResume)}>
            <Save className="mr-2 h-4 w-4" />
            Save as New Version
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-headline text-lg font-semibold">
          JD-Aligned AI Resume Generator
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Let AI rewrite your resume to be perfectly aligned with the job
          description. It will only use your existing skills and experience.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Choose Optimization Mode</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={optimizationMode}
            onValueChange={(value: OptimizationMode) => setOptimizationMode(value)}
            className="gap-4"
          >
            <div className="flex items-start space-x-3">
              <RadioGroupItem value="Conservative" id="mode-conservative" />
              <Label htmlFor="mode-conservative" className="font-normal cursor-pointer">
                <span className="font-semibold block">Conservative</span>
                <span className="text-xs text-muted-foreground">
                  Minimal changes. Rewords a few bullet points and adds key
                  skills.
                </span>
              </Label>
            </div>
            <div className="flex items-start space-x-3">
              <RadioGroupItem value="Balanced" id="mode-balanced" />
              <Label htmlFor="mode-balanced" className="font-normal cursor-pointer">
                <span className="font-semibold block">Balanced (Recommended)</span>
                <span className="text-xs text-muted-foreground">
                  Rewrites key sections and reorders content to highlight your
                  most relevant experience.
                </span>
              </Label>
            </div>
            <div className="flex items-start space-x-3">
              <RadioGroupItem value="Aggressive" id="mode-aggressive" />
              <Label htmlFor="mode-aggressive" className="font-normal cursor-pointer">
                <span className="font-semibold block">Aggressive</span>
                <span className="text-xs text-muted-foreground">
                  Performs a full rewrite to maximally align with the job
                  description's language.
                </span>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Button
        onClick={() => handleGenerate(optimizationMode)}
        disabled={loading}
        size="lg"
        className="w-full"
      >
        <Wand2 className="mr-2 h-5 w-5" />
        Generate Aligned Resume
      </Button>
    </div>
  );
}
