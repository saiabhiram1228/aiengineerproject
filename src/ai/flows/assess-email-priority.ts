'use server';

/**
 * @fileOverview A flow to assess the priority of an email based on its content.
 *
 * - assessEmailPriority - A function that assesses the priority of an email.
 * - AssessEmailPriorityInput - The input type for the assessEmailPriority function.
 * - AssessEmailPriorityOutput - The return type for the assessEmailPriority function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssessEmailPriorityInputSchema = z.object({
  emailBody: z
    .string()
    .describe('The body of the email to assess for priority.'),
});
export type AssessEmailPriorityInput = z.infer<typeof AssessEmailPriorityInputSchema>;

const AssessEmailPriorityOutputSchema = z.object({
  priority: z
    .enum(['Urgent', 'Not Urgent'])
    .describe('The priority of the email.'),
});
export type AssessEmailPriorityOutput = z.infer<typeof AssessEmailPriorityOutputSchema>;

export async function assessEmailPriority(input: AssessEmailPriorityInput): Promise<AssessEmailPriorityOutput> {
  return assessEmailPriorityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assessEmailPriorityPrompt',
  input: {schema: AssessEmailPriorityInputSchema},
  output: {schema: AssessEmailPriorityOutputSchema},
  prompt: `You are an AI assistant designed to determine the priority of incoming emails.

  Analyze the email content provided and determine if it should be considered "Urgent" or "Not Urgent".

  Consider the following keywords and phrases when making your determination:
  - "immediately"
  - "critical"
  - "cannot access"
  - "urgent"
  - "help"

  If the email contains any of these keywords or expresses a sense of urgency or critical issue, classify it as "Urgent". Otherwise, classify it as "Not Urgent".

  Email Content: {{{emailBody}}}

  Priority:`,
});

const assessEmailPriorityFlow = ai.defineFlow(
  {
    name: 'assessEmailPriorityFlow',
    inputSchema: AssessEmailPriorityInputSchema,
    outputSchema: AssessEmailPriorityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
