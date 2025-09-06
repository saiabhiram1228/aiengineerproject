'use server';

/**
 * @fileOverview An AI agent for generating email responses.
 *
 * - generateEmailResponse - A function that generates an email response.
 * - GenerateEmailResponseInput - The input type for the generateEmailResponse function.
 * - GenerateEmailResponseOutput - The return type for the generateEmailResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEmailResponseInputSchema = z.object({
  emailBody: z.string().describe('The body of the email to respond to.'),
  customerSentiment: z
    .enum(['Positive', 'Negative', 'Neutral'])
    .describe('The sentiment of the customer in the email.'),
  knowledgeBase: z.string().optional().describe('Knowledge base documents'),
});
export type GenerateEmailResponseInput = z.infer<
  typeof GenerateEmailResponseInputSchema
>;

const GenerateEmailResponseOutputSchema = z.object({
  response: z.string().describe('The generated email response.'),
});
export type GenerateEmailResponseOutput = z.infer<
  typeof GenerateEmailResponseOutputSchema
>;

export async function generateEmailResponse(
  input: GenerateEmailResponseInput
): Promise<GenerateEmailResponseOutput> {
  return generateEmailResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEmailResponsePrompt',
  input: {schema: GenerateEmailResponseInputSchema},
  output: {schema: GenerateEmailResponseOutputSchema},
  prompt: `You are a professional email responder for customer support.

  Generate a professional and friendly email response based on the provided email and context. Always maintain a professional and friendly tone.
  Acknowledge customer frustration empathetically if the customer's sentiment is negative.
  Incorporate relevant details from the email and knowledge base (if provided).

  Email Body: {{{emailBody}}}
  Customer Sentiment: {{{customerSentiment}}}
  Knowledge Base: {{{knowledgeBase}}}

  Response:`, // Keep as a single line
});

const generateEmailResponseFlow = ai.defineFlow(
  {
    name: 'generateEmailResponseFlow',
    inputSchema: GenerateEmailResponseInputSchema,
    outputSchema: GenerateEmailResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
