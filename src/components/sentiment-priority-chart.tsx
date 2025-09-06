"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { Email } from "@/lib/types";

const chartConfig = {
  Positive: {
    label: "Positive",
    color: "hsl(var(--chart-2))",
  },
  Negative: {
    label: "Negative",
    color: "hsl(var(--chart-5))",
  },
  Neutral: {
    label: "Neutral",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

interface SentimentPriorityChartProps {
  emails: Email[];
}

export function SentimentPriorityChart({ emails }: SentimentPriorityChartProps) {
  const chartData = React.useMemo(() => {
    const data = {
      Urgent: { Positive: 0, Negative: 0, Neutral: 0, name: "Urgent" },
      "Not Urgent": {
        Positive: 0,
        Negative: 0,
        Neutral: 0,
        name: "Not Urgent",
      },
    };

    emails.forEach((email) => {
      if (email.priority && email.sentiment) {
        data[email.priority][email.sentiment]++;
      }
    });

    return Object.values(data);
  }, [emails]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Analytics</CardTitle>
        <CardDescription>Sentiment by Priority</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              stroke="hsl(var(--muted-foreground))"
              tickFormatter={(value) => value.substring(0, 3)}
            />
             <YAxis
              stroke="hsl(var(--muted-foreground))"
              allowDecimals={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="Positive"
              stackId="a"
              fill="var(--color-Positive)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="Neutral"
              stackId="a"
              fill="var(--color-Neutral)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="Negative"
              stackId="a"
              fill="var(--color-Negative)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
