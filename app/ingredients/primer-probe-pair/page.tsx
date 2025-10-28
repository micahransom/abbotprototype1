"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Link from "next/link";
import { primerProbePairs, nameToSlug } from "@/lib/ingredient-data";
import { BulkImportModal } from "@/components/bulk-import-modal";

interface BulkImportRow {
  id: string;
  [key: string]: string;
}

export default function PrimerProbePairPage() {
  const router = useRouter();
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);

  const handleBulkImport = (data: BulkImportRow[]) => {
    console.log("Imported data:", data);
    // TODO: Process and save the imported data
  };
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
          <span className="text-foreground">Primer Probe Pair</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="p-8">
        {/* Filter Section */}
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

        {/* Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[443px]">Name</TableHead>
                <TableHead>Primer 1 ID</TableHead>
                <TableHead>Primer 2 ID</TableHead>
                <TableHead>Probe ID</TableHead>
                <TableHead>Last Edited</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {primerProbePairs.map((pair, idx) => (
                <TableRow 
                  key={idx}
                  onClick={() => router.push(`/ingredients/primer-probe-pair/${nameToSlug(pair.name)}`)}
                  className="cursor-pointer"
                >
                  <TableCell className="font-medium">
                    {pair.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{pair.primer1}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{pair.primer2}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{pair.probe}</Badge>
                  </TableCell>
                  <TableCell>{pair.lastEdited}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink isActive>2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink>3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </main>

      {/* Bulk Import Modal */}
      <BulkImportModal
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
        onImport={handleBulkImport}
        columns={[
          { key: "assayTitle", label: "Assay Title" },
          { key: "primer1", label: "Primer 1" },
          { key: "primer2", label: "Primer 2" },
          { key: "probe", label: "Probe" },
        ]}
      />
    </div>
  );
}

