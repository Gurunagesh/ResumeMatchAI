'use server';

/**
 * @fileOverview Job Description Analyzer AI agent.
 *
 * - analyzeJobDescription - A function that handles the job description analysis process.
 * - AnalyzeJobDescriptionInput - The input type for the analyzeJobDescription function.
 * - AnalyzeJobDescriptionOutput - The return type for the analyzeJobDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeJobDescriptionInputSchema = z.object({
  jobDescription: z
    .string()
    .describe('The job description text to be analyzed.'),
});
export type AnalyzeJobDescriptionInput = z.infer<
  typeof AnalyzeJobDescriptionInputSchema
>;

const AnalyzeJobDescriptionOutputSchema = z.object({
  skills: z
    .array(z.string())
    .describe('Key skills required for the job.'),
  experienceLevel: z
    .string()
    .describe('The required experience level for the job (e.g., Entry-level, Mid-level, Senior-level).'),
  roleType: z
    .string()
    .describe('The type of role (e.g., Software Engineer, Data Scientist, Project Manager).'),
});
export type AnalyzeJobDescriptionOutput = z.infer<
  typeof AnalyzeJobDescriptionOutputSchema
>;

const analyzeJobDescriptionFlow = ai.defineFlow(
  {
    name: 'analyzeJobDescriptionFlow',
    inputSchema: AnalyzeJobDescriptionInputSchema,
    outputSchema: AnalyzeJobDescriptionOutputSchema,
  },
  async input => {
    const prompt = ai.definePrompt({
      name: 'analyzeJobDescriptionPrompt',
      input: {schema: AnalyzeJobDescriptionInputSchema},
      output: {schema: AnalyzeJobDescriptionOutputSchema},
      prompt: `You are an expert job description analyzer. Analyze the job description provided and extract the key skills, experience level, and role type.

Job Description:
{{{jobDescription}}}

Output the key skills, experience level, and role type in JSON format.`,
    });

    const {output} = await prompt(input);
    return output!;
  }
);

export async function analyzeJobDescription(
  input: AnalyzeJobDescriptionInput
): Promise<AnalyzeJobDescriptionOutput> {
  return analyzeJobDescriptionFlow(input);
}
