"use client";

import { Bot, Lightbulb, Loader2, Send, Sparkles, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { Analysis } from "@/lib/types";

interface AIPanelProps {
  analysis: Analysis | null;
  generatedResponse: string;
  setGeneratedResponse: (response: string) => void;
  knowledgeBase: string;
  setKnowledgeBase: (kb: string) => void;
  isLoading: boolean;
  onRegenerate: () => void;
}

export function AIPanel({
  analysis,
  generatedResponse,
  setGeneratedResponse,
  knowledgeBase,
  setKnowledgeBase,
  isLoading,
  onRegenerate,
}: AIPanelProps) {
  const { toast } = useToast();

  const handleSend = () => {
    toast({
      title: "Response Sent!",
      description: "Your email has been successfully sent.",
    });
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="response">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="response">Generated Response</TabsTrigger>
            <TabsTrigger value="info">Extracted Info</TabsTrigger>
          </TabsList>
          <TabsContent value="response" className="mt-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="knowledge-base" className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-4 w-4" />
                  Knowledge Base (RAG)
                </Label>
                <Textarea
                  id="knowledge-base"
                  placeholder="Add any relevant information, documents, or context here to improve the AI response..."
                  value={knowledgeBase}
                  onChange={(e) => setKnowledgeBase(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
              <div>
                <Label htmlFor="response" className="flex items-center gap-2 mb-2">
                  <Bot className="h-4 w-4" />
                  AI Response
                </Label>
                {isLoading ? (
                  <Skeleton className="h-40 w-full" />
                ) : (
                  <Textarea
                    id="response"
                    placeholder="AI-generated response will appear here..."
                    value={generatedResponse}
                    onChange={(e) => setGeneratedResponse(e.target.value)}
                    className="h-40"
                  />
                )}
              </div>
              <div className="flex justify-between gap-2">
                <Button
                  onClick={onRegenerate}
                  variant="outline"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Regenerate
                </Button>
                <Button onClick={handleSend} disabled={isLoading}>
                  <Send className="mr-2 h-4 w-4" />
                  Send
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="info" className="mt-4 space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : analysis ? (
              <>
                <InfoCard
                  title="Contact Details"
                  content={analysis.extractedInfo.contactDetails}
                  icon={<User className="h-5 w-5 text-muted-foreground" />}
                />
                <InfoCard
                  title="Customer Requirements"
                  content={analysis.extractedInfo.customerRequirements}
                  icon={<Bot className="h-5 w-5 text-muted-foreground" />}
                />
                <InfoCard
                  title="Sentiment Indicators"
                  content={analysis.extractedInfo.sentimentIndicators}
                  icon={<Sparkles className="h-5 w-5 text-muted-foreground" />}
                />
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                No information extracted yet.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function InfoCard({ title, content, icon }: { title: string; content: string; icon: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {content || "Not found"}
        </p>
      </CardContent>
    </Card>
  );
}
