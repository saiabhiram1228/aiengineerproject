import { config } from 'dotenv';
config();

import '@/ai/flows/extract-email-information.ts';
import '@/ai/flows/summarize-email-sentiment.ts';
import '@/ai/flows/generate-email-response.ts';
import '@/ai/flows/assess-email-priority.ts';
import '@/ai/flows/fetch-emails.ts';
