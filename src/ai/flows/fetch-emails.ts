
'use server';

import { z } from 'zod';
import { google } from 'googleapis';
import { ai } from '@/ai/genkit';
import { Email } from '@/lib/types';

const FetchEmailsInputSchema = z.object({
  accessToken: z.string(),
});
export type FetchEmailsInput = z.infer<typeof FetchEmailsInputSchema>;

const FetchEmailsOutputSchema = z.array(
  z.object({
    id: z.string(),
    from: z.object({
      name: z.string(),
      email: z.string(),
      avatar: z.string(),
    }),
    subject: z.string(),
    body: z.string(),
    date: z.string(),
    read: z.boolean(),
    labels: z.array(z.enum(['Resolved', 'Pending'])),
  })
);
export type FetchEmailsOutput = z.infer<typeof FetchEmailsOutputSchema>;

export async function fetchEmails(input: FetchEmailsInput): Promise<FetchEmailsOutput> {
  return fetchEmailsFlow(input);
}

const fetchEmailsFlow = ai.defineFlow(
  {
    name: 'fetchEmailsFlow',
    inputSchema: FetchEmailsInputSchema,
    outputSchema: FetchEmailsOutputSchema,
  },
  async ({ accessToken }) => {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    const supportKeywords = ['support', 'query', 'request', 'help'];
    const query = supportKeywords.map(keyword => `subject:(${keyword})`).join(' OR ');

    try {
      const response = await gmail.users.messages.list({
        userId: 'me',
        q: query,
        maxResults: 20,
      });

      const messages = response.data.messages || [];
      if (messages.length === 0) {
        return [];
      }
      
      const emails: Email[] = await Promise.all(
        messages.map(async (message) => {
          if (!message.id) {
            throw new Error('Message ID is null');
          }
          const msg = await gmail.users.messages.get({ userId: 'me', id: message.id });
          const headers = msg.data.payload?.headers || [];
          const fromHeader = headers.find(h => h.name === 'From')?.value || '';
          const subject = headers.find(h => h.name === 'Subject')?.value || 'No Subject';
          const date = headers.find(h => h.name === 'Date')?.value || new Date().toISOString();
          
          let body = '';
          if (msg.data.payload?.parts) {
            const part = msg.data.payload.parts.find(p => p.mimeType === 'text/plain');
            if (part && part.body?.data) {
              body = Buffer.from(part.body.data, 'base64').toString('utf-8');
            }
          } else if (msg.data.payload?.body?.data) {
            body = Buffer.from(msg.data.payload.body.data, 'base64').toString('utf-8');
          }
          
          const fromName = fromHeader.includes('<') ? fromHeader.split('<')[0].trim().replace(/"/g, '') : fromHeader;
          const fromEmail = fromHeader.includes('<') ? fromHeader.split('<')[1].replace('>', '') : fromHeader;

          return {
            id: msg.data.id || message.id,
            from: {
              name: fromName,
              email: fromEmail,
              avatar: `https://picsum.photos/seed/${fromEmail}/40/40`,
            },
            subject,
            body: body || msg.data.snippet || '',
            date: new Date(date).toISOString(),
            read: !(msg.data.labelIds?.includes('UNREAD')),
            labels: ['Pending'], // Default label
          };
        })
      );
      return emails;
    } catch (error: any) {
      console.error('Failed to fetch emails:', error.message);
      if (error.response?.data?.error?.message) {
        console.error('Gmail API Error:', error.response.data.error.message);
      }
      throw new Error('Could not fetch emails from Gmail. Ensure your Google Cloud project has the Gmail API enabled and you have consented to the required scopes.');
    }
  }
);
