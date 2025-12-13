import { config } from 'dotenv';
config();

import '@/ai/flows/generate-resume-suggestions.ts';
import '@/ai/flows/parse-resume-content.ts';
import '@/ai/flows/analyze-job-description.ts';
import '@/ai/flows/provide-job-resume-match-score.ts';