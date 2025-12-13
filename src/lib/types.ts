import type { AnalyzeJobDescriptionOutput } from '@/ai/flows/analyze-job-description';
import type { GenerateResumeSuggestionsOutput } from '@/ai/flows/generate-resume-suggestions';
import type { GenerateSkillGapAnalysisOutput } from '@/ai/flows/generate-skill-gap-analysis';
import type { ParseResumeContentOutput } from '@/ai/flows/parse-resume-content';
import type { ProvideJobResumeMatchScoreOutput } from '@/ai/flows/provide-job-resume-match-score';

export type ResumeAnalysis = ParseResumeContentOutput;
export type MatchAnalysis = ProvideJobResumeMatchScoreOutput;
export type Suggestions = GenerateResumeSuggestionsOutput;
export type SkillGapAnalysis = GenerateSkillGapAnalysisOutput;

export type AnalysisResults = {
  resumeAnalysis: ResumeAnalysis | null;
  matchAnalysis: MatchAnalysis | null;
  suggestions: Suggestions | null;
  skillGapAnalysis: SkillGapAnalysis | null;
};
