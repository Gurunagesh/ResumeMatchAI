'use server';

/**
 * @fileOverview Skill Gap Analyzer and Learning Roadmap AI agent.
 *
 * - generateSkillGapAnalysis - A function that identifies missing skills and creates a learning plan.
 * - GenerateSkillGapAnalysisInput - The input type for the function.
 * - GenerateSkillGapAnalysisOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SkillDetailSchema = z.object({
  skill: z.string().describe('The name of the missing skill.'),
  importance: z
    .string()
    .describe('Why this skill is important for the job role.'),
  learningLevel: z
    .enum(['Beginner', 'Intermediate', 'Advanced'])
    .describe('The recommended learning level to start with for this skill.'),
  learningSteps: z
    .array(
      z.object({
        step: z.string().describe('A concrete step to learn the skill.'),
        practiceIdeas: z
          .string()
          .describe('Example project or practice ideas for this step.'),
      })
    )
    .describe('A series of 2-3 steps to learn the skill.'),
});

const GenerateSkillGapAnalysisInputSchema = z.object({
  jobDescription: z.string().describe('The job description text.'),
  resumeText: z.string().describe('The resume text.'),
  missingSkills: z.array(z.string()).describe('A list of missing skills.'),
});
export type GenerateSkillGapAnalysisInput = z.infer<
  typeof GenerateSkillGapAnalysisInputSchema
>;

const GenerateSkillGapAnalysisOutputSchema = z.object({
  skillAnalysis: z
    .array(SkillDetailSchema)
    .describe(
      'An array of objects, each containing a detailed analysis and learning plan for a missing skill, prioritized by importance.'
    ),
});
export type GenerateSkillGapAnalysisOutput = z.infer<
  typeof GenerateSkillGapAnalysisOutputSchema
>;

const generateSkillGapAnalysisFlow = ai.defineFlow(
  {
    name: 'generateSkillGapAnalysisFlow',
    inputSchema: GenerateSkillGapAnalysisInputSchema,
    outputSchema: GenerateSkillGapAnalysisOutputSchema,
  },
  async input => {
    const prompt = ai.definePrompt({
      name: 'generateSkillGapAnalysisPrompt',
      input: {schema: GenerateSkillGapAnalysisInputSchema},
      output: {schema: GenerateSkillGapAnalysisOutputSchema},
      prompt: `You are an expert career coach and learning strategist. Your task is to analyze the skill gap between a resume and a job description and create a personalized learning roadmap.

You will be given a job description, resume text, and a list of skills that are missing from the resume but are present in the job description.

For each missing skill, you must:
1.  **Rank by Importance**: Prioritize the most critical skills for the job role first in the output array.
2.  **Explain Importance**: Briefly explain why this skill is important for this specific job.
3.  **Categorize Learning Level**: Determine if the user should start as a 'Beginner', 'Intermediate', or 'Advanced' learner for this skill, considering the context of the job.
4.  **Generate Learning Steps**: Provide 2-3 actionable learning steps. For each step, suggest a simple practice idea or mini-project. Do not suggest or link to any paid courses or external platforms. Keep it generic and action-oriented.

Job Description:
{{{jobDescription}}}

Resume:
{{{resumeText}}}

Missing Skills:
{{#each missingSkills}}- {{{this}}}{{/each}}

Generate the analysis and learning roadmap. The output must be simple, explainable, and non-technical.`,
    });

    const {output} = await prompt(input);
    return output!;
  }
);


export async function generateSkillGapAnalysis(
  input: GenerateSkillGapAnalysisInput
): Promise<GenerateSkillGapAnalysisOutput> {
  return generateSkillGapAnalysisFlow(input);
}
