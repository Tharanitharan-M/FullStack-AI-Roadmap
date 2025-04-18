'use server';

/**
 * @fileOverview A subtopic explanation generator.
 *
 * - generateExplanation - A function that generates a short explanation for a given subtopic.
 * - GenerateExplanationInput - The input type for the generateExplanation function.
 * - GenerateExplanationOutput - The return type for the generateExplanation function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateExplanationInputSchema = z.object({
  subtopic: z.string().describe('The subtopic to generate an explanation for.'),
});
export type GenerateExplanationInput = z.infer<typeof GenerateExplanationInputSchema>;

const GenerateExplanationOutputSchema = z.object({
  explanation: z.string().describe('A short explanation of why the subtopic is important.'),
  progress: z.string().describe('A short, one-sentence summary of the explanation generation.'),
});
export type GenerateExplanationOutput = z.infer<typeof GenerateExplanationOutputSchema>;

export async function generateExplanation(input: GenerateExplanationInput): Promise<GenerateExplanationOutput> {
  return generateExplanationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateExplanationPrompt',
  input: {
    schema: z.object({
      subtopic: z.string().describe('The subtopic to generate an explanation for.'),
    }),
  },
  output: {
    schema: z.object({
      explanation: z.string().describe('A short explanation of why the subtopic is important.'),
    }),
  },
  prompt: `You are an expert full stack developer with extensive experience.

  Explain the importance of the following subtopic in the context of full stack development. Answer the question "Why am I learning this?"

  Subtopic: {{{subtopic}}}
  `,
});

const generateExplanationFlow = ai.defineFlow<
  typeof GenerateExplanationInputSchema,
  typeof GenerateExplanationOutputSchema
>(
  {
    name: 'generateExplanationFlow',
    inputSchema: GenerateExplanationInputSchema,
    outputSchema: GenerateExplanationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {
      explanation: output!.explanation,
      progress: `Generated a short explanation for the subtopic: ${input.subtopic}.`,
    };
  }
);
