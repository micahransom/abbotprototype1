"use client";

import { useState } from "react";
import { IngredientSelect } from "@/components/ingredient-select";
import { getIngredientById } from "@/lib/ingredient-data";
import { Badge } from "@/components/ui/badge";

/**
 * Example component showing how to use the ingredient database with dropdowns
 */
export default function IngredientDropdownExample() {
  const [selectedBuffer, setSelectedBuffer] = useState("");
  const [selectedEnzyme, setSelectedEnzyme] = useState("");
  const [selectedOligo, setSelectedOligo] = useState("");
  const [selectedTarget, setSelectedTarget] = useState("");

  // Get full ingredient details when needed
  const bufferDetails = selectedBuffer ? getIngredientById("buffer", selectedBuffer) as any : null;
  const enzymeDetails = selectedEnzyme ? getIngredientById("enzyme", selectedEnzyme) as any : null;

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Ingredient Dropdown Examples</h1>

      {/* Buffer Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Select Buffer</label>
        <IngredientSelect
          category="buffer"
          value={selectedBuffer}
          onValueChange={setSelectedBuffer}
          placeholder="Choose a buffer..."
        />
        {bufferDetails && (
          <div className="p-4 border rounded-md bg-muted/50">
            <p className="text-sm"><strong>Name:</strong> {bufferDetails.name}</p>
            <p className="text-sm"><strong>Starting Concentration:</strong> {bufferDetails.concentration}</p>
            <p className="text-sm"><strong>pH:</strong> {bufferDetails.ph}</p>
            <p className="text-sm"><strong>Storage:</strong> {bufferDetails.storage}</p>
          </div>
        )}
      </div>

      {/* Enzyme Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Select Enzyme</label>
        <IngredientSelect
          category="enzyme"
          value={selectedEnzyme}
          onValueChange={setSelectedEnzyme}
          placeholder="Choose an enzyme..."
        />
        {enzymeDetails && (
          <div className="p-4 border rounded-md bg-muted/50">
            <p className="text-sm"><strong>Name:</strong> {enzymeDetails.name}</p>
            <p className="text-sm"><strong>Activity:</strong> {enzymeDetails.activity}</p>
            <p className="text-sm"><strong>Supplier:</strong> {enzymeDetails.supplier}</p>
          </div>
        )}
      </div>

      {/* Oligonucleotide Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Select Oligonucleotide</label>
        <IngredientSelect
          category="oligonucleotide"
          value={selectedOligo}
          onValueChange={setSelectedOligo}
          placeholder="Choose an oligonucleotide..."
        />
      </div>

      {/* Target Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Select Target</label>
        <IngredientSelect
          category="target"
          value={selectedTarget}
          onValueChange={setSelectedTarget}
          placeholder="Choose a target..."
        />
      </div>

      {/* Multiple Selections Display */}
      {(selectedBuffer || selectedEnzyme || selectedOligo || selectedTarget) && (
        <div className="p-4 border rounded-md">
          <p className="text-sm font-medium mb-2">Selected Ingredients:</p>
          <div className="flex flex-wrap gap-2">
            {selectedBuffer && <Badge variant="outline">Buffer: {getIngredientById("buffer", selectedBuffer)?.name}</Badge>}
            {selectedEnzyme && <Badge variant="outline">Enzyme: {getIngredientById("enzyme", selectedEnzyme)?.name}</Badge>}
            {selectedOligo && <Badge variant="outline">Oligo: {getIngredientById("oligonucleotide", selectedOligo)?.name}</Badge>}
            {selectedTarget && <Badge variant="outline">Target: {getIngredientById("target", selectedTarget)?.name}</Badge>}
          </div>
        </div>
      )}
    </div>
  );
}

