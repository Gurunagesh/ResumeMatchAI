'use server';

/**
 * @fileOverview Provides suggestions on how to rewrite resume bullet points and insert relevant keywords.
 *
 * - generateResumeSuggestions - A function that takes a resume and job description and returns resume improvement suggestions.
 * - GenerateResumeSuggestionsInput - The input type for the generateResumeSuggestions function.
 * - GenerateResumeSuggestionsOutput - The return type for the generateResumeSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateResumeSuggestionsInputSchema = z.object({
  resumeText: z
    .string()
    .describe('The text content of the resume to be optimized.'),
  jobDescription:
    z.string().describe('The job description to match the resume against.'),
});
export type GenerateResumeSuggestionsInput = z.infer<
  typeof GenerateResumeSuggestionsInputSchema
>;

const GenerateResumeSuggestionsOutputSchema = z.object({
  suggestions: z
    .string()
    .describe(
      'Suggestions for improving the resume, including rewriting bullet points and adding relevant keywords.'
    ),
});
export type GenerateResumeSuggestionsOutput = z.infer<
  typeof GenerateResumeSuggestionsOutputSchema
>;


const generateResumeSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateResumeSuggestionsFlow',
    inputSchema: GenerateResumeSuggestionsInputSchema,
    outputSchema: GenerateResumeSuggestionsOutputSchema,
  },
  async input => {
    const prompt = ai.definePrompt({
      name: 'generateResumeSuggestionsPrompt',
      input: {schema: GenerateResumeSuggestionsInputSchema},
      output: {schema: GenerateResumeSuggestionsOutputSchema},
      prompt: `You are an expert resume writer. Given the following resume and job description, provide suggestions to improve the resume by rewriting bullet points and inserting relevant keywords from the job description to increase its effectiveness.

Resume:
{{{resumeText}}}

Job Description:
{{{jobDescription}}}

Suggestions:
`,
    });
    const {output} = await prompt(input);
    return output!;
  }
);

export async function generateResumeSuggestions(
  input: GenerateResumeSuggestionsInput
): Promise<GenerateResumeSuggestionsOutput> {
  return generateResumeSuggestionsFlow(input);
}
