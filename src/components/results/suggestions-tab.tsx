'use client';

import type { Suggestions } from '@/lib/types';
import { Lightbulb } from 'lucide-react';

type SuggestionsTabProps = {
  suggestions: Suggestions | null;
};

export function SuggestionsTab({ suggestions }: SuggestionsTabProps) {
  if (!suggestions) {
    return (
      <div className="text-center text-sm text-muted-foreground p-8 border-2 border-dashed rounded-lg min-h-[400px] flex flex-col justify-center items-center gap-4">
        <Lightbulb className="h-8 w-8 text-muted-foreground" />
        <p className="max-w-xs">
          Provide a job description and resume text to get AI suggestions.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h4 className="font-headline text-lg font-semibold mb-2">
        AI-Powered Suggestions
      </h4>
      <p className="text-sm text-muted-foreground mb-4">
        Here are some ideas for how to rewrite parts of your resume to better
        match the job description. Use these as inspiration!
      </p>
      <div className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted/50 p-4 rounded-md border">
        {suggestions.suggestions}
      </div>
    </div>
  );
}
