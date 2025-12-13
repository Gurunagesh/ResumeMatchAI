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
import { Briefcase, FileText, Sparkles } from 'lucide-react';
import { Spinner } from './ui/spinner';

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
    <div className="flex flex-col gap-8">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Briefcase className="h-6 w-6 text-primary" />
            <CardTitle className="font-headline">Job Description</CardTitle>
          </div>
          <CardDescription>
            Paste the full job description below for analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="e.g., 'We are looking for a Senior Software Engineer...'"
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
            <CardTitle className="font-headline">Your Resume</CardTitle>
          </div>
          <CardDescription>
            Paste your resume text for matching and optimization, or upload a
            file for an ATS check.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="e.g., 'John Doe - Software Engineer...'"
            className="min-h-[200px] text-sm"
            value={resumeText}
            onChange={e => setResumeText(e.target.value)}
          />
          <div className="space-y-2">
            <Label htmlFor="resume-file">Upload Resume File (PDF, DOCX)</Label>
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
  );
}
