"use client";

import { format } from "date-fns";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Email } from "@/lib/types";

interface EmailViewProps {
  email: Email;
}

export function EmailView({ email }: EmailViewProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={email.from.avatar} alt={email.from.name} data-ai-hint="profile picture" />
              <AvatarFallback>
                {email.from.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <p className="font-semibold">{email.from.name}</p>
              <p className="text-sm text-muted-foreground">
                {email.from.email}
              </p>
            </div>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            {format(new Date(email.date), "PPP p")}
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        <h2 className="mb-4 text-2xl font-bold">{email.subject}</h2>
        <div
          className="prose prose-sm max-w-none text-foreground dark:prose-invert"
          dangerouslySetInnerHTML={{
            __html: email.body.replace(/\n/g, "<br />"),
          }}
        />
        <Separator className="my-6" />
        <div className="flex gap-2">
          <Button variant="outline">Reply</Button>
          <Button variant="outline">Forward</Button>
        </div>
      </CardContent>
    </Card>
  );
}
