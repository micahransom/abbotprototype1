"use client";

import { CircleUser, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { use } from "react";
import { getIngredientBySlug } from "@/lib/ingredient-data";

export default function PrimerProbePairDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.id;
  const pairData = getIngredientBySlug("primer-probe-pair", slug);

  if (!pairData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Primer Probe Pair not found</h1>
          <p className="text-muted-foreground mt-2">Slug: {slug}</p>
          <Link href="/ingredients/primer-probe-pair" className="text-primary hover:underline mt-4 inline-block">
            Back to Primer Probe Pairs
          </Link>
        </div>
      </div>
    );
  }
  
  const data = pairData as { name: string; primer1: string; primer2: string; probe: string };

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
              <Link href="/">
                <span className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </span>
              </Link>
              <Link href="/experiments">
                <span className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Experiments
                </span>
              </Link>
              <Link href="/ingredients">
                <span className="text-sm font-medium text-foreground">
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

      {/* Breadcrumb */}
      <div className="border-b border-border bg-background px-6 py-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Link href="/ingredients" className="text-muted-foreground hover:text-foreground">
            Ingredients
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link href="/ingredients/primer-probe-pair" className="text-muted-foreground hover:text-foreground">
            Primer Probe Pair
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground">{data.name}</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="bg-background flex flex-col items-center px-8 py-16 gap-8">
        <div className="flex flex-col gap-6 w-[600px]">
          {/* Title */}
          <h1 className="text-5xl font-bold text-accent-foreground leading-none">
            {data.name}
          </h1>

          {/* Notes */}
          <div className="flex items-center gap-2">
            <p className="text-base text-foreground">Add notes...</p>
          </div>

          {/* Attributes Section */}
          <div className="flex flex-col gap-6">
            <div className="border-b border-border pb-2 pt-4 flex items-center justify-between">
              <h2 className="text-3xl font-semibold text-foreground">Attributes</h2>
              <Button variant="outline" size="sm">
                <Pencil className="w-4 h-4" />
              </Button>
            </div>

            {/* Attributes Table */}
            <div className="flex items-center">
              <div className="flex-1 overflow-clip px-px">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1 w-[150px]">
                    <div className="flex items-center py-2">
                      <p className="text-base text-muted-foreground">Primer 1</p>
                    </div>
                    <div className="flex items-center py-2">
                      <p className="text-base text-muted-foreground">Primer 2</p>
                    </div>
                    <div className="flex items-center py-2">
                      <p className="text-base text-muted-foreground">Probe</p>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex items-center gap-2 h-10 p-2 min-w-[85px]">
                      <Badge variant="outline" className="bg-slate-100 border-slate-300">
                        {data.primer1}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 h-10 p-2 min-w-[85px]">
                      <Badge variant="outline" className="bg-slate-100 border-slate-300">
                        {data.primer2}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 h-10 p-2 min-w-[85px]">
                      <Badge variant="outline" className="bg-slate-100 border-slate-300">
                        {data.probe}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

