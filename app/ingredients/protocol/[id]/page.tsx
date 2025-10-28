"use client";

import { CircleUser, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { use } from "react";
import { getIngredientBySlug } from "@/lib/ingredient-data";

export default function ProtocolDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.id;
  const protocolData = getIngredientBySlug("protocol", slug);

  if (!protocolData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Protocol not found</h1>
          <Link href="/ingredients/protocol" className="text-primary hover:underline mt-4 inline-block">Back to Protocols</Link>
        </div>
      </div>
    );
  }
  
  const data = protocolData as { name: string; type: string; duration: string; temperature: string };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-background">
        <div className="flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-6">
            <Link href="/"><div className="w-6 h-3 bg-foreground rounded-sm" /></Link>
            <div className="flex items-center gap-4">
              <Link href="/"><span className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Dashboard</span></Link>
              <Link href="/experiments"><span className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Experiments</span></Link>
              <Link href="/ingredients"><span className="text-sm font-medium text-foreground">Ingredients</span></Link>
              <Link href="/analysis"><span className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Analysis</span></Link>
            </div>
          </div>
          <button className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center shadow-sm"><CircleUser className="w-4 h-4" /></button>
        </div>
      </nav>

      <div className="border-b border-border bg-background px-6 py-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Link href="/ingredients" className="text-muted-foreground hover:text-foreground">Ingredients</Link>
          <span className="text-muted-foreground">/</span>
          <Link href="/ingredients/protocol" className="text-muted-foreground hover:text-foreground">Protocol</Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground">{data.name}</span>
        </div>
      </div>

      <main className="bg-background flex flex-col items-center px-8 py-16 gap-8">
        <div className="flex flex-col gap-6 w-[600px]">
          <h1 className="text-5xl font-bold text-accent-foreground leading-none">{data.name}</h1>
          <div className="flex items-center gap-2"><p className="text-base text-foreground">Add notes...</p></div>

          <div className="flex flex-col gap-6">
            <div className="border-b border-border pb-2 pt-4 flex items-center justify-between">
              <h2 className="text-3xl font-semibold text-foreground">Attributes</h2>
              <Button variant="outline" size="sm"><Pencil className="w-4 h-4" /></Button>
            </div>

            <div className="flex items-center">
              <div className="flex-1 overflow-clip px-px">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1 w-[150px]">
                    <div className="flex items-center py-2"><p className="text-base text-muted-foreground">Name</p></div>
                    <div className="flex items-center py-2"><p className="text-base text-muted-foreground">Type</p></div>
                    <div className="flex items-center py-2"><p className="text-base text-muted-foreground">Duration</p></div>
                    <div className="flex items-center py-2"><p className="text-base text-muted-foreground">Temperature</p></div>
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex items-center gap-2 h-10 p-2 min-w-[85px]">
                      <Badge variant="outline" className="bg-slate-100 border-slate-300">{data.name}</Badge>
                    </div>
                    <div className="flex items-center gap-2 h-10 p-2 min-w-[85px]"><span className="text-sm">{data.type}</span></div>
                    <div className="flex items-center gap-2 h-10 p-2 min-w-[85px]"><span className="text-sm">{data.duration}</span></div>
                    <div className="flex items-center gap-2 h-10 p-2 min-w-[85px]"><span className="text-sm">{data.temperature}</span></div>
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

