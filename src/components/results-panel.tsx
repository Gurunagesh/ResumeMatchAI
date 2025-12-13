'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import {
  AlertTriangle,
  FileText,
  Gauge,
  HelpCircle,
  Lightbulb,
  List,
  Rocket,
  Sparkles,
  Target,
  User,
  TestTube2,
  ArrowRight,
} from 'lucide-react';
import { MatchScoreChart } from './match-score-chart';
import { Spinner } from './ui/spinner';
import type { AnalysisResults, MatchAnalysis } from '@/lib/types';
import { useState, useEffect } from 'react';
import { Textarea } from './ui/textarea';

type ResultsPanelProps = {
  loading: {
    isParsing: boolean;
    isMatching: boolean;
    isSuggesting: boolean;
    isAnalyzingGap: boolean;
    isSimulating: boolean;
  };
  results: AnalysisResults;
  originalResumeText: string;
  handleSimulate: (modifiedResume: string) => void;
  simulationResult: MatchAnalysis | null;
};

const LoadingIndicator = ({ text }: { text: string }) => (
  <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-8 text-center h-full">
    <Spinner className="h-8 w-8 text-muted-foreground" />
    <p className="text-muted-foreground">{text}</p>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-8 text-center h-full">
    <Sparkles className="h-10 w-10 text-muted-foreground" />
    <h3 className="font-headline text-lg font-semibold">
      Your AI Analysis Will Appear Here
    </h3>
    <p className="text-sm text-muted-foreground">
      Enter a job description and your resume, then click "Run AI Analysis".
    </p>
  </div>
);

const SimulationPanel = ({
  originalResumeText,
  handleSimulate,
  loading,
  originalMatchScore,
  simulationResult,
}: {
  originalResumeText: string;
  handleSimulate: (text: string) => void;
  loading: boolean;
  originalMatchScore?: number;
  simulationResult: MatchAnalysis | null;
}) => {
  const [modifiedResume, setModifiedResume] = useState(originalResumeText);

  useEffect(() => {
    setModifiedResume(originalResumeText);
  }, [originalResumeText]);
  
  if (originalMatchScore === undefined) {
    return (
       <p className="text-center text-sm text-muted-foreground p-8">
        Run an analysis first to unlock the "What-If" simulator.
      </p>
    )
  }

  return (
    <div className="space-y-4">
       <h3 className="font-headline text-lg font-semibold">
        "What-If" Resume Simulator
      </h3>
      <p className="text-sm text-muted-foreground">
        Curious if a change will improve your score? Edit your resume below and simulate the result before you make the change for real.
      </p>
      <Textarea
        value={modifiedResume}
        onChange={(e) => setModifiedResume(e.target.value)}
        className="min-h-[250px] text-sm"
        placeholder="Your modified resume text goes here..."
      />
      <Button onClick={() => handleSimulate(modifiedResume)} disabled={loading}>
        {loading ? <Spinner className="mr-2" /> : <TestTube2 className="mr-2 h-4 w-4" /> }
        Simulate Score Change
      </Button>

      {loading && <LoadingIndicator text="Simulating new score..." />}
      
      {!loading && simulationResult && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-md">Simulation Results</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-around gap-4">
             <div className="text-center">
                <p className="font-headline text-sm text-muted-foreground">Original Score</p>
                <p className="text-4xl font-bold">{originalMatchScore}%</p>
             </div>
             <ArrowRight className="h-8 w-8 text-primary" />
             <div className="text-center">
                <p className="font-headline text-sm text-muted-foreground">New Score</p>
                <p className="text-4xl font-bold text-primary">{simulationResult.matchScore}%</p>
             </div>
          </CardContent>
        </Card>
      )}
    </div>
  )

};

