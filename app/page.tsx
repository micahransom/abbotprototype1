"use client";

import { Search, CircleUser } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip } from "@/components/ui/tooltip";
import Link from "next/link";

const experiments = [
  {
    title: "20250814_NEAR.XML.Evaluation_CR",
    editedDays: 4,
    status: "inProgress" as const,
    link: "/experiments/20250814_NEAR.XML.Evaluation_CR",
  },
  {
    title: "Combo Testing w Target",
    editedDays: 5,
    status: "inProgress" as const,
    link: "/experiments/20250814_NEAR.XML.Evaluation_CR",
  },
  {
    title: "TTR RT and ID Time and Temp",
    editedDays: 8,
    status: "completed" as const,
    link: "/experiments/20250814_NEAR.XML.Evaluation_CR",
  },
  {
    title: "NEARLyoyoQC_KS",
    editedDays: 8,
    status: "completed" as const,
    link: "/experiments/20250814_NEAR.XML.Evaluation_CR",
  },
];

const chartData = [
  { month: "Jan", value: 23.8 },
  { month: "Feb", value: 22.5 },
  { month: "Mar", value: 21.2 },
  { month: "Apr", value: 20.8 },
  { month: "May", value: 19.5 },
  { month: "Jun", value: 18.9 },
  { month: "Jul", value: 17.6 },
  { month: "Aug", value: 17.2 },
  { month: "Sep", value: 16.8 },
  { month: "Oct", value: 15.9 },
  { month: "Nov", value: 15.3 },
  { month: "Dec", value: 14.7 },
];

const velocityData = [
  { month: "Nov", value: 24, highlighted: true },
  { month: "Oct", value: 22, highlighted: false },
  { month: "Sep", value: 22, highlighted: false },
  { month: "Aug", value: 21, highlighted: false },
];

export default function Dashboard() {
  const maxValue = Math.max(...chartData.map((d) => d.value));

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background">
        <div className="flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-6">
            <Link href="/">
              <div className="w-6 h-3 bg-foreground rounded-sm" />
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-foreground">
                Dashboard
              </span>
              <Link href="/experiments">
                <span className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Experiments
                </span>
              </Link>
              <Link href="/ingredients">
                <span className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Ingredients
                </span>
              </Link>
              <Link href="/analysis">
                <span className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Analysis
                </span>
              </Link>
            </div>
          </div>
          <button className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center shadow-sm">
            <CircleUser className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-8">
        {/* Filter Section */}
        <div className="flex items-center justify-between mb-8">
          <Tooltip content="Not Yet Built" side="bottom" className="inline-block">
            <Button variant="outline">
              Configure Dashboard
            </Button>
          </Tooltip>
          <Tooltip content="Not Yet Built" side="bottom" className="w-[500px]">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-9 w-full"
              />
            </div>
          </Tooltip>
        </div>

        {/* Experiment Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {experiments.map((exp, idx) => (
            exp.link ? (
              <Link key={idx} href={exp.link} className="block">
                <Card className="p-6 cursor-pointer hover:bg-accent/50 transition-colors">
                  <div className="flex flex-col gap-2">
                    <div>
                      <p className="text-sm font-medium text-card-foreground">
                        {exp.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Edited {exp.editedDays} days ago
                      </p>
                    </div>
                    <div className="flex justify-start">
                      <Badge variant={exp.status} className="w-fit">
                        {exp.status === "inProgress" ? "In Progress" : "Completed"}
                      </Badge>
                    </div>
                  </div>
                </Card>
              </Link>
            ) : (
              <Card key={idx} className="p-6">
                <div className="flex flex-col gap-2">
                  <div>
                    <p className="text-sm font-medium text-card-foreground">
                      {exp.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Edited {exp.editedDays} days ago
                    </p>
                  </div>
                  <div className="flex justify-start">
                    <Badge variant={exp.status} className="w-fit">
                      {exp.status === "inProgress" ? "In Progress" : "Completed"}
                    </Badge>
                  </div>
                </div>
              </Card>
            )
          ))}
        </div>

        {/* Charts Section */}
        <div className="flex gap-8 mb-8">
          {/* Bar Chart */}
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Time to Result (Oscar)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative h-[320px]">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-8 w-12 flex flex-col justify-between text-xs text-muted-foreground text-right pr-2">
                  <span>24 min</span>
                  <span>18 min</span>
                  <span>12 min</span>
                  <span>6 min</span>
                  <span>0</span>
                </div>

                {/* Chart area */}
                <div className="absolute left-12 right-0 top-0 bottom-8">
                  {/* Grid lines */}
                  <div className="absolute inset-0 flex flex-col justify-between">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-px bg-border"
                      />
                    ))}
                  </div>

                  {/* Bars */}
                  <div className="absolute inset-0 flex items-end justify-around gap-1">
                    {chartData.map((data, idx) => (
                      <div
                        key={idx}
                        className="flex-1 flex items-end justify-center h-full"
                      >
                        <div
                          className="w-full bg-primary rounded-t-md"
                          style={{
                            height: `${(data.value / maxValue) * 100}%`,
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* X-axis labels below the 0 line */}
                <div className="absolute left-12 right-0 bottom-0 h-6 flex items-center justify-around">
                  {chartData.map((data, idx) => (
                    <div key={idx} className="flex-1 flex justify-center">
                      <span className="text-xs text-muted-foreground">
                        {data.month}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Velocity Card */}
          <Card className="w-[320px]">
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle>Experiment Velocity</CardTitle>
                <Tooltip content="Not Yet Built" side="bottom" className="inline-block">
                  <Button variant="outline" size="sm">
                    Overall
                  </Button>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {velocityData.map((data, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-end gap-1">
                    <span className="text-2xl font-bold">{data.value}</span>
                    <span className="text-sm text-muted-foreground flex-1">
                      experiments completed/month
                    </span>
                  </div>
                  <div className="relative h-8">
                    <div
                      className={`absolute left-0 top-0 h-full rounded ${
                        data.highlighted ? "bg-primary" : "bg-muted"
                      }`}
                      style={{ width: `${(data.value / 24) * 100}%` }}
                    />
                    <span
                      className={`absolute left-2 top-1/2 -translate-y-1/2 text-xs ${
                        data.highlighted
                          ? "text-white"
                          : "text-muted-foreground"
                      }`}
                    >
                      {data.month}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Placeholder Sections */}
        <div className="grid grid-cols-3 gap-8 mb-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[396px] rounded border border-slate-200 bg-[#dce1ff] flex items-center justify-center"
            >
              <p className="text-sm font-medium text-black">Placeholder</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[396px] rounded border border-slate-200 bg-[#dce1ff] flex items-center justify-center"
            >
              <p className="text-sm font-medium text-black">Placeholder</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
