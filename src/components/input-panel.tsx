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
import { Separator } from '@/components/ui/separator';
import { Briefcase, FileText, Sparkles, HelpCircle, ShieldCheck, Trash2, Save, ChevronsUpDown, Check, PlusCircle } from 'lucide-react';
import { Spinner } from './ui/spinner';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { File as BufferFile } from 'buffer';
import type { Resume } from '@/lib/types';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from './ui/command';
import { useState } from 'react';

type InputPanelProps = {
  jobDescription: string;
  setJobDescription: (value: string) => void;
  resumeText: string;
  setResumeText: (value: string) => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleAnalyze: () => void;
  isAnalyzing: boolean;
  fileName?: string;
  resumeFile: BufferFile | null;
  savedResumes: Resume[];
  isLoadingResumes: boolean;
  selectedResumeId: string | null;
  onSelectResume: (id: string) => void;
  onSaveResume: (title: string) => void;
  onDeleteResume: (id: string) => void;
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
  resumeFile,
  savedResumes,
  isLoadingResumes,
  selectedResumeId,
  onSelectResume,
  onSaveResume,
  onDeleteResume,
}: InputPanelProps) {

  const jdWordCount = jobDescription.trim().split(/\s+/).filter(Boolean).length;
  const isAnalyzeDisabled = !jobDescription || (!resumeText && !resumeFile);
  const [saveResumePopoverOpen, setSaveResumePopoverOpen] = useState(false);
  const [newResumeTitle, setNewResumeTitle] = useState('');

  const handleSaveClick = () => {
    if (!newResumeTitle.trim()) {
      // Potentially show a toast or inline error
      return;
    }
    onSaveResume(newResumeTitle);
    setNewResumeTitle('');
    setSaveResumePopoverOpen(false);
  };
  
  const getButtonText = () => {
    if (isAnalyzing) return "Analyzing...";
    if (isAnalyzeDisabled) return "Add job description & resume";
    return "Run AI Analysis";
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-6">
        <Card className="shadow-sm transition-all duration-300 focus-within:shadow-primary/20 focus-within:ring-2 focus-within:ring-primary/50">
          <CardHeader>
            <CardTitle className="font-headline text-lg tracking-tight flex items-center gap-2">
              Job Description
              <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-center p-1">
                      Paste the full job description for the most accurate analysis.
                    </p>
                  </TooltipContent>
                </Tooltip>
            </CardTitle>
            <CardDescription>
              For best results, paste the full, detailed job description.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="e.g., 'As a Software Engineer at Acme Inc., you will be responsible for developing high-quality applications... Experience with cloud services and CI/CD is a plus.'"
              className="min-h-[200px] text-sm"
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              maxLength={5000}
            />
            <p className="text-xs text-right text-muted-foreground mt-2">{jdWordCount} words / 5000 characters max</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm transition-all duration-300 focus-within:shadow-primary/20 focus-within:ring-2 focus-within:ring-primary/50">
          <CardHeader>
            <CardTitle className="font-headline text-lg tracking-tight">
             Your Resume
            </CardTitle>
            <CardDescription>
              Reuse or compare previously optimized resumes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {/* Resume Version Management */}
            <div className="space-y-2">
                <Label className="font-semibold text-gray-700 flex items-center gap-2">
                  Resume Versions
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-center p-1">
                        Save different versions of your resume to quickly reuse them for new analyses.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-[200px] justify-between"
                          disabled={isLoadingResumes}
                        >
                          {isLoadingResumes ? <Spinner className="h-4 w-4" /> : selectedResumeId
                            ? savedResumes.find((r) => r.id === selectedResumeId)?.title
                            : "Select resume..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Search resumes..." />
                          <CommandEmpty>No resumes found.</CommandEmpty>
                          <CommandGroup>
                            {savedResumes.map((resume) => (
                              <CommandItem
                                key={resume.id}
                                value={resume.title}
                                onSelect={() => onSelectResume(resume.id)}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedResumeId === resume.id ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {resume.title}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="ml-auto h-6 w-6"
                                  onClick={(e) => { e.stopPropagation(); onDeleteResume(resume.id); }}
                                >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    <Popover open={saveResumePopoverOpen} onOpenChange={setSaveResumePopoverOpen}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" disabled={!resumeText}>
                                <Save className="mr-2 h-4 w-4" /> Save Version
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <h4 className="font-medium leading-none">Save Resume</h4>
                                    <p className="text-sm text-muted-foreground">
                                    Give this resume version a name.
                                    </p>
                                </div>
                                <Input
                                    placeholder="e.g., 'For SWE roles'"
                                    value={newResumeTitle}
                                    onChange={(e) => setNewResumeTitle(e.target.value)}
                                />
                                <Button onClick={handleSaveClick}>Save</Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <Separator />
            
            <div>
              <Label htmlFor="resume-text" className="flex items-center gap-1.5 mb-2 font-semibold text-gray-700">
                Resume Text
                 <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-center p-1">
                      Paste your resume here to analyze it. You can save it as a version for later use.
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
                disabled={!!resumeFile}
              />
            </div>
            
            <div className="relative flex items-center justify-center">
              <Separator className="flex-1" />
              <span className="mx-4 text-xs font-semibold text-muted-foreground bg-card px-2">OR</span>
              <Separator className="flex-1" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resume-file" className="flex items-center gap-1.5 font-semibold text-gray-700">
                Upload Resume File
                 <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-center p-1">
                      Use this for the ATS Compatibility check. Accepts PDF, DOC, DOCX up to 2MB.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <div className="flex gap-2">
                <Input
                  id="resume-file"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="cursor-pointer file:text-primary file:font-semibold"
                  disabled={!!resumeText}
                />
              </div>
              {fileName && (
                <p className="text-sm text-green-600 font-medium">
                  Successfully attached: {fileName}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col items-center gap-3">
          <Button
            size="lg"
            onClick={handleAnalyze}
            disabled={isAnalyzeDisabled || isAnalyzing}
            className="w-full font-bold text-base py-6 shadow-lg transition-all duration-300 hover:shadow-primary/40 disabled:shadow-none disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <Spinner className="mr-2 h-5 w-5" />
            ) : (
              <Sparkles className="mr-2 h-5 w-5" />
            )}
            {getButtonText()}
          </Button>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Your data is private and never shared.</span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
