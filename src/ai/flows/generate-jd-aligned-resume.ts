'use server';

/**
 * @fileOverview A flow to generate a new, job-description-aligned resume from an existing one.
 *
 * - generateJDAlignedResume - A function that orchestrates the resume generation.
 * - GenerateJDAlignedResumeInput - Input type for the function.
 * - GenerateJDAlignedResumeOutput - Return type for the function.
 */

import { ai } from '@/ai/genkit';
import { provideJobResumeMatchScore } from './provide-job-resume-match-score';
import {
  GenerateJDAlignedResumeInputSchema,
  GenerateJDAlignedResumeOutputSchema,
  type GenerateJDAlignedResumeInput,
  type GenerateJDAlignedResumeOutput,
} from '@/lib/types';


const generationPrompt = ai.definePrompt({
  name: 'generateJDAlignedResumePrompt',
  input: { schema: GenerateJDAlignedResumeInputSchema },
  output: { schema: GenerateJDAlignedResumeOutputSchema },
  prompt: `You are an expert resume writer tasked with optimizing a user's resume for a specific job description. Your goal is to rewrite the resume to improve its match score, keyword alignment, and ATS compatibility while adhering to strict ethical guidelines.

**CRITICAL RULES - DO NOT VIOLATE:**
1.  **NO FABRICATION:** You MUST NOT invent, create, or fabricate any skills, experiences, projects, or qualifications that are not already present in the user's original resume. Your task is to rephrase, reorder, and emphasize existing content only.
2.  **EVIDENCE-BASED:** Every part of the generated resume must be directly traceable to the original resume text.
3.  **ATS-FRIENDLY:** The output must be plain text with standard section headings (e.g., "Experience", "Skills", "Education"). Do not use complex formatting.

**CONTEXT FOR YOUR TASK:**
*   **Original Resume:**
    \`\`\`
    {{{originalResumeText}}}
    \`\`\`
*   **Target Job Description:**
    \`\`\`
    {{{jobDescription}}}
    \`\`\`
*   **Initial Analysis:**
    *   **Missing Keywords:** {{#each matchAnalysis.missingSkills}}- {{{this}}}{{/each}}
    *   **Relevant Highlights:** {{{matchAnalysis.relevanceHighlights}}}
*   **Optimization Mode:** {{{optimizationMode}}}
    *   **Conservative:** Make minimal changes. Focus on rephrasing a few key bullet points and sprinkling in a few missing keywords where they naturally fit.
    *   **Balanced:** This is the recommended mode. Reorder sections or bullet points to highlight the most relevant experience first. Rewrite several sections to better align with the job description's language and incorporate a good number of missing keywords.
    *   **Aggressive:** Perform a full rewrite. Extensively rephrase content to mirror the language of the job description. Aim for maximum keyword and skill alignment, potentially de-emphasizing or shortening less relevant sections.

**YOUR INSTRUCTIONS:**
1.  **Analyze the context:** Deeply understand the user's experience from their original resume and the requirements from the job description.
2.  **Rewrite the Resume:** Based on the chosen optimization mode, rewrite the resume. Integrate the "Missing Keywords" where they authentically fit with the user's existing experience. Emphasize the skills and experiences that align with the "Relevant Highlights."
3.  **Generate Improvement Summary:** Write a brief, clear summary explaining the key changes you made. For example: "I rephrased your 'Project Management' experience to use terms like 'agile methodologies' and 'sprint planning' from the job description. I also front-loaded your 'Cloud Technologies' skills section for better visibility."
4.  **Output:** Return the full generated resume text and the improvement summary in the correct JSON format.`,
});

const generateJDAlignedResumeFlow = ai.defineFlow(
  {
    name: 'generateJDAlignedResumeFlow',
    inputSchema: GenerateJDAlignedResumeInputSchema,
    outputSchema: GenerateJDAlignedResumeOutputSchema,
  },
  async (input) => {
    const { output } = await generationPrompt(input);
    return output!;
  }
);


export async function generateJDAlignedResume(input: GenerateJDAlignedResumeInput): Promise<{
    generationResult: GenerateJDAlignedResumeOutput;
    newMatchAnalysis: { matchScore: number };
}> {
  const generationResult = await generateJDAlignedResumeFlow(input);

  // After generating, calculate the new match score to show the improvement.
  const newMatchAnalysis = await provideJobResumeMatchScore({
    jobDescription: input.jobDescription,
    resume: generationResult.generatedResume,
  });

  return {
    generationResult,
    newMatchAnalysis: { matchScore: newMatchAnalysis.matchScore },
  };
}
