'use server';

/**
 * @fileOverview AI Insight Engine to analyze application outcomes.
 *
 * - generateInsights - A function that analyzes resume performance based on application outcomes.
 * - GenerateInsightsInput - The input type for the generateInsights function.
 * - GenerateInsightsOutput - The return type for the generateInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInsightsInputSchema = z.object({
  resumeVersion: z.string().describe('The text of the resume version used.'),
  jobDescription: z.string().describe('The job description for the application.'),
  outcome: z
    .enum(['Interviewing', 'Rejected', 'Offer', 'Applied', 'Analyzed'])
    .describe('The outcome of the application.'),
});
export type GenerateInsightsInput = z.infer<typeof GenerateInsightsInputSchema>;

const GenerateInsightsOutputSchema = z.object({
  positiveFactors: z
    .array(z.string())
    .describe('Factors that likely contributed positively to the outcome.'),
  negativeFactors: z
    .array(z.string())
    .describe('Factors that likely contributed negatively to the outcome.'),
  recommendations: z
    .array(z.string())
    .describe(
      'Actionable recommendations for improving the resume for future applications.'
    ),
});
export type GenerateInsightsOutput = z.infer<typeof GenerateInsightsOutputSchema>;

const generateInsightsFlow = ai.defineFlow(
  {
    name: 'generateInsightsFlow',
    inputSchema: GenerateInsightsInputSchema,
    outputSchema: GenerateInsightsOutputSchema,
  },
  async input => {
    const prompt = ai.definePrompt({
      name: 'generateInsightsPrompt',
      input: {schema: GenerateInsightsInputSchema},
      output: {schema: GenerateInsightsOutputSchema},
      prompt: `You are an expert career advisor analyzing why a resume did or did not perform well for a job application.

Based on the resume, the job description, and the application outcome, identify patterns related to keyword alignment, skill relevance, and formatting.

Resume Version:
{{{resumeVersion}}}

Job Description:
{{{jobDescription}}}

Application Outcome: {{{outcome}}}

In simple, non-technical language:
1.  Identify the key positive factors (what worked well).
2.  Identify the key negative factors (what didn't work).
3.  Provide actionable recommendations for improvement.

The analysis should be clear, user-friendly, and provide concrete advice. If the outcome is not 'Rejected' or 'Offer', you can state that full insights are best generated for terminal outcomes but provide some general observations.`,
    });

    const {output} = await prompt(input);
    return output!;
  }
);

export async function generateInsights(
  input: GenerateInsightsInput
): Promise<GenerateInsightsOutput> {
  return generateInsightsFlow(input);
}
