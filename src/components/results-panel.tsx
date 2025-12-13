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
  CheckCircle2,
  BrainCircuit,
  ClipboardList,
  Save,
} from 'lucide-react';
import { MatchScoreChart } from './match-score-chart';
import { Spinner } from './ui/spinner';
import type { AnalysisResults, MatchAnalysis } from '@/lib/types';
import { useState, useEffect } from 'react';
import { Textarea } from './ui/textarea';
import { useUser } from '@/firebase';

type ResultsPanelProps = {
  loading: {
    isParsing: boolean;
    isMatching: boolean;
    isSuggesting: boolean;
    isAnalyzingGap: boolean;
    isSimulating: boolean;
    isSaving: boolean;
  };
  results: AnalysisResults;
  originalResumeText: string;
  handleSimulate: (modifiedResume: string) => void;
  simulationResult: MatchAnalysis | null;
  handleSaveAnalysis: () => void;
};

const LoadingIndicator = ({ text }: { text: string }) => (
  <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-8 text-center h-full min-h-[400px]">
    <Spinner className="h-8 w-8 text-primary" />
    <p className="text-muted-foreground font-medium">{text}</p>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center gap-6 rounded-lg border-2 border-dashed p-8 text-center min-h-[400px]">
    <div className='p-4 bg-primary/10 rounded-full'>
      <BrainCircuit className="h-10 w-10 text-primary" />
    </div>
    <div className='space-y-2'>
        <h3 className="font-headline text-xl font-semibold text-gray-800">
          Your AI Analysis Awaits
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          After you provide a job description and resume, your results will appear here. You'll get insights on:
        </p>
    </div>
    <div className='grid grid-cols-2 gap-x-8 gap-y-4 text-left text-sm text-muted-foreground'>
        <div className="flex items-center gap-3">
            <Gauge className="h-5 w-5 text-primary/80" />
            <span>Job-Resume Match Score</span>
        </div>
        <div className="flex items-center gap-3">
            <Target className="h-5 w-5 text-primary/80" />
            <span>Skill Gap Analysis</span>
        </div>
        <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-primary/80" />
            <span>ATS Compatibility Check</span>
        </div>
        <div className="flex items-center gap-3">
            <Lightbulb className="h-5 w-5 text-primary/80" />
            <span>AI Optimization Ideas</span>
        </div>
    </div>
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
       <div className="text-center text-sm text-muted-foreground p-8 border-2 border-dashed rounded-lg min-h-[400px] flex flex-col justify-center items-center gap-4">
          <TestTube2 className="h-8 w-8 text-muted-foreground" />
          <p className="max-w-xs">Run an analysis with pasted resume text first to unlock the "What-If" simulator.</p>
       </div>
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
        <Card className='bg-green-50/50 border-green-200'>
          <CardHeader>
            <CardTitle className="font-headline text-md">Simulation Results</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-around gap-4">
             <div className="text-center">
                <p className="font-headline text-sm text-muted-foreground">Original Score</p>
                <p className="text-4xl font-bold">{originalMatchScore}%</p>
             </div>
             <ArrowRight className="h-8 w-8 text-green-500" />
             <div className="text-center">
                <p className="font-headline text-sm text-primary">New Score</p>
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
  handleSaveAnalysis,
}: ResultsPanelProps) {
  const { resumeAnalysis, matchAnalysis, suggestions, skillGapAnalysis } =
    results;
  const { user } = useUser();

  const isInitialState =
    !resumeAnalysis && !matchAnalysis && !suggestions && !skillGapAnalysis;
  const isLoading =
    loading.isParsing ||
    loading.isMatching ||
    loading.isSuggesting ||
    loading.isAnalyzingGap;

  if (isInitialState && !isLoading) {
    return (
      <Card className="shadow-sm h-full bg-white">
        <CardContent className="p-4 h-full">
          <EmptyState />
        </CardContent>
      </Card>
    );
  }
  
  const getLoadingText = () => {
    if (loading.isMatching) return "Calculating your match score...";
    if (loading.isAnalyzingGap) return "Analyzing skill gaps...";
    if (loading.isSuggesting) return "Generating AI optimization ideas...";
    if (loading.isParsing) return "Scanning your resume file for ATS issues...";
    return "Loading analysis...";
  }

  if (isLoading) {
    return (
       <Card className="shadow-sm h-full">
        <CardContent className="p-4 h-full">
            <LoadingIndicator text={getLoadingText()} />
        </CardContent>
      </Card>
    )
  }


  return (
    <Card className="shadow-sm bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline text-xl tracking-tight">
          Analysis Results
        </CardTitle>
        {matchAnalysis && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSaveAnalysis}
                  disabled={loading.isSaving || !user}
                >
                  {loading.isSaving ? <Spinner className="mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
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
                    <TabsTrigger value="match-score">
                        <Gauge className="mr-1.5 h-4 w-4" />
                        Match Score
                    </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent><p>How well your resume matches the job.</p></TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <TabsTrigger value="skill-gap">
                        <Target className="mr-1.5 h-4 w-4" />
                        Skill Gap
                    </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent><p>Skills you're missing and how to learn them.</p></TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <TabsTrigger value="resume-report" disabled={!resumeAnalysis}>
                        <ClipboardList className="mr-1.5 h-4 w-4" />
                        Resume Report
                    </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent><p>An analysis of your resume file for ATS issues.</p></TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <TabsTrigger value="suggestions" disabled={!suggestions}>
                        <Lightbulb className="mr-1.5 h-4 w-4" />
                        Suggestions
                    </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent><p>AI-powered ideas to improve your resume text.</p></TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <TabsTrigger value="simulation">
                        <TestTube2 className="mr-1.5 h-4 w-4" />
                        Simulator
                    </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent><p>Test changes and see the effect on your score.</p></TooltipContent>
            </Tooltip>
          </TabsList>

          <TabsContent value="match-score" className="mt-6">
            {matchAnalysis ? (
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
                  <h4 className="font-headline text-md font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    Relevance Highlights
                  </h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {matchAnalysis.relevanceHighlights}
                  </p>
                </div>
                 {matchAnalysis.missingSkills && matchAnalysis.missingSkills.length > 0 && (
                   <div>
                    <h4 className="font-headline text-md font-semibold mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                      Missing Keywords
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {matchAnalysis.missingSkills.map(skill => (
                        <Badge key={skill} variant="destructive">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
               <div className="text-center text-sm text-muted-foreground p-8 border-2 border-dashed rounded-lg min-h-[400px] flex flex-col justify-center items-center gap-4">
                  <Gauge className="h-8 w-8 text-muted-foreground" />
                  <p className="max-w-xs">Provide a job description and resume text to get your match score.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="skill-gap" className="mt-6">
            {skillGapAnalysis && skillGapAnalysis.skillAnalysis.length > 0 ? (
              <div className="space-y-4">
                <h3 className="font-headline text-lg font-semibold">
                  Your Personalized Learning Roadmap
                </h3>
                <p className="text-sm text-muted-foreground">The AI has identified key skills from the job description that are missing from your resume. Here is a plan to learn them.</p>
                <Accordion type="multiple" className="w-full">
                  {skillGapAnalysis.skillAnalysis.map((skill, index) => (
                    <AccordionItem value={`skill-${index}`} key={skill.skill}>
                      <AccordionTrigger className="font-semibold text-base">
                        <div className="flex items-center gap-3">
                          <span>{skill.skill}</span>
                          <Badge variant="outline">{skill.learningLevel}</Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-2">
                        <p className="text-sm text-muted-foreground">
                          <strong>Why it's important:</strong> {skill.importance}
                        </p>
                        <div className="space-y-3">
                          <h5 className="font-semibold">Your Learning Steps:</h5>
                          {skill.learningSteps.map((step, stepIndex) => (
                            <div
                              key={stepIndex}
                              className="pl-4 border-l-2 border-primary"
                            >
                              <p className="font-medium text-primary-dark">{step.step}</p>
                              <p className="text-xs text-muted-foreground italic mt-1">
                                <strong>Practice Idea:</strong> {step.practiceIdeas}
                              </p>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ) : (
               <div className="text-center text-sm text-muted-foreground p-8 border-2 border-dashed rounded-lg min-h-[400px] flex flex-col justify-center items-center gap-4">
                { matchAnalysis && matchAnalysis.missingSkills.length === 0 
                  ? <><CheckCircle2 className="h-8 w-8 text-green-500" /><p className="max-w-xs">No significant skill gaps found. Your resume aligns well with the job requirements!</p></>
                  : <><Target className="h-8 w-8 text-muted-foreground" /><p className="max-w-xs">Enter a job description and resume to find skill gaps.</p></>
                }
              </div>
            )}
          </TabsContent>

          <TabsContent value="resume-report" className="mt-6">
            {resumeAnalysis ? (
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
                  <AccordionContent className="whitespace-pre-wrap pt-2">
                    {resumeAnalysis.ats_blockers}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="skills">
                  <AccordionTrigger className="text-md font-semibold font-headline">
                    <Sparkles className="mr-2 text-primary" />
                    Extracted Skills
                  </AccordionTrigger>
                  <AccordionContent className="pt-2">
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
                  <AccordionContent className="whitespace-pre-wrap pt-2">
                    {resumeAnalysis.experience}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="education">
                  <AccordionTrigger className="text-md font-semibold font-headline">
                    <List className="mr-2 text-primary" />
                    Education Summary
                  </AccordionTrigger>
                  <AccordionContent className="whitespace-pre-wrap pt-2">{resumeAnalysis.education}</AccordionContent>
                </AccordionItem>
              </Accordion>
            ) : (
              <div className="text-center text-sm text-muted-foreground p-8 border-2 border-dashed rounded-lg min-h-[400px] flex flex-col justify-center items-center gap-4">
                  <ClipboardList className="h-8 w-8 text-muted-foreground" />
                  <p className="max-w-xs">Upload a resume file to generate an ATS compatibility report.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="suggestions" className="mt-6">
            {suggestions ? (
              <div>
                <h4 className="font-headline text-lg font-semibold mb-2">
                  AI-Powered Suggestions
                </h4>
                 <p className="text-sm text-muted-foreground mb-4">Here are some ideas for how to rewrite parts of your resume to better match the job description. Use these as inspiration!</p>
                <div className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted/50 p-4 rounded-md border">
                  {suggestions.suggestions}
                </div>
              </div>
            ) : (
               <div className="text-center text-sm text-muted-foreground p-8 border-2 border-dashed rounded-lg min-h-[400px] flex flex-col justify-center items-center gap-4">
                  <Lightbulb className="h-8 w-8 text-muted-foreground" />
                  <p className="max-w-xs">Provide a job description and resume text to get AI suggestions.</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="simulation" className="mt-6">
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
