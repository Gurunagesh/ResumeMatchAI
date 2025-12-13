'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Briefcase, FileText, Sparkles, HelpCircle } from 'lucide-react';
import { Spinner } from './ui/spinner';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

type InputPanelProps = {
  jobDescription: string;
  setJobDescription: (value: string) => void;
  resumeText: string;
  setResumeText: (value: string) => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleAnalyze: () => void;
  isAnalyzing: boolean;
  fileName?: string;
};

export function InputPanel({
  jobDescription,
  setJobDescription,
  resumeText,
  setResumeText,
  handleFileChange,
  handleAnalyze,
  isAnalyzing,
  fileName,
}: InputPanelProps) {
  return (
    <TooltipProvider>
      <div className="flex flex-col gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Briefcase className="h-6 w-6 text-primary" />
              <CardTitle className="font-headline">1. Job Description</CardTitle>
            </div>
            <CardDescription>
              Paste the job description here. The AI will analyze it for key
              skills and requirements.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="e.g., 'Seeking a proactive Software Engineer with experience in React...'"
              className="min-h-[200px] text-sm"
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
            />
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary" />
              <CardTitle className="font-headline">2. Your Resume</CardTitle>
            </div>
            <CardDescription>
              Provide your resume in one of two ways below. For the best
              results, use both.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="resume-text" className="flex items-center gap-1 mb-2">
                Paste Resume Text
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Pasting your resume text enables Match Score, Skill Gap Analysis, and Optimization Suggestions.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Textarea
                id="resume-text"
                placeholder="e.g., 'John Doe - Software Engineer...'"
                className="min-h-[200px] text-sm"
                value={resumeText}
                onChange={e => setResumeText(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resume-file" className="flex items-center gap-1">
                Upload Resume File (PDF, DOCX)
                 <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Uploading a file enables the ATS Blockers check to find formatting issues that might get your resume rejected.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <div className="flex gap-2">
                <Input
                  id="resume-file"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  className="cursor-pointer"
                />
              </div>
              {fileName && (
                <p className="text-sm text-muted-foreground">
                  File: {fileName}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Button
          size="lg"
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="w-full font-bold shadow-lg transition-all duration-300 hover:shadow-primary/50"
        >
          {isAnalyzing ? (
            <>
              <Spinner className="mr-2 h-5 w-5" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Run AI Analysis
            </>
          )}
        </Button>
      </div>
    </TooltipProvider>
  );
}
