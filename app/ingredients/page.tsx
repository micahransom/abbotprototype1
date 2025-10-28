"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, ListFilter, CircleUser, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { 
  buffers, 
  enzymes, 
  oligonucleotides, 
  preservatives, 
  primerProbePairs, 
  protocols, 
  salts, 
  stabilizers, 
  targets, 
  thermocyclers 
} from "@/lib/ingredient-data";
import { IngredientCategoriesFilterPanel, CategoryFilterOptions } from "@/components/ingredient-categories-filter-panel";

const ingredientsData = [
  { category: "Buffer", count: buffers.length },
  { category: "Enzyme", count: enzymes.length },
  { category: "Oligonucleotide", count: oligonucleotides.length },
  { category: "Preservatives", count: preservatives.length },
  { category: "Primer Probe Pair", count: primerProbePairs.length },
  { category: "Protocol", count: protocols.length },
  { category: "Salt", count: salts.length },
  { category: "Stabilizers", count: stabilizers.length },
  { category: "Target", count: targets.length },
  { category: "Thermocycler", count: thermocyclers.length },
];

type SortField = "category" | "count";
type SortDirection = "asc" | "desc";

export default function IngredientsPage() {
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("category");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [filters, setFilters] = useState<CategoryFilterOptions>({
    minItems: undefined,
    maxItems: undefined,
  });

  // Filter and sort logic
  const filteredAndSortedCategories = useMemo(() => {
    let result = [...ingredientsData];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((item) =>
        item.category.toLowerCase().includes(query)
      );
    }

    // Apply min items filter
    if (filters.minItems !== undefined) {
      result = result.filter((item) => item.count >= filters.minItems!);
    }

    // Apply max items filter
    if (filters.maxItems !== undefined) {
      result = result.filter((item) => item.count <= filters.maxItems!);
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        case "count":
          comparison = a.count - b.count;
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [searchQuery, filters, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const activeFiltersCount =
    (filters.minItems !== undefined ? 1 : 0) +
    (filters.maxItems !== undefined ? 1 : 0);

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
              <span className="text-sm font-medium text-foreground">
                Ingredients
              </span>
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
          <span className="text-foreground">Ingredients</span>
          <span className="text-muted-foreground">/</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="p-8">
        {/* Filter Section */}
        <div className="flex items-center gap-2 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFilterOpen(true)}
            className="relative"
          >
            <ListFilter className="w-4 h-4 mr-2" />
            Filter
            {activeFiltersCount > 0 && (
              <Badge
                variant="default"
                className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]"
              >
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
          <div className="w-[373px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search"
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredAndSortedCategories.length} of {ingredientsData.length}{" "}
            categories
          </p>
        </div>

        {/* Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[443px]">
                  <button
                    onClick={() => handleSort("category")}
                    className="flex items-center gap-2 hover:text-foreground"
                  >
                    Category Name
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort("count")}
                    className="flex items-center gap-2 hover:text-foreground"
                  >
                    Amount
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-8 text-muted-foreground">
                    No categories found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedCategories.map((item, idx) => {
                  const categorySlug = item.category.toLowerCase().replace(/\s+/g, '-');
                  return (
                    <TableRow 
                      key={idx}
                      onClick={() => router.push(`/ingredients/${categorySlug}`)}
                      className="cursor-pointer"
                    >
                      <TableCell className="font-medium">
                        {item.category}
                      </TableCell>
                      <TableCell>{item.count}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </main>

      {/* Filter Panel */}
      <IngredientCategoriesFilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
      />
    </div>
  );
}
