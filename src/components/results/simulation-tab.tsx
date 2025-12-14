'use client';

import { useState, useEffect } from 'react';
import type { MatchAnalysis } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, TestTube2 } from 'lucide-react';
import { LoadingIndicator } from './loading-indicator';

type SimulationTabProps = {
  originalResumeText: string;
  handleSimulate: (text: string) => void;
  loading: boolean;
  originalMatchScore?: number;
  simulationResult: MatchAnalysis | null;
  isSavedView?: boolean;
};

export function SimulationTab({
  originalResumeText,
  handleSimulate,
  loading,
  originalMatchScore,
  simulationResult,
  isSavedView,
}: SimulationTabProps) {
  const [modifiedResume, setModifiedResume] = useState(originalResumeText);

  useEffect(() => {
    setModifiedResume(originalResumeText);
  }, [originalResumeText]);

  if (isSavedView) {
     return (
      <div className="text-center text-sm text-muted-foreground p-8 border-2 border-dashed rounded-lg min-h-[400px] flex flex-col justify-center items-center gap-4">
        <TestTube2 className="h-8 w-8 text-muted-foreground" />
        <p className="max-w-xs">
          The "What-If" simulator is disabled for saved analyses. Go to the main page to run a new simulation.
        </p>
      </div>
    );
  }

  if (originalMatchScore === undefined) {
    return (
      <div className="text-center text-sm text-muted-foreground p-8 border-2 border-dashed rounded-lg min-h-[400px] flex flex-col justify-center items-center gap-4">
        <TestTube2 className="h-8 w-8 text-muted-foreground" />
        <p className="max-w-xs">
          Run an analysis with pasted resume text first to unlock the "What-If"
          simulator.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-headline text-lg font-semibold">
        "What-If" Resume Simulator
      </h3>
      <p className="text-sm text-muted-foreground">
        Curious if a change will improve your score? Edit your resume below and
        simulate the result before you make the change for real.
      </p>
      <Textarea
        value={modifiedResume}
        onChange={e => setModifiedResume(e.target.value)}
        className="min-h-[250px] text-sm"
        placeholder="Your modified resume text goes here..."
      />
      <Button onClick={() => handleSimulate(modifiedResume)} disabled={loading}>
        {loading ? (
          <Spinner className="mr-2" />
        ) : (
          <TestTube2 className="mr-2 h-4 w-4" />
        )}
        Simulate Score Change
      </Button>

      {loading && <LoadingIndicator text="Simulating new score..." />}

      {!loading && simulationResult && (
        <Card className="bg-green-50/50 border-green-200">
          <CardHeader>
            <CardTitle className="font-headline text-md">
              Simulation Results
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-around gap-4">
            <div className="text-center">
              <p className="font-headline text-sm text-muted-foreground">
                Original Score
              </p>
              <p className="text-4xl font-bold">{originalMatchScore}%</p>
            </div>
            <ArrowRight className="h-8 w-8 text-green-500" />
            <div className="text-center">
              <p className="font-headline text-sm text-primary">New Score</p>
              <p className="text-4xl font-bold text-primary">
                {simulationResult.matchScore}%
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
