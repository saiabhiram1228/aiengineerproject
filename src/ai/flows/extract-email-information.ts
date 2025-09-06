'use server';

/**
 * @fileOverview Extracts key information from incoming emails, such as contact details and customer requirements.
 *
 * @file
 * - extractEmailInformation - A function that extracts key information from an email.
 * - ExtractEmailInformationInput - The input type for the extractEmailInformation function.
 * - ExtractEmailInformationOutput - The return type for the extractEmailInformation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractEmailInformationInputSchema = z.object({
  emailBody: z.string().describe('The body of the email to extract information from.'),
});

export type ExtractEmailInformationInput = z.infer<
  typeof ExtractEmailInformationInputSchema
>;

const ExtractEmailInformationOutputSchema = z.object({
  contactDetails: z
    .string()
    .describe(
      'Contact details found in the email, such as phone number or alternate email.'
    ),
  customerRequirements: z
    .string()
    .describe('The requirements or requests the customer has made.'),
  sentimentIndicators: z
    .string()
    .describe('Positive or negative words indicating the sentiment of the email.'),
});

export type ExtractEmailInformationOutput = z.infer<
  typeof ExtractEmailInformationOutputSchema
>;

export async function extractEmailInformation(
  input: ExtractEmailInformationInput
): Promise<ExtractEmailInformationOutput> {
  return extractEmailInformationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractEmailInformationPrompt',
  input: {schema: ExtractEmailInformationInputSchema},
  output: {schema: ExtractEmailInformationOutputSchema},
  prompt: `You are an AI assistant that extracts key information from emails.

  Given the following email body, extract contact details, customer requirements, and sentiment indicators.

  Email Body: {{{emailBody}}}
  
  Output the contact details, customer requirements, and sentiment indicators in the specified JSON format.`,
});

const extractEmailInformationFlow = ai.defineFlow(
  {
    name: 'extractEmailInformationFlow',
    inputSchema: ExtractEmailInformationInputSchema,
    outputSchema: ExtractEmailInformationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
