"use client";

import { useState, useMemo } from "react";
import { ListFilter, CircleUser, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";
import Link from "next/link";
import { AnalysisFilterPanel, AnalysisFilterOptions } from "@/components/analysis-filter-panel";
import {
  buffers,
  enzymes,
  oligonucleotides,
  preservatives,
  primerProbePairs,
  protocols,
  salts,
  stabilizers,
  thermocyclers,
} from "@/lib/ingredient-data";

// Generate realistic fluorescence curve data (sharp rise then gradual decrease)
const generateFluorescenceData = (seed: number) => {
  const timePoints = Array.from({ length: 60 }, (_, i) => i); // 60 cycles, 0 to 59
  const samples = 3; // 3 samples/wells

  const data = [];
  for (let sample = 0; sample < samples; sample++) {
    const baseline = 2500 + (seed * 60 + sample * 100);
    const peakValue = 20000 + (seed * 250 + sample * 600);
    const riseStartCycle = 8 + (seed * 0.3); // Curve starts rising after ~8 cycles
    const peakCycle = 25 + (seed * 0.6 + sample * 0.7); // Peak occurs between cycles 25-35
    const riseRate = 2.2 + (sample * 0.15); // Smoother rise (lower value = smoother)
    const decayRate = 0.015 + (sample * 0.001); // Gradual decay

    for (const cycle of timePoints) {
      let fluorescence;
      if (cycle < riseStartCycle) {
        // Stay at baseline before rise starts
        fluorescence = baseline;
      } else if (cycle < peakCycle) {
        // Smoother exponential rise
        const progress = (cycle - riseStartCycle) / (peakCycle - riseStartCycle);
        fluorescence = baseline + (peakValue - baseline) * Math.pow(progress, 1 / riseRate);
      } else {
        // Gradual exponential decay towards baseline
        const cyclesSincePeak = cycle - peakCycle;
        const decayProgress = Math.exp(-decayRate * cyclesSincePeak);
        fluorescence = baseline + (peakValue - baseline) * decayProgress;
      }

      // Add small scatter for realism - controlled magnitude
      const scatter = (Math.sin(seed * sample + cycle * 0.8) * 0.5 + (Math.random() - 0.5)) * 150;
      // Ensure all points stay within bounds with padding
      fluorescence = Math.max(baseline * 0.98, Math.min(28000, fluorescence + scatter));

      data.push({
        time: cycle,
        fluorescence,
        sample,
      });
    }
  }

  return data;
};

const FluorescencePlot = ({ seed }: { seed: number }) => {
  const data = generateFluorescenceData(seed);
  const curveColor = "#3b82f6"; // Single blue color for all curves

  return (
    <div className="relative w-full aspect-[1364/1224] bg-white">
      {/* Chart area */}
      <div className="absolute inset-0 border border-border">
        {/* Y-axis label */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2">
          <div className="-rotate-90 whitespace-nowrap">
            <span className="text-xs text-foreground">Fluorescence</span>
          </div>
        </div>

        {/* Y-axis labels */}
        <div className="absolute left-12 top-2 bottom-10 w-12 flex flex-col justify-between text-[10px] text-muted-foreground text-right pr-2">
          <span>30000</span>
          <span>25000</span>
          <span>20000</span>
          <span>15000</span>
          <span>10000</span>
          <span>5000</span>
          <span>0</span>
        </div>

        {/* SVG for fluorescence curves */}
        <svg
          className="absolute left-24 right-2 top-2 bottom-10"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Grid lines */}
          {[0, 16.67, 33.33, 50, 66.67, 83.33, 100].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="#e5e7eb"
              strokeWidth="0.2"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          {/* Draw curves as dots */}
          {data.map((point, idx) => {
            const x = (point.time / 60) * 100;
            const y = 100 - ((point.fluorescence / 30000) * 100);
            return (
              <circle
                key={idx}
                cx={x}
                cy={y}
                r="0.6"
                fill={curveColor}
                opacity="0.7"
              />
            );
          })}
        </svg>

        {/* X-axis labels */}
        <div className="absolute bottom-2 left-24 right-2 h-8 flex justify-between text-[10px] text-muted-foreground items-start">
          <span>0</span>
          <span>10</span>
          <span>20</span>
          <span>30</span>
          <span>40</span>
          <span>50</span>
          <span>60</span>
        </div>

        {/* X-axis label */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
          <span className="text-xs text-foreground whitespace-nowrap">Time (cycles)</span>
        </div>
      </div>
    </div>
  );
};

const analysisData = [
  {
    experiment: "20250814_NEAR.XML.Evaluation_CR",
    run: "Run 1",
    concentration: "1e5 cps/uL",
    target: "Strep A",
    seed: 1,
  },
  {
    experiment: "20250814_NEAR.XML.Evaluation_CR",
    run: "Run 2",
    concentration: "1e4 cps/uL",
    target: "Strep A",
    seed: 2,
  },
  {
    experiment: "20250814_NEAR.XML.Evaluation_CR",
    run: "Run 3",
    concentration: "1e3 cps/uL",
    target: "Strep A",
    seed: 3,
  },
  {
    experiment: "20250512_MV_STI_PrimerScreening_SYBR",
    run: "Run 1",
    concentration: "5e4 cps/uL",
    target: "TV",
    seed: 4,
  },
  {
    experiment: "20250512_MV_STI_PrimerScreening_SYBR",
    run: "Run 2",
    concentration: "2.5e4 cps/uL",
    target: "TV",
    seed: 5,
  },
  {
    experiment: "20250512_MV_STI_PrimerScreening_SYBR",
    run: "Run 3",
    concentration: "1e4 cps/uL",
    target: "TV",
    seed: 6,
  },
  {
    experiment: "20250618_Combo_Testing_Target",
    run: "Run 1",
    concentration: "1e5 cps/uL",
    target: "Influenza A",
    seed: 7,
  },
  {
    experiment: "20250618_Combo_Testing_Target",
    run: "Run 2",
    concentration: "5e4 cps/uL",
    target: "Influenza A",
    seed: 8,
  },
  {
    experiment: "20250618_Combo_Testing_Target",
    run: "Run 3",
    concentration: "1e4 cps/uL",
    target: "Influenza A",
    seed: 9,
  },
  {
    experiment: "20250618_Combo_Testing_Target",
    run: "Run 4",
    concentration: "1e3 cps/uL",
    target: "Influenza A",
    seed: 10,
  },
  {
    experiment: "20250722_TTR_RT_ID_Time_Temp",
    run: "Run 1",
    concentration: "1e5 cps/uL",
    target: "RSV A",
    seed: 11,
  },
  {
    experiment: "20250722_TTR_RT_ID_Time_Temp",
    run: "Run 2",
    concentration: "5e4 cps/uL",
    target: "RSV A",
    seed: 12,
  },
  {
    experiment: "20250722_TTR_RT_ID_Time_Temp",
    run: "Run 3",
    concentration: "1e4 cps/uL",
    target: "RSV A",
    seed: 13,
  },
  {
    experiment: "20250722_TTR_RT_ID_Time_Temp",
    run: "Run 4",
    concentration: "5e3 cps/uL",
    target: "RSV A",
    seed: 14,
  },
  {
    experiment: "20250722_TTR_RT_ID_Time_Temp",
    run: "Run 5",
    concentration: "1e3 cps/uL",
    target: "RSV A",
    seed: 15,
  },
  {
    experiment: "20250825_NEARLyoyoQC_KS",
    run: "Run 1",
    concentration: "1e5 cps/uL",
    target: "COVID-19",
    seed: 16,
  },
  {
    experiment: "20250825_NEARLyoyoQC_KS",
    run: "Run 2",
    concentration: "5e4 cps/uL",
    target: "COVID-19",
    seed: 17,
  },
  {
    experiment: "20250825_NEARLyoyoQC_KS",
    run: "Run 3",
    concentration: "1e4 cps/uL",
    target: "COVID-19",
    seed: 18,
  },
  {
    experiment: "20250901_Buffer_Optimization_Mix83",
    run: "Run 1",
    concentration: "1e5 cps/uL",
    target: "Strep B",
    seed: 19,
  },
  {
    experiment: "20250901_Buffer_Optimization_Mix83",
    run: "Run 2",
    concentration: "5e4 cps/uL",
    target: "Strep B",
    seed: 20,
  },
  {
    experiment: "20250901_Buffer_Optimization_Mix83",
    run: "Run 3",
    concentration: "1e4 cps/uL",
    target: "Strep B",
    seed: 21,
  },
  {
    experiment: "20250901_Buffer_Optimization_Mix83",
    run: "Run 4",
    concentration: "5e3 cps/uL",
    target: "Strep B",
    seed: 22,
  },
  {
    experiment: "20250915_Enzyme_Titration_mTAQ2",
    run: "Run 1",
    concentration: "2e5 cps/uL",
    target: "Influenza B",
    seed: 23,
  },
  {
    experiment: "20250915_Enzyme_Titration_mTAQ2",
    run: "Run 2",
    concentration: "1e5 cps/uL",
    target: "Influenza B",
    seed: 24,
  },
  {
    experiment: "20250915_Enzyme_Titration_mTAQ2",
    run: "Run 3",
    concentration: "5e4 cps/uL",
    target: "Influenza B",
    seed: 25,
  },
  {
    experiment: "20250915_Enzyme_Titration_mTAQ2",
    run: "Run 4",
    concentration: "1e4 cps/uL",
    target: "Influenza B",
    seed: 26,
  },
  {
    experiment: "20251003_Stability_Study_4C",
    run: "Run 1",
    concentration: "1e5 cps/uL",
    target: "RSV B",
    seed: 27,
  },
  {
    experiment: "20251003_Stability_Study_4C",
    run: "Run 2",
    concentration: "1e5 cps/uL",
    target: "RSV B",
    seed: 28,
  },
  {
    experiment: "20251003_Stability_Study_4C",
    run: "Run 3",
    concentration: "1e5 cps/uL",
    target: "RSV B",
    seed: 29,
  },
  {
    experiment: "20251010_LOD_Verification_Panel",
    run: "Run 1",
    concentration: "500 cps/uL",
    target: "CT",
    seed: 30,
  },
  {
    experiment: "20251010_LOD_Verification_Panel",
    run: "Run 2",
    concentration: "250 cps/uL",
    target: "CT",
    seed: 31,
  },
  {
    experiment: "20251010_LOD_Verification_Panel",
    run: "Run 3",
    concentration: "100 cps/uL",
    target: "CT",
    seed: 32,
  },
  {
    experiment: "20251010_LOD_Verification_Panel",
    run: "Run 4",
    concentration: "50 cps/uL",
    target: "CT",
    seed: 33,
  },
  {
    experiment: "20251010_LOD_Verification_Panel",
    run: "Run 5",
    concentration: "25 cps/uL",
    target: "CT",
    seed: 34,
  },
  {
    experiment: "20251018_Cross_Reactivity_Testing",
    run: "Run 1",
    concentration: "1e5 cps/uL",
    target: "NG",
    seed: 35,
  },
  {
    experiment: "20251018_Cross_Reactivity_Testing",
    run: "Run 2",
    concentration: "5e4 cps/uL",
    target: "NG",
    seed: 36,
  },
  {
    experiment: "20251018_Cross_Reactivity_Testing",
    run: "Run 3",
    concentration: "1e4 cps/uL",
    target: "NG",
    seed: 37,
  },
];

export default function AnalysisPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<AnalysisFilterOptions>({
    targets: [],
    ingredients: [],
    editedBefore: undefined,
    editedAfter: undefined,
  });

  // Calculate available filter options with counts
  const availableTargets = useMemo(() => {
    const targetCounts = new Map<string, number>();
    analysisData.forEach((item) => {
      targetCounts.set(item.target, (targetCounts.get(item.target) || 0) + 1);
    });
    return Array.from(targetCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  // Get all ingredients from the database with mock counts
  // In a real implementation, these counts would come from actual experiment usage
  const availableIngredients = useMemo(() => {
    const allIngredients: Array<{ name: string; count: number }> = [];
    
    // Add all buffers with fixed mock count
    buffers.forEach((buffer) => {
      allIngredients.push({ name: buffer.name, count: 12 });
    });
    
    // Add all enzymes
    enzymes.forEach((enzyme) => {
      allIngredients.push({ name: enzyme.name, count: 15 });
    });
    
    // Add all oligonucleotides
    oligonucleotides.forEach((oligo) => {
      allIngredients.push({ name: oligo.name, count: 8 });
    });
    
    // Add all preservatives
    preservatives.forEach((preservative) => {
      allIngredients.push({ name: preservative.name, count: 10 });
    });
    
    // Add all primer probe pairs
    primerProbePairs.forEach((pair) => {
      allIngredients.push({ name: pair.name, count: 14 });
    });
    
    // Add all protocols
    protocols.forEach((protocol) => {
      allIngredients.push({ name: protocol.name, count: 11 });
    });
    
    // Add all salts
    salts.forEach((salt) => {
      allIngredients.push({ name: salt.name, count: 13 });
    });
    
    // Add all stabilizers
    stabilizers.forEach((stabilizer) => {
      allIngredients.push({ name: stabilizer.name, count: 9 });
    });
    
    // Add all thermocyclers
    thermocyclers.forEach((thermocycler) => {
      allIngredients.push({ name: thermocycler.name, count: 16 });
    });
    
    // Sort alphabetically
    return allIngredients.sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  // Filter logic
  const filteredData = useMemo(() => {
    let result = [...analysisData];

    // Apply target filter
    if (filters.targets.length > 0) {
      result = result.filter((item) => filters.targets.includes(item.target));
    }

    // Ingredient filters would be applied here if we had that data in analysisData
    // For now, they're placeholders for the UI

    return result;
  }, [filters]);

  const activeFiltersCount =
    filters.targets.length +
    filters.ingredients.length +
    (filters.editedBefore ? 1 : 0) +
    (filters.editedAfter ? 1 : 0);

  const removeTargetFilter = (target: string) => {
    setFilters({
      ...filters,
      targets: filters.targets.filter((t) => t !== target),
    });
  };

  const removeIngredientFilter = (ingredient: string) => {
    setFilters({
      ...filters,
      ingredients: filters.ingredients.filter((i) => i !== ingredient),
    });
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
                <span className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Ingredients
                </span>
              </Link>
              <span className="text-sm font-medium text-foreground">
                Analysis
              </span>
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
          <div className="flex items-center gap-2">
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
            {filters.targets.map((target) => (
              <Badge
                key={target}
                variant="default"
                className="gap-1 cursor-pointer hover:bg-primary/90"
                onClick={() => removeTargetFilter(target)}
              >
                <X className="w-3 h-3" />
                {target}
              </Badge>
            ))}
            {filters.ingredients.map((ingredient) => (
              <Badge
                key={ingredient}
                variant="default"
                className="gap-1 cursor-pointer hover:bg-primary/90"
                onClick={() => removeIngredientFilter(ingredient)}
              >
                <X className="w-3 h-3" />
                {ingredient}
              </Badge>
            ))}
          </div>
          <Tooltip content="Not Yet Built" side="bottom">
            <Button variant="outline" size="sm">
              Fluorescence Curves
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </Tooltip>
        </div>

        {/* Results count */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredData.length} of {analysisData.length} results
          </p>
        </div>

        {/* Analysis Grid */}
        <div className="grid grid-cols-3 gap-8 mb-8">
          {filteredData.length === 0 ? (
            <div className="col-span-3 text-center py-16 text-muted-foreground">
              No results found. Try adjusting your filters.
            </div>
          ) : (
            filteredData.map((item, idx) => (
              <div key={idx} className="border border-slate-200 bg-white p-4 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {item.experiment}
                  </span>
                  <Badge variant="default">{item.run}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default">{item.concentration}</Badge>
                  <Badge variant="default">{item.target}</Badge>
                </div>
                <FluorescencePlot seed={item.seed} />
              </div>
            ))
          )}
        </div>
      </main>

      {/* Filter Panel */}
      <AnalysisFilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        availableTargets={availableTargets}
        availableIngredients={availableIngredients}
      />
    </div>
  );
}
