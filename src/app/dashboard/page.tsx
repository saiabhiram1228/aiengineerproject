
"use client";

import * as React from "react";
import {
  AlertCircle,
  Frown,
  Loader2,
  Mail,
  Meh,
  Send,
  Smile,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";

import { assessEmailPriority } from "@/ai/flows/assess-email-priority";
import { extractEmailInformation } from "@/ai/flows/extract-email-information";
import { generateEmailResponse } from "@/ai/flows/generate-email-response";
import { summarizeEmailSentiment } from "@/ai/flows/summarize-email-sentiment";
import { fetchEmails } from "@/ai/flows/fetch-emails";
import { AIPanel } from "@/components/ai-panel";
import { EmailList } from "@/components/email-list";
import { EmailView } from "@/components/email-view";
import { Icons } from "@/components/icons";
import { SentimentPriorityChart } from "@/components/sentiment-priority-chart";
import { StatsCards } from "@/components/stats-cards";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";
import type {
  Analysis,
  Email,
  ExtractedInfo,
  Priority,
  Sentiment,
} from "@/lib/types";

const sentimentIcons: Record<Sentiment, React.ReactNode> = {
  Positive: <Smile className="text-green-500" />,
  Negative: <Frown className="text-red-500" />,
  Neutral: <Meh className="text-yellow-500" />,
};

const priorityIcons: Record<Priority, React.ReactNode> = {
  Urgent: <AlertCircle className="text-orange-500" />,
  "Not Urgent": null,
};

export default function DashboardPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [user, setUser] = React.useState<User | null>(null);
  const [allEmails, setAllEmails] = React.useState<Email[]>([]);
  const [selectedEmailId, setSelectedEmailId] = React.useState<string | null>(null);
  const [analysis, setAnalysis] = React.useState<Analysis | null>(null);
  const [isAnalysisLoading, setIsAnalysisLoading] = React.useState(false);
  const [knowledgeBase, setKnowledgeBase] = React.useState("");
  const [generatedResponse, setGeneratedResponse] = React.useState("");
  const [isLoadingEmails, setIsLoadingEmails] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          // Retrieve the access token from sessionStorage.
          const accessToken = sessionStorage.getItem('googleAccessToken');
          if (!accessToken) {
             throw new Error("Access token not found. Please sign in again.");
          }

          const emails = await fetchEmails({ accessToken });
          setAllEmails(emails);
          if (emails.length > 0) {
            setSelectedEmailId(emails[0].id);
          }
        } catch (error: any) {
          console.error("Error fetching emails:", error);
          const description = error.message || "Could not retrieve emails from your account.";
          toast({
            title: "Failed to fetch emails",
            description: `Error: ${description}. Please ensure you have enabled the Gmail API and configured the OAuth consent screen in your Google Cloud project.`,
            variant: "destructive",
          });
        } finally {
          setIsLoadingEmails(false);
        }
      } else {
        router.push("/login");
      }
    });
    
    return () => unsubscribe();
  }, [router, toast]);
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      sessionStorage.removeItem('googleAccessToken');
      router.push('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
      toast({
        title: 'Logout Failed',
        description: 'Could not log you out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const analyzeEmail = React.useCallback(async (email: Email) => {
    if (!email) return;
    setIsAnalysisLoading(true);
    setAnalysis(null);
    setGeneratedResponse("");

    try {
      const [sentimentResult, priorityResult, extractedInfo, responseResult] =
        await Promise.all([
          summarizeEmailSentiment({ emailBody: email.body }),
          assessEmailPriority({ emailBody: email.body }),
          extractEmailInformation({ emailBody: email.body }),
          generateEmailResponse({
            emailBody: email.body,
            customerSentiment: "Neutral",
            knowledgeBase,
          }),
        ]);

      const newEmailData: Email = {
        ...email,
        sentiment: sentimentResult.sentiment,
        priority: priorityResult.priority,
      };

      const updateAndSortEmails = (emails: Email[]) => {
        const newEmails = emails.map((e) =>
          e.id === newEmailData.id ? newEmailData : e
        );
        return [...newEmails].sort((a, b) => {
          if (a.priority === "Urgent" && b.priority !== "Urgent") return -1;
          if (a.priority !== "Urgent" && b.priority === "Urgent") return 1;
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
      };
      
      setAllEmails(updateAndSortEmails);

      const newAnalysis: Analysis = {
        sentiment: sentimentResult.sentiment,
        priority: priorityResult.priority,
        extractedInfo,
        response: responseResult.response,
      };

      setAnalysis(newAnalysis);
      setGeneratedResponse(responseResult.response);
    } catch (error) {
      console.error("Failed to analyze selected email:", error);
      toast({
        title: "Analysis Failed",
        description: "Could not analyze the selected email.",
        variant: "destructive",
      });
    } finally {
      setIsAnalysisLoading(false);
    }
  }, [toast, knowledgeBase]);

  const selectedEmail = React.useMemo(
    () => allEmails.find((e) => e.id === selectedEmailId),
    [allEmails, selectedEmailId]
  );
  
  const handleSelectEmail = (id: string) => {
    const email = allEmails.find(e => e.id === id);
    if (email) {
      setSelectedEmailId(id);
      if (!email.sentiment) { // Only analyze if not already analyzed
        analyzeEmail(email);
      }
    }
  };

  const handleRegenerateResponse = async () => {
    if (!selectedEmail || !analysis) return;
    setIsAnalysisLoading(true);
    try {
      const responseResult = await generateEmailResponse({
        emailBody: selectedEmail.body,
        customerSentiment: analysis.sentiment,
        knowledgeBase,
      });
      setGeneratedResponse(responseResult.response);
      if (analysis) {
        setAnalysis({ ...analysis, response: responseResult.response });
      }
    } catch (error) {
      console.error("Failed to regenerate response:", error);
      toast({
        title: "Response Generation Failed",
        variant: "destructive",
      });
    } finally {
      setIsAnalysisLoading(false);
    }
  };
  
  if (!user || isLoadingEmails) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col">
      <header className="flex h-16 items-center justify-between border-b bg-card px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Icons.logo className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            MailPilot AI
          </h1>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </header>
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mb-6">
          <StatsCards emails={allEmails} />
        </div>
        <div className="grid h-[calc(100%-120px)] grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <EmailList
              emails={allEmails}
              selectedEmailId={selectedEmailId}
              onSelectEmail={handleSelectEmail}
              isLoading={isLoadingEmails}
              sentimentIcons={sentimentIcons}
              priorityIcons={priorityIcons}
            />
          </div>
          <div className="lg:col-span-5">
            {selectedEmail ? (
              <EmailView email={selectedEmail} />
            ) : (
              <div className="flex h-full items-center justify-center rounded-lg border border-dashed">
                <div className="text-center text-muted-foreground">
                  <Mail className="mx-auto h-12 w-12" />
                  <p className="mt-4">Select an email to view its content</p>
                   {allEmails.length === 0 && !isLoadingEmails && (
                    <p className="mt-2 text-sm">No emails found. This could be because there are no emails matching the search query or an issue with permissions.</p>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="lg:col-span-4">
            {selectedEmail ? (
              <div className="flex h-full flex-col gap-6">
                <AIPanel
                  analysis={analysis}
                  generatedResponse={generatedResponse}
                  setGeneratedResponse={setGeneratedResponse}
                  knowledgeBase={knowledgeBase}
                  setKnowledgeBase={setKnowledgeBase}
                  isLoading={isAnalysisLoading}
                  onRegenerate={handleRegenerateResponse}
                />
                <SentimentPriorityChart emails={allEmails} />
              </div>
            ) : (
              <div className="flex h-full items-center justify-center rounded-lg border border-dashed">
                <div className="text-center text-muted-foreground">
                  {isLoadingEmails ? (
                     <Loader2 className="mx-auto h-12 w-12 animate-spin" />
                  ) : (
                     <Icons.logo className="mx-auto h-12 w-12" />
                  )}
                  <p className="mt-4">Select an email to see AI analysis</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
