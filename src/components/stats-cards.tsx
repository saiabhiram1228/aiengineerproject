"use client";

import * as React from "react";
import { AlertCircle, CheckCircle2, FileClock, Inbox } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Email } from "@/lib/types";

interface StatsCardsProps {
  emails: Email[];
}

export function StatsCards({ emails }: StatsCardsProps) {
  const stats = React.useMemo(() => {
    return {
      total: emails.length,
      urgent: emails.filter((e) => e.priority === "Urgent").length,
      pending: emails.filter((e) => e.labels.includes("Pending")).length,
      resolved: emails.filter((e) => e.labels.includes("Resolved")).length,
    };
  }, [emails]);

  const statItems = [
    {
      title: "Total Emails",
      value: stats.total,
      icon: <Inbox className="h-5 w-5 text-muted-foreground" />,
    },
    {
      title: "Urgent",
      value: stats.urgent,
      icon: <AlertCircle className="h-5 w-5 text-muted-foreground" />,
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: <FileClock className="h-5 w-5 text-muted-foreground" />,
    },
    {
      title: "Resolved",
      value: stats.resolved,
      icon: <CheckCircle2 className="h-5 w-5 text-muted-foreground" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item) => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            {item.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
