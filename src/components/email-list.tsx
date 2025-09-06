"use client";

import * as React from "react";
import { formatDistanceToNow } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Email } from "@/lib/types";

interface EmailListProps {
  emails: Email[];
  selectedEmailId: string | null;
  onSelectEmail: (id: string) => void;
  isLoading: boolean;
  sentimentIcons: Record<string, React.ReactNode>;
  priorityIcons: Record<string, React.ReactNode>;
}

function ClientTime({ date }: { date: string }) {
  const [time, setTime] = React.useState<string | null>(null);

  React.useEffect(() => {
    setTime(formatDistanceToNow(new Date(date), { addSuffix: true }));
  }, [date]);

  return (
    <time className="text-xs text-muted-foreground">
      {time || "..."}
    </time>
  );
}

export function EmailList({
  emails,
  selectedEmailId,
  onSelectEmail,
  isLoading,
  sentimentIcons,
  priorityIcons,
}: EmailListProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Inbox</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-4rem)] p-0">
        <ScrollArea className="h-full">
          {isLoading ? (
            <div className="space-y-2 p-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-start space-x-4 rounded-md border p-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {emails.map((email) => (
                <button
                  key={email.id}
                  className={cn(
                    "w-full rounded-lg p-3 text-left transition-colors",
                    selectedEmailId === email.id
                      ? "bg-primary/10"
                      : "hover:bg-muted"
                  )}
                  onClick={() => onSelectEmail(email.id)}
                >
                  <div className="flex items-start justify-between">
                    <p className="font-semibold">{email.from.name}</p>
                    <ClientTime date={email.date} />
                  </div>
                  <p className="mb-1 text-sm font-medium line-clamp-1">
                    {email.subject}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {email.body}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    {email.priority && priorityIcons[email.priority]}
                    {email.sentiment && sentimentIcons[email.sentiment]}
                    {email.labels.map((label) => (
                      <Badge
                        key={label}
                        variant={
                          label === "Resolved" ? "secondary" : "outline"
                        }
                      >
                        {label}
                      </Badge>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
