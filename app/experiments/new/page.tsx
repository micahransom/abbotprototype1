"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { History, Download, Upload, Save, CircleUser, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TagInput } from "@/components/ui/tag-input";
import { Tooltip } from "@/components/ui/tooltip";
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

type TabType = "conditions" | "test-tracking" | "visualizations";

interface Tag {
  id: string;
  label: string;
  count?: number;
}

interface TableRowData {
  id: string;
  ingredients: Tag[];
  concentration: string;
  unit: string;
  lotNumber: string;
}

const concentrationUnits = ["X", "mM", "%", "ng", "μM", "mg/mL", "μg/mL"];

export default function NewExperimentPage() {
  const [activeTab, setActiveTab] = useState<TabType>("conditions");
  
  // Editable title and objective
  const [experimentTitle, setExperimentTitle] = useState("New Experiment");
  const [objective, setObjective] = useState("Add objective...");
  
  // Counter for generating unique row IDs
  const rowIdCounter = useRef(100);
  
  // Generate ingredient suggestions from all categories
  const ingredientSuggestions = useMemo(() => {
    const allIngredients: Tag[] = [];
    
    // Add all buffers
    buffers.forEach(item => {
      allIngredients.push({ id: `buffer-${item.id}`, label: item.name });
    });
    
    // Add all enzymes
    enzymes.forEach(item => {
      allIngredients.push({ id: `enzyme-${item.id}`, label: item.name });
    });
    
    // Add all oligonucleotides
    oligonucleotides.forEach(item => {
      allIngredients.push({ id: `oligo-${item.id}`, label: item.name });
    });
    
    // Add all preservatives
    preservatives.forEach(item => {
      allIngredients.push({ id: `preservative-${item.id}`, label: item.name });
    });
    
    // Add all primer probe pairs
    primerProbePairs.forEach(item => {
      allIngredients.push({ id: `ppp-${item.id}`, label: item.name });
    });
    
    // Add all protocols
    protocols.forEach(item => {
      allIngredients.push({ id: `protocol-${item.id}`, label: item.name });
    });
    
    // Add all salts
    salts.forEach(item => {
      allIngredients.push({ id: `salt-${item.id}`, label: item.name });
    });
    
    // Add all stabilizers
    stabilizers.forEach(item => {
      allIngredients.push({ id: `stabilizer-${item.id}`, label: item.name });
    });
    
    // Add all targets
    targets.forEach(item => {
      allIngredients.push({ id: `target-${item.id}`, label: item.name });
    });
    
    // Add all thermocyclers
    thermocyclers.forEach(item => {
      allIngredients.push({ id: `thermocycler-${item.id}`, label: `${item.name} (${item.serial})` });
    });
    
    // Sort alphabetically by label
    return allIngredients.sort((a, b) => a.label.localeCompare(b.label));
  }, []);
  
  // Table data for Cartridge
  const [cartridgeRows, setCartridgeRows] = useState<TableRowData[]>([
    { id: "cart-1", ingredients: [], concentration: "", unit: "mM", lotNumber: "" },
    { id: "cart-2", ingredients: [], concentration: "", unit: "mM", lotNumber: "" },
    { id: "cart-3", ingredients: [], concentration: "", unit: "mM", lotNumber: "" },
  ]);

  // Table data for Sample Prep
  const [samplePrepRows, setSamplePrepRows] = useState<TableRowData[]>([
    { id: "prep-1", ingredients: [], concentration: "", unit: "mM", lotNumber: "" },
    { id: "prep-2", ingredients: [], concentration: "", unit: "mM", lotNumber: "" },
    { id: "prep-3", ingredients: [], concentration: "", unit: "mM", lotNumber: "" },
  ]);

  // Track which unit dropdown is open
  const [openUnitDropdown, setOpenUnitDropdown] = useState<string | null>(null);

  // Helper function to check if a row is empty
  const isRowEmpty = (row: TableRowData) => {
    return row.ingredients.length === 0 && row.concentration === "" && row.lotNumber === "";
  };

  // Helper function to add a new row if the last row has data
  const addNewRowIfNeeded = (section: 'cartridge' | 'samplePrep', rows: TableRowData[]) => {
    const lastRow = rows[rows.length - 1];
    if (!isRowEmpty(lastRow)) {
      rowIdCounter.current += 1;
      const newId = section === 'cartridge' 
        ? `cart-${rowIdCounter.current}` 
        : `prep-${rowIdCounter.current}`;
      return [...rows, { id: newId, ingredients: [], concentration: "", unit: "mM", lotNumber: "" }];
    }
    return rows;
  };

  const updateRowIngredients = (section: 'cartridge' | 'samplePrep', rowId: string, tags: Tag[]) => {
    if (section === 'cartridge') {
      setCartridgeRows(rows => {
        const updatedRows = rows.map(row =>
          row.id === rowId ? { ...row, ingredients: tags } : row
        );
        return addNewRowIfNeeded(section, updatedRows);
      });
    } else {
      setSamplePrepRows(rows => {
        const updatedRows = rows.map(row =>
          row.id === rowId ? { ...row, ingredients: tags } : row
        );
        return addNewRowIfNeeded(section, updatedRows);
      });
    }
  };

  const updateRowConcentration = (section: 'cartridge' | 'samplePrep', rowId: string, concentration: string) => {
    if (section === 'cartridge') {
      setCartridgeRows(rows => {
        const updatedRows = rows.map(row =>
          row.id === rowId ? { ...row, concentration } : row
        );
        return addNewRowIfNeeded(section, updatedRows);
      });
    } else {
      setSamplePrepRows(rows => {
        const updatedRows = rows.map(row =>
          row.id === rowId ? { ...row, concentration } : row
        );
        return addNewRowIfNeeded(section, updatedRows);
      });
    }
  };

  const updateRowUnit = (section: 'cartridge' | 'samplePrep', rowId: string, unit: string) => {
    if (section === 'cartridge') {
      setCartridgeRows(rows => {
        const updatedRows = rows.map(row =>
          row.id === rowId ? { ...row, unit } : row
        );
        return addNewRowIfNeeded(section, updatedRows);
      });
    } else {
      setSamplePrepRows(rows => {
        const updatedRows = rows.map(row =>
          row.id === rowId ? { ...row, unit } : row
        );
        return addNewRowIfNeeded(section, updatedRows);
      });
    }
    setOpenUnitDropdown(null);
  };

  const updateRowLotNumber = (section: 'cartridge' | 'samplePrep', rowId: string, lotNumber: string) => {
    if (section === 'cartridge') {
      setCartridgeRows(rows => {
        const updatedRows = rows.map(row =>
          row.id === rowId ? { ...row, lotNumber } : row
        );
        return addNewRowIfNeeded(section, updatedRows);
      });
    } else {
      setSamplePrepRows(rows => {
        const updatedRows = rows.map(row =>
          row.id === rowId ? { ...row, lotNumber } : row
        );
        return addNewRowIfNeeded(section, updatedRows);
      });
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (openUnitDropdown) {
        setOpenUnitDropdown(null);
      }
    };

    if (openUnitDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openUnitDropdown]);
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
                <span className="text-sm font-medium text-foreground">
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

      {/* Breadcrumb */}
      <div className="border-b border-border bg-background px-6 py-4">
        <div className="flex items-center gap-2 text-sm font-medium flex-wrap">
          <Link href="/experiments" className="text-muted-foreground hover:text-foreground">
            Experiments
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground break-words">New Experiment</span>
        </div>
      </div>

      <div className="h-px bg-border" />

      {/* Main Content */}
      <main className="bg-background flex flex-col items-center px-8 py-16 gap-8">
        <div className="flex flex-col gap-6 w-[600px]">
          {/* Header Section */}
          <div className="flex flex-col gap-6">
            {/* Action Buttons Row */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Tooltip content="Not Yet Built" side="bottom">
                  <Button variant="outline" size="sm">
                    <History className="w-4 h-4" />
                  </Button>
                </Tooltip>
                <Tooltip content="Not Yet Built" side="bottom">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </Tooltip>
              </div>
              <div className="flex gap-2">
                <Tooltip content="Not Yet Built" side="bottom">
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Import Experiment
                  </Button>
                </Tooltip>
                <Tooltip content="Not Yet Built" side="bottom">
                  <Button variant="outline" size="sm">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </Tooltip>
              </div>
            </div>

            {/* Title - Editable */}
            <input
              type="text"
              value={experimentTitle}
              onChange={(e) => setExperimentTitle(e.target.value)}
              className="text-5xl font-bold text-accent-foreground leading-tight bg-transparent border-none outline-none focus:ring-0 p-0 w-full break-words"
            />

            {/* Objective - Editable */}
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                onFocus={(e) => {
                  if (e.target.value === "Add objective...") {
                    setObjective("");
                  }
                }}
                onBlur={(e) => {
                  if (e.target.value === "") {
                    setObjective("Add objective...");
                  }
                }}
                className="text-base text-foreground bg-transparent border-none outline-none focus:ring-0 p-0 w-full placeholder:text-foreground"
                placeholder="Add objective..."
              />
            </div>

            {/* Meta Information Table */}
            <div className="flex items-center">
              <div className="flex-1 overflow-clip px-px">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col w-32">
                    <div className="flex items-center py-2">
                      <p className="text-base text-muted-foreground">Last edited by</p>
                    </div>
                    <div className="flex items-center py-2">
                      <p className="text-base text-muted-foreground">Last edited time</p>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center gap-2 h-10 p-2 min-w-[85px]">
                      <p className="text-sm text-muted-foreground">—</p>
                    </div>
                    <div className="flex items-center h-10 p-2 min-w-[85px]">
                      <p className="text-sm text-muted-foreground">—</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-muted p-[3px] rounded-lg flex h-9">
              <button 
                onClick={() => setActiveTab("conditions")}
                className={`flex-1 rounded-md px-2 py-1 flex items-center justify-center ${
                  activeTab === "conditions" ? "bg-background border border-transparent" : ""
                }`}
              >
                <span className="text-sm font-medium text-foreground text-center">Conditions</span>
              </button>
              <button 
                onClick={() => setActiveTab("test-tracking")}
                className={`flex-1 rounded-md px-2 py-1 flex items-center justify-center ${
                  activeTab === "test-tracking" ? "bg-background border border-transparent" : ""
                }`}
              >
                <span className="text-sm font-medium text-foreground text-center">Test Tracking</span>
              </button>
              <button 
                onClick={() => setActiveTab("visualizations")}
                className={`flex-1 rounded-md px-2 py-1 flex items-center justify-center ${
                  activeTab === "visualizations" ? "bg-background border border-transparent" : ""
                }`}
              >
                <span className="text-sm font-medium text-foreground text-center">Visualizations</span>
              </button>
            </div>
          </div>

          {/* Conditions Tab Content */}
          {activeTab === "conditions" && (
          <>
          <div className="flex flex-col gap-6">
            <div className="border-b border-border pb-2 pt-4">
              <h2 className="text-3xl font-semibold text-foreground">Conditions</h2>
            </div>

            <div className="flex items-center">
              <div className="flex-1 overflow-clip px-px">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1 w-[150px]">
                    <div className="flex items-center py-2">
                      <p className="text-base text-muted-foreground">Instrument</p>
                    </div>
                    <div className="flex items-center py-2">
                      <p className="text-base text-muted-foreground">Operators</p>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex items-center gap-2 h-10 p-2 min-w-[85px]">
                      <p className="text-sm text-muted-foreground">—</p>
                    </div>
                    <div className="flex items-center gap-2 h-10 p-2 min-w-[85px]">
                      <p className="text-sm text-muted-foreground">—</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cartridge Section */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between h-10">
              <h3 className="text-2xl font-semibold text-foreground pt-2">Cartridge</h3>
            </div>

            <div className="bg-white border rounded-lg w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[280px]">Ingredient Name</TableHead>
                    <TableHead className="w-[240px]">Final Concentration</TableHead>
                    <TableHead className="w-[200px]">Lot Number (optional)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cartridgeRows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="w-[280px] align-top">
                        <TagInput
                          suggestions={ingredientSuggestions}
                          selectedTags={row.ingredients}
                          onTagsChange={(tags) => updateRowIngredients('cartridge', row.id, tags)}
                          placeholder="Type ingredient..."
                          allowCreate={true}
                        />
                      </TableCell>
                      <TableCell className="w-[240px] align-top">
                        <div className="flex items-center justify-between gap-2 py-0.5">
                          <input
                            type="text"
                            value={row.concentration}
                            onChange={(e) => updateRowConcentration('cartridge', row.id, e.target.value)}
                            placeholder="0"
                            className="flex-1 min-w-0 text-sm text-foreground bg-transparent border-none outline-none focus:outline-none"
                          />
                          <div className="relative">
                            <button
                              onClick={() => setOpenUnitDropdown(openUnitDropdown === row.id ? null : row.id)}
                              className="flex items-center gap-1 px-2 py-0.5 text-xs font-semibold text-secondary-foreground bg-secondary border border-transparent rounded-md hover:bg-secondary/80 transition-colors"
                            >
                              {row.unit}
                              <ChevronDown className="w-3 h-3" />
                            </button>
                            {openUnitDropdown === row.id && (
                              <div className="absolute right-0 top-full mt-1 z-10 min-w-[80px] bg-popover border border-border rounded-md shadow-md overflow-hidden">
                                {concentrationUnits.map((unit) => (
                                  <button
                                    key={unit}
                                    onClick={() => updateRowUnit('cartridge', row.id, unit)}
                                    className="w-full px-3 py-2 text-xs text-left hover:bg-accent hover:text-accent-foreground transition-colors"
                                  >
                                    {unit}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="w-[200px] align-top">
                        <input
                          type="text"
                          value={row.lotNumber}
                          onChange={(e) => updateRowLotNumber('cartridge', row.id, e.target.value)}
                          placeholder="Optional..."
                          className="w-full text-sm text-foreground bg-transparent border-none outline-none focus:outline-none py-0.5"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Sample Prep Section */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-foreground pt-2">Sample Prep</h3>
            </div>

            <div className="bg-white border rounded-lg w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[280px]">Ingredient Name</TableHead>
                    <TableHead className="w-[240px]">Final Concentration</TableHead>
                    <TableHead className="w-[200px]">Lot Number (optional)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {samplePrepRows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="w-[280px] align-top">
                        <TagInput
                          suggestions={ingredientSuggestions}
                          selectedTags={row.ingredients}
                          onTagsChange={(tags) => updateRowIngredients('samplePrep', row.id, tags)}
                          placeholder="Type ingredient..."
                          allowCreate={true}
                        />
                      </TableCell>
                      <TableCell className="w-[240px] align-top">
                        <div className="flex items-center justify-between gap-2 py-0.5">
                          <input
                            type="text"
                            value={row.concentration}
                            onChange={(e) => updateRowConcentration('samplePrep', row.id, e.target.value)}
                            placeholder="0"
                            className="flex-1 min-w-0 text-sm text-foreground bg-transparent border-none outline-none focus:outline-none"
                          />
                          <div className="relative">
                            <button
                              onClick={() => setOpenUnitDropdown(openUnitDropdown === row.id ? null : row.id)}
                              className="flex items-center gap-1 px-2 py-0.5 text-xs font-semibold text-secondary-foreground bg-secondary border border-transparent rounded-md hover:bg-secondary/80 transition-colors"
                            >
                              {row.unit}
                              <ChevronDown className="w-3 h-3" />
                            </button>
                            {openUnitDropdown === row.id && (
                              <div className="absolute right-0 top-full mt-1 z-10 min-w-[80px] bg-popover border border-border rounded-md shadow-md overflow-hidden">
                                {concentrationUnits.map((unit) => (
                                  <button
                                    key={unit}
                                    onClick={() => updateRowUnit('samplePrep', row.id, unit)}
                                    className="w-full px-3 py-2 text-xs text-left hover:bg-accent hover:text-accent-foreground transition-colors"
                                  >
                                    {unit}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="w-[200px] align-top">
                        <input
                          type="text"
                          value={row.lotNumber}
                          onChange={(e) => updateRowLotNumber('samplePrep', row.id, e.target.value)}
                          placeholder="Optional..."
                          className="w-full text-sm text-foreground bg-transparent border-none outline-none focus:outline-none py-0.5"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Attachments Section */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-foreground pt-2">Attachments</h3>
              <Button variant="outline" size="sm">
                Upload
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">No attachments yet.</p>
          </div>
          </>
          )}

          {/* Test Tracking Tab Content */}
          {activeTab === "test-tracking" && (
          <>
            <div className="flex flex-col gap-6">
              <div className="border-b border-border pb-2 pt-4">
                <h2 className="text-3xl font-semibold text-foreground">Test Tracking Table</h2>
              </div>
            </div>
          </>
          )}

          {/* Visualizations Tab Content */}
          {activeTab === "visualizations" && (
          <>
            <div className="flex flex-col gap-6">
              <div className="border-b border-border pb-2 pt-2">
                <h2 className="text-3xl font-semibold text-foreground">Visualizations</h2>
              </div>
            </div>
          </>
          )}
        </div>

        {/* Test Tracking Table - Full Width Section */}
        {activeTab === "test-tracking" && (
          <div className="w-full px-8 flex flex-col gap-8">
            {/* Action Buttons */}
            <div className="flex items-center justify-between w-full">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>

            {/* Test Tracking Table */}
            <div className="bg-white border rounded-lg overflow-x-auto w-full">
              <Table>
                <TableHeader>
                  <TableRow className="bg-accent">
                    <TableHead className="text-center font-medium text-foreground">Test Date</TableHead>
                    <TableHead className="text-center font-medium text-foreground">Sample ID</TableHead>
                    <TableHead className="text-center font-medium text-foreground">Sample Description</TableHead>
                    <TableHead className="text-center font-medium text-foreground">Cartridge Lot #</TableHead>
                    <TableHead className="text-center font-medium text-foreground">PCR MM Lyo Lot #</TableHead>
                    <TableHead className="text-center font-medium text-foreground">IC Lot #</TableHead>
                    <TableHead className="text-center font-medium text-foreground">XML</TableHead>
                    <TableHead className="text-center font-medium text-foreground">Pass through filter</TableHead>
                    <TableHead className="text-center font-medium text-foreground">Load Volume (uL)</TableHead>
                    <TableHead className="text-center font-medium text-foreground">Instrument Serial #</TableHead>
                    <TableHead className="text-center font-medium text-foreground">Target Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Files Section */}
            <div className="flex flex-col gap-6 mt-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold text-foreground pt-2">Files</h3>
                <Button variant="outline" size="sm">
                  Upload
                </Button>
              </div>

              {/* Files Table */}
              <div className="bg-white border rounded-lg overflow-x-auto w-full">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-accent">
                      <TableHead className="font-medium text-foreground">File</TableHead>
                      <TableHead className="text-center font-medium text-foreground">Category</TableHead>
                      <TableHead className="text-center font-medium text-foreground">Sample ID</TableHead>
                      <TableHead className="text-center font-medium text-foreground">Cleaned</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}

        {/* Test Tracking Attachments - Centered */}
        {activeTab === "test-tracking" && (
          <div className="w-[600px]">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold text-foreground pt-2">Attachments</h3>
                <Button variant="outline" size="sm">
                  Upload
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">No attachments yet.</p>
            </div>
          </div>
        )}

        {/* Visualizations - Full Width Section */}
        {activeTab === "visualizations" && (
          <div className="w-full px-8 flex flex-col gap-8">
            {/* Filter Section */}
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <span className="text-xs">Filter</span>
                </Button>
              </div>
              <select className="text-xs border border-input rounded-md px-3 py-2 h-9 bg-background">
                <option>Fluorescence Curves</option>
              </select>
            </div>

            {/* Empty visualization message */}
            <div className="w-full py-16 flex items-center justify-center">
              <p className="text-muted-foreground">No visualizations available yet.</p>
            </div>
          </div>
        )}

        {/* Visualizations Attachments - Centered */}
        {activeTab === "visualizations" && (
          <div className="w-[600px]">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold text-foreground pt-2">Attachments</h3>
                <Button variant="outline" size="sm">
                  Upload
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">No attachments yet.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
