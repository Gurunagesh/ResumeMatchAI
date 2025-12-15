'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-resume-suggestions.ts';
import '@/ai/flows/parse-resume-content.ts';
import '@/ai/flows/analyze-job-description.ts';
import '@/ai/flows/provide-job-resume-match-score.ts';
import '@/ai/flows/generate-skill-gap-analysis.ts';
import '@/ai/flows/generate-insights.ts';
import '@/ai/flows/generate-jd-aligned-resume.ts';
import '@/ai/flows/generate-fresh-resume.ts';
