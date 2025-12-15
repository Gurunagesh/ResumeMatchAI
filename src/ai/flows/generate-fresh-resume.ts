'use server';
/**
 * @fileOverview A flow to generate a new, job-description-aligned resume from scratch based on user inputs.
 *
 * - generateFreshResume - A function that orchestrates the resume generation.
 * - GenerateFreshResumeInput - Input type for the function.
 * - GenerateJDAlignedResumeOutput - Return type (reused from aligned generator).
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { GenerateFreshResumeInputSchema, GenerateJDAlignedResumeOutputSchema, type GenerateFreshResumeInput, type GenerateJDAlignedResumeOutput } from '@/lib/types';


const generationPrompt = ai.definePrompt({
  name: 'generateFreshResumePrompt',
  input: { schema: GenerateFreshResumeInputSchema },
  output: { schema: GenerateJDAlignedResumeOutputSchema },
  prompt: `You are an expert resume writer tasked with creating a professional, ATS-friendly resume from scratch for a user. Your goal is to build a strong resume based *only* on the structured information provided by the user, while aligning it to a specific job description.

**CRITICAL RULES - DO NOT VIOLATE:**
1.  **NO FABRICATION:** You MUST NOT invent, create, or fabricate any skills, experiences, projects, or qualifications that are not explicitly provided in the user's input fields. Your task is to structure and phrase the given information professionally.
2.  **EVIDENCE-BASED:** Every part of the generated resume must be directly traceable to the user's input.
3.  **ATS-FRIENDLY:** The output must be plain text with standard section headings (e.g., "Summary", "Skills", "Experience", "Education", "Projects"). Do not use complex formatting.

**CONTEXT FOR YOUR TASK:**
*   **Target Job Description:**
    \`\`\`
    {{{jobDescription}}}
    \`\`\`
*   **User's Career Information:**
    *   **Full Name:** {{{userInput.fullName}}}
    *   **Target Role:** {{{userInput.targetRole}}}
    *   **Skills:** {{{userInput.skills}}}
    *   **Education:** {{{userInput.education}}}
    *   **Experience/Internships:** {{{userInput.experience}}}
    *   **Projects:** {{{userInput.projects}}}
    *   **Certifications:** {{{userInput.certifications}}}

**YOUR INSTRUCTIONS:**
1.  **Analyze the Context:** Deeply understand the user's information and the requirements of the target job description.
2.  **Write the Resume:** Construct a complete, professional resume using only the provided information.
    *   **Summary:** Start with a strong, 2-3 sentence summary that positions the user for their target role, using keywords from the job description.
    *   **Structure:** Organize the sections logically (e.g., Summary, Skills, Experience, Projects, Education). If the user has no experience, you may omit that section.
    *   **Phrasing:** Rephrase the user's raw input into professional-sounding bullet points. For example, if a user's project is "Made a website", you could phrase it as "Developed and deployed a personal portfolio website using Next.js and Tailwind CSS to showcase project work."
    *   **Alignment:** Where possible, use language and keywords from the job description to describe the user's skills and experiences.
3.  **Generate Improvement Summary:** Write a brief, clear summary explaining how you constructed the resume. For example: "I created a professional summary focused on your target role of 'Software Engineer'. I structured your skills for easy scanning and rephrased your project descriptions to highlight relevant technologies mentioned in the job description."
4.  **Output:** Return the full generated resume text and the improvement summary in the correct JSON format.`,
});

const generateFreshResumeFlow = ai.defineFlow(
  {
    name: 'generateFreshResumeFlow',
    inputSchema: GenerateFreshResumeInputSchema,
    outputSchema: GenerateJDAlignedResumeOutputSchema,
  },
  async (input) => {
    const { output } = await generationPrompt(input);
    return output!;
  }
);


export async function generateFreshResume(input: GenerateFreshResumeInput): Promise<GenerateJDAlignedResumeOutput> {
    return generateFreshResumeFlow(input);
}
