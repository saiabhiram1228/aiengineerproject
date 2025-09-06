'use server';
/**
 * @fileOverview Summarizes the sentiment of an email.
 *
 * - summarizeEmailSentiment - A function that summarizes the sentiment of an email.
 * - SummarizeEmailSentimentInput - The input type for the summarizeEmailSentiment function.
 * - SummarizeEmailSentimentOutput - The return type for the summarizeEmailSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeEmailSentimentInputSchema = z.object({
  emailBody: z.string().describe('The body of the email to analyze.'),
});
export type SummarizeEmailSentimentInput = z.infer<typeof SummarizeEmailSentimentInputSchema>;

const SummarizeEmailSentimentOutputSchema = z.object({
  sentiment: z
    .enum(['Positive', 'Negative', 'Neutral'])
    .describe('The sentiment of the email.'),
});
export type SummarizeEmailSentimentOutput = z.infer<typeof SummarizeEmailSentimentOutputSchema>;

export async function summarizeEmailSentiment(
  input: SummarizeEmailSentimentInput
): Promise<SummarizeEmailSentimentOutput> {
  return summarizeEmailSentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeEmailSentimentPrompt',
  input: {schema: SummarizeEmailSentimentInputSchema},
  output: {schema: SummarizeEmailSentimentOutputSchema},
  prompt: `Determine the sentiment of the following email body. The sentiment should be Positive, Negative, or Neutral.

Email Body:
{{emailBody}}`,
});

const summarizeEmailSentimentFlow = ai.defineFlow(
  {
    name: 'summarizeEmailSentimentFlow',
    inputSchema: SummarizeEmailSentimentInputSchema,
    outputSchema: SummarizeEmailSentimentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
