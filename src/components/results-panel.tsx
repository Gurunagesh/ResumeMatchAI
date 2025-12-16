'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import {
  Gauge,
  Target,
  Lightbulb,
  ClipboardList,
  Save,
  HelpCircle,
  Wand2,
} from 'lucide-react';
import { Spinner } from './ui/spinner';
import type { AnalysisResults, MatchAnalysis, GeneratedResumeResult } from '@/lib/types';
import { useUser } from '@/firebase';
import { LoadingIndicator } from './results/loading-indicator';
import { ResultsEmptyState } from './results/results-empty-state';
import { MatchScoreTab } from './results/match-score-tab';
import { SkillGapTab } from './results/skill-gap-tab';
import { ResumeReportTab } from './results/resume-report-tab';
import { SuggestionsTab } from './results/suggestions-tab';
import { GenerateResumeTab } from './results/generate-resume-tab';

type ResultsPanelProps = {
  loadingText: string | null;
  isSimulating: boolean;
  isSaving: boolean;
  isGenerating: boolean;
  results: AnalysisResults;
  originalResumeText: string;
  handleSimulate: (modifiedResume: string) => void;
  simulationResult: MatchAnalysis | null;
  handleSaveAnalysis: () => void;
  handleGenerate: (mode: 'Conservative' | 'Balanced' | 'Aggressive') => void;
  generationResult: GeneratedResumeResult | null;
  isSavedView?: boolean;
  onSaveGeneratedResume: (title: string, content: string) => void;
};

export function ResultsPanel({
  loadingText,
  isSimulating,
  isSaving,
  isGenerating,
  results,
  originalResumeText,
  handleSimulate,
  simulationResult,
  handleSaveAnalysis,
  handleGenerate,
  generationResult,
  isSavedView = false,
  onSaveGeneratedResume,
}: ResultsPanelProps) {
  const { resumeAnalysis, matchAnalysis, suggestions, skillGapAnalysis } =
    results;
  const { user } = useUser();

  const isInitialState =
    !resumeAnalysis && !matchAnalysis && !suggestions && !skillGapAnalysis;
  const isLoading = !!loadingText;

  if (isInitialState && !isLoading) {
    return (
      <Card className="shadow-sm h-full bg-white">
        <CardContent className="p-4 h-full">
          <ResultsEmptyState />
        </CardContent>
      </Card>
    );
  }
  
  if (isLoading) {
    return (
      <Card className="shadow-sm h-full">
        <CardContent className="p-4 h-full">
          <LoadingIndicator text={loadingText || 'Loading analysis...'} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline text-xl tracking-tight">
          Analysis Results
        </CardTitle>
        {matchAnalysis && !isSavedView && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveAnalysis}
                  disabled={isSaving || !user || user.isAnonymous}
                >
                  {isSaving ? (
                    <Spinner className="mr-2 h-4 w-4" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save Analysis
                </Button>
              </TooltipTrigger>
              {(!user || user.isAnonymous) && (
                <TooltipContent>
                  <p>Please sign up to save your analysis.</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        )}
      </CardHeader>
      <CardContent>
        <TooltipProvider delayDuration={0}>
          <Tabs defaultValue="match-score" className="min-h-[400px]">
            <TabsList className="grid w-full grid-cols-5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="generate" disabled={!matchAnalysis || isSavedView}>
                    <Wand2 className="mr-1.5 h-4 w-4" />
                    Generate
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Generate a new resume aligned with the job description.</p>
                </TooltipContent>
              </Tooltip>
               <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="match-score" disabled={!matchAnalysis}>
                    <Gauge className="mr-1.5 h-4 w-4" />
                    Match Score
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>How well your resume matches the job.</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="skill-gap" disabled={!skillGapAnalysis && !matchAnalysis}>
                    <Target className="mr-1.5 h-4 w-4" />
                    Skill Gap
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Skills you're missing and how to learn them.</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger
                    value="resume-report"
                    disabled={!resumeAnalysis}
                  >
                    <div className="flex items-center">
                      <ClipboardList className="mr-1.5 h-4 w-4" />
                      ATS Report
                      <HelpCircle className="ml-1.5 h-3 w-3 text-muted-foreground" />
                    </div>
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Analysis of your resume for Applicant Tracking System (ATS) compatibility. This requires a file upload.</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="suggestions" disabled={!suggestions}>
                    <Lightbulb className="mr-1.5 h-4 w-4" />
                    Suggestions
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>AI-powered ideas to improve your resume text.</p>
                </TooltipContent>
              </Tooltip>
            </TabsList>
            
            <TabsContent value="generate" className="mt-6">
              <GenerateResumeTab
                isSavedView={isSavedView}
                matchAnalysis={matchAnalysis}
                loading={isGenerating}
                handleGenerate={handleGenerate}
                generationResult={generationResult}
                originalResumeText={originalResumeText}
                onSaveGeneratedResume={onSaveGeneratedResume}
              />
            </TabsContent>

            <TabsContent value="match-score" className="mt-6">
              <MatchScoreTab matchAnalysis={matchAnalysis} />
            </TabsContent>

            <TabsContent value="skill-gap" className="mt-6">
              <SkillGapTab
                skillGapAnalysis={skillGapAnalysis}
                matchAnalysis={matchAnalysis}
              />
            </TabsContent>

            <TabsContent value="resume-report" className="mt-6">
              <ResumeReportTab resumeAnalysis={resumeAnalysis} />
            </TabsContent>

            <TabsContent value="suggestions" className="mt-6">
              <SuggestionsTab suggestions={suggestions} />
            </TabsContent>

          </Tabs>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
