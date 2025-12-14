import type { AnalyzeJobDescriptionOutput } from '@/ai/flows/analyze-job-description';
import type { GenerateResumeSuggestionsOutput } from '@/ai/flows/generate-resume-suggestions';
import type { GenerateSkillGapAnalysisOutput } from '@/ai/flows/generate-skill-gap-analysis';
import type { ParseResumeContentOutput } from '@/ai/flows/parse-resume-content';
import type { ProvideJobResumeMatchScoreOutput } from '@/ai/flows/provide-job-resume-match-score';
import type { GenerateInsightsOutput } from '@/ai/flows/generate-insights';
import type { GenerateJDAlignedResumeOutput, OptimizationMode } from '@/ai/flows/generate-jd-aligned-resume';

export type ResumeAnalysis = ParseResumeContentOutput;
export type MatchAnalysis = ProvideJobResumeMatchScoreOutput;
export type Suggestions = GenerateResumeSuggestionsOutput;
export type SkillGapAnalysis = GenerateSkillGapAnalysisOutput;
export type Insights = GenerateInsightsOutput;
export { OptimizationMode };


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
