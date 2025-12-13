'use client';

import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2, Gauge, HelpCircle } from 'lucide-react';
import type { MatchAnalysis } from '@/lib/types';
import { MatchScoreChart } from '../match-score-chart';

type MatchScoreTabProps = {
  matchAnalysis: MatchAnalysis | null;
};

export function MatchScoreTab({ matchAnalysis }: MatchScoreTabProps) {
  if (!matchAnalysis) {
    return (
      <div className="text-center text-sm text-muted-foreground p-8 border-2 border-dashed rounded-lg min-h-[400px] flex flex-col justify-center items-center gap-4">
        <Gauge className="h-8 w-8 text-muted-foreground" />
        <p className="max-w-xs">
          Provide a job description and resume text to get your match score.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center gap-4 rounded-lg bg-muted/50 p-6">
        <h3 className="font-headline text-lg font-semibold flex items-center gap-2">
          Job-Resume Match Score
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-4 h-4 text-muted-foreground cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  This score represents the alignment between your resume and
                  the job description, based on skills, experience, and
                  keywords.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
  );
}
