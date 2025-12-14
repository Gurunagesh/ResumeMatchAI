'use client';

import {
  AlertTriangle,
  BrainCircuit,
  Gauge,
  Lightbulb,
  Target,
  ShieldCheck,
  Clock,
} from 'lucide-react';

export const ResultsEmptyState = () => (
  <div className="flex flex-col items-center justify-center gap-6 rounded-lg border-2 border-dashed p-8 text-center min-h-[400px] h-full">
    <div className="p-4 bg-primary/10 rounded-full">
      <BrainCircuit className="h-10 w-10 text-primary" />
    </div>
    <div className="space-y-2">
      <h3 className="font-headline text-xl font-semibold text-gray-800">
        Your AI Analysis Awaits
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mx-auto">
        After you provide a job description and resume, your results will appear
        here. You'll get insights on:
      </p>
    </div>
    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-left text-sm text-muted-foreground">
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
    <div className="mt-6 space-y-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-2 justify-center">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Resume data is processed securely and never stored without your permission.</span>
        </div>
        <div className="flex items-center gap-2 justify-center">
            <Clock className="h-3.5 w-3.5" />
            <span>Analysis takes ~10-15 seconds to complete.</span>
        </div>
    </div>
  </div>
);