export function ResultsPanel({
  loading,
  results,
  originalResumeText,
  handleSimulate,
  simulationResult,
}: ResultsPanelProps) {
  const { resumeAnalysis, matchAnalysis, suggestions, skillGapAnalysis } =
    results;
  const isInitialState =
    !resumeAnalysis && !matchAnalysis && !suggestions && !skillGapAnalysis;
  const isLoading =
    loading.isParsing ||
    loading.isMatching ||
    loading.isSuggesting ||
    loading.isAnalyzingGap;

  if (isInitialState && !isLoading) {
    return (
      <Card className="shadow-lg h-full">
        <CardContent className="p-4 h-full">
          <EmptyState />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-xl">
          Analysis Results
        </CardTitle>
      </CardHeader>
      <CardContent>
      <TooltipProvider>
        <Tabs defaultValue="match-score">
          <TabsList className="grid w-full grid-cols-5">
            <Tooltip>
                <TooltipTrigger asChild>
                    <TabsTrigger value="match-score">
                        <Gauge className="mr-2 h-4 w-4" />
                        Match Score
                    </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>How well your resume matches the job.</TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <TabsTrigger value="skill-gap">
                        <Target className="mr-2 h-4 w-4" />
                        Skill Gap
                    </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>Skills you're missing and how to learn them.</TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <TabsTrigger value="resume-report">
                        <FileText className="mr-2 h-4 w-4" />
                        Resume Report
                    </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>An analysis of your resume file for ATS issues.</TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <TabsTrigger value="suggestions">
                        <Lightbulb className="mr-2 h-4 w-4" />
                        Suggestions
                    </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>AI-powered ideas to improve your resume text.</TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <TabsTrigger value="simulation">
                        <TestTube2 className="mr-2 h-4 w-4" />
                        Simulator
                    </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>Test changes to your resume and see the effect on your score.</TooltipContent>
            </Tooltip>
          </TabsList>

          <TabsContent value="match-score" className="mt-4">
            {loading.isMatching ? (
              <LoadingIndicator text="Calculating your match score..." />
            ) : matchAnalysis ? (
              <div className="space-y-6">
                <div className="flex flex-col items-center justify-center gap-4 rounded-lg bg-muted/50 p-6">
                  <h3 className="font-headline text-lg font-semibold flex items-center gap-2">
                    Job-Resume Match Score
                    <Tooltip>
                        <TooltipTrigger asChild><HelpCircle className="w-4 h-4 text-muted-foreground cursor-pointer" /></TooltipTrigger>
                        <TooltipContent><p className="max-w-xs">This score represents the alignment between your resume and the job description, based on skills, experience, and keywords.</p></TooltipContent>
                    </Tooltip>
                  </h3>
                  <MatchScoreChart score={matchAnalysis.matchScore} />
                </div>
                <div>
                  <h4 className="font-headline text-md font-semibold mb-2">
                    Relevance Highlights
                  </h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {matchAnalysis.relevanceHighlights}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-center text-sm text-muted-foreground p-8">
                Provide a job description and resume text to get a match score.
              </p>
            )}
          </TabsContent>

          <TabsContent value="skill-gap" className="mt-4">
            {loading.isAnalyzingGap ? (
              <LoadingIndicator text="Analyzing skill gaps and building your roadmap..." />
            ) : skillGapAnalysis && skillGapAnalysis.skillAnalysis.length > 0 ? (
              <div className="space-y-4">
                <h3 className="font-headline text-lg font-semibold">
                  Your Personalized Learning Roadmap
                </h3>
                <p className="text-sm text-muted-foreground">The AI has identified key skills from the job description that are missing from your resume. Here is a plan to learn them.</p>
                <Accordion type="multiple" className="w-full">
                  {skillGapAnalysis.skillAnalysis.map((skill, index) => (
                    <AccordionItem value={`skill-${index}`} key={skill.skill}>
                      <AccordionTrigger className="font-semibold">
                        <div className="flex items-center gap-3">
                          <span>{skill.skill}</span>
                          <Badge variant="outline">{skill.learningLevel}</Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          <strong>Why it's important:</strong> {skill.importance}
                        </p>
                        <div className="space-y-3">
                          <h5 className="font-semibold">Your Learning Steps:</h5>
                          {skill.learningSteps.map((step, stepIndex) => (
                            <div
                              key={stepIndex}
                              className="pl-4 border-l-2 border-primary/50"
                            >
                              <p className="font-medium">{step.step}</p>
                              <p className="text-xs text-muted-foreground italic">
                                How to practice: {step.practiceIdeas}
                              </p>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                <div className="text-center pt-4">
                  <Button>
                    <Rocket className="mr-2 h-4 w-4" />
                    Launch My Learning Plan
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-center text-sm text-muted-foreground p-8">
                { !loading.isMatching && matchAnalysis && matchAnalysis.missingSkills.length === 0 
                  ? "No significant skill gaps found. Your resume aligns well with the job requirements!"
                  : "Enter a job description and resume to find skill gaps."
                }
              </p>
            )}
          </TabsContent>

          <TabsContent value="resume-report" className="mt-4">
            {loading.isParsing ? (
              <LoadingIndicator text="Scanning your resume file..." />
            ) : resumeAnalysis ? (
              <Accordion type="single" collapsible defaultValue="ats-blockers">
                <AccordionItem value="ats-blockers">
                  <AccordionTrigger className="text-md font-semibold font-headline">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="mr-2 text-destructive" />
                        ATS Compatibility Check
                         <Tooltip>
                            <TooltipTrigger asChild><HelpCircle className="w-4 h-4 text-muted-foreground cursor-pointer" /></TooltipTrigger>
                            <TooltipContent><p className="max-w-xs">Applicant Tracking Systems (ATS) are automated systems recruiters use to scan resumes. This check looks for common formatting issues that can cause your resume to be misread or rejected.</p></TooltipContent>
                        </Tooltip>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="whitespace-pre-wrap">
                    {resumeAnalysis.ats_blockers}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="skills">
                  <AccordionTrigger className="text-md font-semibold font-headline">
                    <Sparkles className="mr-2 text-primary" />
                    Extracted Skills
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-wrap gap-2">
                      {resumeAnalysis.skills.map(skill => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="experience">
                  <AccordionTrigger className="text-md font-semibold font-headline">
                    <User className="mr-2 text-primary" />
                    Experience Summary
                  </AccordionTrigger>
                  <AccordionContent className="whitespace-pre-wrap">
                    {resumeAnalysis.experience}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="education">
                  <AccordionTrigger className="text-md font-semibold font-headline">
                    <List className="mr-2 text-primary" />
                    Education Summary
                  </AccordionTrigger>
                  <AccordionContent className="whitespace-pre-wrap">{resumeAnalysis.education}</AccordionContent>
                </AccordionItem>
              </Accordion>
            ) : (
              <p className="text-center text-sm text-muted-foreground p-8">
                Upload a resume file to generate an ATS compatibility report.
              </p>
            )}
          </TabsContent>

          <TabsContent value="suggestions" className="mt-4">
            {loading.isSuggesting ? (
              <LoadingIndicator text="Generating AI optimization ideas..." />
            ) : suggestions ? (
              <div>
                <h4 className="font-headline text-md font-semibold mb-2">
                  AI-Powered Suggestions
                </h4>
                 <p className="text-sm text-muted-foreground mb-4">Here are some ideas for how to rewrite parts of your resume to better match the job description. Use these as inspiration!</p>
                <div className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted/50 p-4 rounded-md">
                  {suggestions.suggestions}
                </div>
              </div>
            ) : (
              <p className="text-center text-sm text-muted-foreground p-8">
                Provide a job description and resume text to get AI suggestions.
              </p>
            )}
          </TabsContent>
          <TabsContent value="simulation" className="mt-4">
             <SimulationPanel 
                originalResumeText={originalResumeText}
                handleSimulate={handleSimulate}
                loading={loading.isSimulating}
                originalMatchScore={results.matchAnalysis?.matchScore}
                simulationResult={simulationResult}
              />
          </TabsContent>
        </Tabs>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
