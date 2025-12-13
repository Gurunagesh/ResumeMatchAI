'use server';

/**
 * @fileOverview Resume parsing flow to extract skills, experience, and education.
 *
 * - parseResumeContent - Function to initiate the resume parsing process.
 * - ParseResumeContentInput - Input type for the parseResumeContent function.
 * - ParseResumeContentOutput - Return type for the parseResumeContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ParseResumeContentInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      'The resume file as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // Corrected MIME type
    ),
});
export type ParseResumeContentInput = z.infer<typeof ParseResumeContentInputSchema>;

const ParseResumeContentOutputSchema = z.object({
  skills: z.array(z.string()).describe('Skills extracted from the resume.'),
  experience: z.string().describe('Summary of the work experience.'),
  education: z.string().describe('Summary of the education history.'),
  ats_blockers: z.string().describe('Potential ATS blockers identified in the resume'),
});
export type ParseResumeContentOutput = z.infer<typeof ParseResumeContentOutputSchema>;

export async function parseResumeContent(input: ParseResumeContentInput): Promise<ParseResumeContentOutput> {
  return parseResumeContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parseResumeContentPrompt',
  input: {schema: ParseResumeContentInputSchema},
  output: {schema: ParseResumeContentOutputSchema},
  prompt: `You are an expert resume parser.

  Extract the following information from the resume content:
  - Skills: A list of skills mentioned in the resume.
  - Experience: A summary of the work experience.
  - Education: A summary of the education history.
  - ATS Blockers: Potential ATS blockers in the resume, such as formatting issues, unusual characters, or lack of keywords.

  Resume Content: {{media url=resumeDataUri}}
  Make sure to return the output as a valid JSON.
  `,
});

const parseResumeContentFlow = ai.defineFlow(
  {
    name: 'parseResumeContentFlow',
    inputSchema: ParseResumeContentInputSchema,
    outputSchema: ParseResumeContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
