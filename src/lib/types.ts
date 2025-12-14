import type { AnalyzeJobDescriptionOutput } from '@/ai/flows/analyze-job-description';
import type { GenerateResumeSuggestionsOutput } from '@/ai/flows/generate-resume-suggestions';
import type { GenerateSkillGapAnalysisOutput } from '@/ai/flows/generate-skill-gap-analysis';
import type { ParseResumeContentOutput } from '@/ai/flows/parse-resume-content';
import type { ProvideJobResumeMatchScoreOutput } from '@/ai/flows/provide-job-resume-match-score';
import type { GenerateInsightsOutput } from '@/ai/flows/generate-insights';
import { z } from 'zod';

export type ResumeAnalysis = ParseResumeContentOutput;
export type MatchAnalysis = ProvideJobResumeMatchScoreOutput;
export type Suggestions = GenerateResumeSuggestionsOutput;
export type SkillGapAnalysis = GenerateSkillGapAnalysisOutput;
export type Insights = GenerateInsightsOutput;

export const OptimizationModeSchema = z.enum(['Conservative', 'Balanced', 'Aggressive']);
export type OptimizationMode = z.infer<typeof OptimizationModeSchema>;

export const GenerateJDAlignedResumeInputSchema = z.object({
  originalResumeText: z
    .string()
    .describe('The original text content of the user\'s resume.'),
  jobDescription: z.string().describe('The job description to align with.'),
  matchAnalysis: z
    .object({
      missingSkills: z.array(z.string()),
      relevanceHighlights: z.string(),
    })
    .describe(
      'The initial analysis showing missing skills and relevance highlights.'
    ),
  optimizationMode: OptimizationModeSchema.describe(
    'The mode for optimization: Conservative (minimal changes), Balanced (recommended), or Aggressive (maximum JD alignment).'
  ),
});
export type GenerateJDAlignedResumeInput = z.infer<
  typeof GenerateJDAlignedResumeInputSchema
>;

export const GenerateJDAlignedResumeOutputSchema = z.object({
  generatedResume: z
    .string()
    .describe('The full text of the newly generated, job-aligned resume.'),
  improvementSummary: z
    .string()
    .describe(
      'A brief summary explaining what was improved in the generated resume.'
    ),
});
export type GenerateJDAlignedResumeOutput = z.infer<
  typeof GenerateJDAlignedResumeOutputSchema
>;


export type AnalysisResults = {
  resumeAnalysis: ResumeAnalysis | null;
  matchAnalysis: MatchAnalysis | null;
  suggestions: Suggestions | null;
  skillGapAnalysis: SkillGapAnalysis | null;
};

export interface Resume {
    id: string;
    userId: string;
    title: string;
    content: string;
    uploadDate: string;
}

export type GeneratedResumeResult = GenerateJDAlignedResumeOutput & {
  matchScore: number;
};
