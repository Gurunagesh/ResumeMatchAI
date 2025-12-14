'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import type { SkillGapAnalysis, MatchAnalysis } from '@/lib/types';
import { CheckCircle2, Target } from 'lucide-react';

type SkillGapTabProps = {
  skillGapAnalysis: SkillGapAnalysis | null;
  matchAnalysis: MatchAnalysis | null;
};

export function SkillGapTab({
  skillGapAnalysis,
  matchAnalysis,
}: SkillGapTabProps) {
  if (
    !skillGapAnalysis ||
    !skillGapAnalysis.skillAnalysis ||
    skillGapAnalysis.skillAnalysis.length === 0
  ) {
    return (
      <div className="text-center text-sm text-muted-foreground p-8 border-2 border-dashed rounded-lg min-h-[400px] flex flex-col justify-center items-center gap-4">
        {matchAnalysis && matchAnalysis.missingSkills.length === 0 ? (
          <>
            <CheckCircle2 className="h-8 w-8 text-green-500" />
            <p className="max-w-xs">
              No significant skill gaps found. Your resume aligns well with the
              job requirements!
            </p>
          </>
        ) : (
          <>
            <Target className="h-8 w-8 text-muted-foreground" />
            <p className="max-w-xs">
              Enter a job description and resume to find skill gaps.
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-headline text-lg font-semibold">
        Your Personalized Learning Roadmap
      </h3>
      <p className="text-sm text-muted-foreground">
        The AI has identified key skills from the job description that are
        missing from your resume. Here is a plan to learn them.
      </p>
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
  );
}

    