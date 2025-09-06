export type Sentiment = "Positive" | "Negative" | "Neutral";
export type Priority = "Urgent" | "Not Urgent";

export interface Email {
  id: string;
  from: {
    name: string;
    email: string;
    avatar: string;
  };
  subject: string;
  body: string;
  date: string;
  read: boolean;
  sentiment?: Sentiment;
  priority?: Priority;
  labels: ("Resolved" | "Pending")[];
}

export interface ExtractedInfo {
  contactDetails: string;
  customerRequirements: string;
  sentimentIndicators: string;
}

export interface Analysis {
  sentiment: Sentiment;
  priority: Priority;
  extractedInfo: ExtractedInfo;
  response: string;
}
