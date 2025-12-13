'use server';
/**
 * @fileOverview Provides a match score between a job description and a resume, highlighting skill and experience relevance.
 *
 * - provideJobResumeMatchScore - A function that returns the match score and highlights relevance.
 * - ProvideJobResumeMatchScoreInput - The input type for the provideJobResumeMatchScore function.
 * - ProvideJobResumeMatchScoreOutput - The return type for the provideJobResumeMatchScore function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideJobResumeMatchScoreInputSchema = z.object({
  jobDescription: z.string().describe('The job description.'),
  resume: z.string().describe('The resume content.'),
});
export type ProvideJobResumeMatchScoreInput = z.infer<typeof ProvideJobResumeMatchScoreInputSchema>;

const ProvideJobResumeMatchScoreOutputSchema = z.object({
  matchScore: z
    .number()
    .describe(
      'A numerical score (0-100) representing how well the resume matches the job description.'
    ),
  relevanceHighlights: z
    .string()
    .describe(
      'A summary of the skills and experiences in the resume that are relevant to the job description.'
    ),
  missingSkills: z
    .array(z.string())
    .describe(
      'A list of key skills mentioned in the job description that are missing from the resume.'
    ),
});
export type ProvideJobResumeMatchScoreOutput = z.infer<typeof ProvideJobResumeMatchScoreOutputSchema>;

const provideJobResumeMatchScoreFlow = ai.defineFlow(
  {
    name: 'provideJobResumeMatchScoreFlow',
    inputSchema: ProvideJobResumeMatchScoreInputSchema,
    outputSchema: ProvideJobResumeMatchScoreOutputSchema,
  },
  async input => {
    const prompt = ai.definePrompt({
      name: 'provideJobResumeMatchScorePrompt',
      input: {schema: ProvideJobResumeMatchScoreInputSchema},
      output: {schema: ProvideJobResumeMatchScoreOutputSchema},
      prompt: `You are an AI expert in recruiting and talent acquisition.

You will receive a job description and a resume.

Your tasks are to:
1. Provide a match score (0-100) indicating how well the resume fits the job description. A higher score indicates a better match.
2. Provide relevance highlights, summarizing the skills and experiences in the resume that align with the requirements of the job description.
3. Identify and list the key skills that are mentioned in the job description but are missing from the resume.

Job Description: {{{jobDescription}}}

Resume: {{{resume}}}

Provide the output in JSON format.
`,
    });

    const {output} = await prompt(input);
    return output!;
  }
);


export async function provideJobResumeMatchScore(
  input: ProvideJobResumeMatchScoreInput
): Promise<ProvideJobResumeMatchScoreOutput> {
  return provideJobResumeMatchScoreFlow(input);
}
