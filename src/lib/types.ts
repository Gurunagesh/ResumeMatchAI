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

export const FreshResumeInputSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  targetRole: z.string().min(1, 'Target job role is required'),
  skills: z.string().min(3, 'Please list at least 3 skills'),
  education: z.string().min(1, 'Education is required'),
  experience: z.string().optional(),
  projects: z.string().optional(),
  certifications: z.string().optional(),
  achievements: z.string().optional(),
});
export type FreshResumeInput = z.infer<typeof FreshResumeInputSchema>;

export const GenerateFreshResumeInputSchema = z.object({
  jobDescription: z.string().describe('The target job description.'),
  userInput: FreshResumeInputSchema.describe('The user\'s raw career information.'),
});
export type GenerateFreshResumeInput = z.infer<typeof GenerateFreshResumeInputSchema>;


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
