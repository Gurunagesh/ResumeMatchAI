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
  TestTube2,
  ClipboardList,
  Save,
} from 'lucide-react';
import { Spinner } from './ui/spinner';
import type { AnalysisResults, MatchAnalysis } from '@/lib/types';
import { useUser } from '@/firebase';
import { LoadingIndicator } from './results/loading-indicator';
import { ResultsEmptyState } from './results/results-empty-state';
import { MatchScoreTab } from './results/match-score-tab';
import { SkillGapTab } from './results/skill-gap-tab';
import { ResumeReportTab } from './results/resume-report-tab';
import { SuggestionsTab } from './results/suggestions-tab';
import { SimulationTab } from './results/simulation-tab';

type ResultsPanelProps = {
  loadingText: string | null;
  isSimulating: boolean;
  isSaving: boolean;
  results: AnalysisResults;
  originalResumeText: string;
  handleSimulate: (modifiedResume: string) => void;
  simulationResult: MatchAnalysis | null;
  handleSaveAnalysis: () => void;
  isSavedView?: boolean;
};

export function ResultsPanel({
  loadingText,
  isSimulating,
  isSaving,
  results,
  originalResumeText,
  handleSimulate,
  simulationResult,
  handleSaveAnalysis,
  isSavedView = false,
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
                  disabled={isSaving || !user}
                >
                  {isSaving ? (
                    <Spinner className="mr-2 h-4 w-4" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save Analysis
                </Button>
              </TooltipTrigger>
              {!user && (
                <TooltipContent>
                  <p>Please log in or sign up to save your analysis.</p>
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
                    <ClipboardList className="mr-1.5 h-4 w-4" />
                    Resume Report
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>An analysis of your resume file for ATS issues.</p>
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
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="simulation" disabled={!matchAnalysis || isSavedView}>
                    <TestTube2 className="mr-1.5 h-4 w-4" />
                    Simulator
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Test changes and see the effect on your score.</p>
                </TooltipContent>
              </Tooltip>
            </TabsList>

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

            <TabsContent value="simulation" className="mt-6">
              <SimulationTab
                originalResumeText={originalResumeText}
                handleSimulate={handleSimulate}
                loading={isSimulating}
                originalMatchScore={results.matchAnalysis?.matchScore}
                simulationResult={simulationResult}
                isSavedView={isSavedView}
              />
            </TabsContent>
          </Tabs>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
