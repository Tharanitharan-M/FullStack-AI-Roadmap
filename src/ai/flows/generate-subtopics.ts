'use server';

/**
 * @fileOverview Generates subtopics for a given learning pillar using an AI model.
 *
 * - generateSubtopics - A function that generates subtopics for a learning pillar.
 * - GenerateSubtopicsInput - The input type for the generateSubtopics function.
 * - GenerateSubtopicsOutput - The return type for the generateSubtopics function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateSubtopicsInputSchema = z.object({
  learningPillar: z.string().describe('The learning pillar to generate subtopics for (e.g., Frontend, Backend, AI).'),
});
export type GenerateSubtopicsInput = z.infer<typeof GenerateSubtopicsInputSchema>;

const GenerateSubtopicsOutputSchema = z.object({
  subtopics: z.array(
    z.string().describe('A subtopic for the given learning pillar.')
  ).describe('The generated subtopics for the learning pillar.'),
});
export type GenerateSubtopicsOutput = z.infer<typeof GenerateSubtopicsOutputSchema>;

export async function generateSubtopics(input: GenerateSubtopicsInput): Promise<GenerateSubtopicsOutput> {
  return generateSubtopicsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSubtopicsPrompt',
  input: {
    schema: z.object({
      learningPillar: z.string().describe('The learning pillar to generate subtopics for (e.g., Frontend, Backend, AI).'),
    }),
  },
  output: {
    schema: z.object({
      subtopics: z.array(
        z.string().describe('A subtopic for the given learning pillar.')
      ).describe('The generated subtopics for the learning pillar.'),
    }),
  },
  prompt: `You are an expert in full-stack development and AI.

Please generate a list of subtopics for the following learning pillar. Consider current industry trends and best practices when generating the subtopics.

Learning Pillar: {{{learningPillar}}}

Subtopics:`,
});

const generateSubtopicsFlow = ai.defineFlow<
  typeof GenerateSubtopicsInputSchema,
  typeof GenerateSubtopicsOutputSchema
>(
  {
    name: 'generateSubtopicsFlow',
    inputSchema: GenerateSubtopicsInputSchema,
    outputSchema: GenerateSubtopicsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
