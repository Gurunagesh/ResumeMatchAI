'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import {
  AlertTriangle,
  ClipboardList,
  HelpCircle,
  List,
  Sparkles,
  User,
} from 'lucide-react';
import type { ResumeAnalysis } from '@/lib/types';

type ResumeReportTabProps = {
  resumeAnalysis: ResumeAnalysis | null;
};

export function ResumeReportTab({ resumeAnalysis }: ResumeReportTabProps) {
  if (!resumeAnalysis) {
    return (
      <div className="text-center text-sm text-muted-foreground p-8 border-2 border-dashed rounded-lg min-h-[400px] flex flex-col justify-center items-center gap-4">
        <ClipboardList className="h-8 w-8 text-muted-foreground" />
        <p className="max-w-xs">
          Upload a resume file to generate an ATS compatibility report.
        </p>
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible defaultValue="ats-blockers">
      <AccordionItem value="ats-blockers">
        <AccordionTrigger className="text-md font-semibold font-headline">
          <div className="flex items-center gap-2">
            <AlertTriangle className="mr-2 text-destructive" />
            ATS Compatibility Check
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="w-4 h-4 text-muted-foreground cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Applicant Tracking Systems (ATS) are automated systems
                    recruiters use to scan resumes. This check looks for common
                    formatting issues that can cause your resume to be misread
                    or rejected.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
        <AccordionContent className="whitespace-pre-wrap pt-2">
          {resumeAnalysis.education}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

    