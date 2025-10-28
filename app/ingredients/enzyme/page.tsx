"use client";

import { useState } from "react";
import { Search, ListFilter, CircleUser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { enzymes, nameToSlug } from "@/lib/ingredient-data";
import { BulkImportModal } from "@/components/bulk-import-modal";

interface BulkImportRow {
  id: string;
  [key: string]: string;
}

export default function EnzymePage() {
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);

  const handleBulkImport = (data: BulkImportRow[]) => {
    console.log("Imported enzyme data:", data);
    // TODO: Process and save the imported data
  };

  return (
    <div className="min-h-screen bg-background">
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

      <div className="border-b border-border bg-background px-6 py-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Link href="/ingredients" className="text-muted-foreground hover:text-foreground">
            Ingredients
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground">Enzyme</span>
        </div>
      </div>

      <main className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Tooltip content="Not Yet Built" side="bottom">
              <Button variant="outline" size="sm">
                <ListFilter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </Tooltip>
            <div className="w-[373px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="search" placeholder="Search" className="pl-9" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsBulkImportOpen(true)}>
              Bulk Import
            </Button>
            <Tooltip content="Not Yet Built" side="bottom">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold" size="sm">
                Add Ingredient
              </Button>
            </Tooltip>
          </div>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[443px]">Name</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Last Edited</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enzymes.map((enzyme, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/ingredients/enzyme/${nameToSlug(enzyme.name)}`}
                      className="hover:underline"
                    >
                      {enzyme.name}
                    </Link>
                  </TableCell>
                  <TableCell>{enzyme.activity}</TableCell>
                  <TableCell>{enzyme.lastEdited}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>

      {/* Bulk Import Modal */}
      <BulkImportModal
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
        onImport={handleBulkImport}
        columns={[
          { key: "name", label: "Name" },
          { key: "activity", label: "Activity" },
        ]}
      />
    </div>
  );
}

