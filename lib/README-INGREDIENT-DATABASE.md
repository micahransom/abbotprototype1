# Ingredient Database

This directory contains a centralized database of all ingredients used throughout the prototype.

## Data File

**`ingredient-data.ts`** - Central source of truth for all ingredient data

## Structure

The database includes 10 categories with 6-33 items each:

- **Buffer** (8 items) - pH buffers and solutions
- **Enzyme** (10 items) - DNA/RNA polymerases and enzymes
- **Oligonucleotide** (33 items) - Primers and probes
- **Preservatives** (6 items) - Antimicrobial agents
- **Primer Probe Pair** (10 items) - Paired primers with probes
- **Protocol** (8 items) - Experimental procedures
- **Salt** (8 items) - Ionic compounds
- **Stabilizers** (9 items) - Protein and sample stabilizers
- **Target** (10 items) - Detection targets (viral/bacterial)
- **Thermocycler** (8 items) - PCR instruments

## Usage Examples

### Import the data

```typescript
import { 
  buffers, 
  enzymes, 
  targets,
  getIngredientsByCategory,
  getIngredientOptions,
  getIngredientNames 
} from "@/lib/ingredient-data";
```

### Get all ingredients in a category

```typescript
const allBuffers = getIngredientsByCategory("buffer");
const allEnzymes = getIngredientsByCategory("enzyme");
```

### Get dropdown options (id + name pairs)

```typescript
const bufferOptions = getIngredientOptions("buffer");
// Returns: [{ id: "1", name: "Tris-HCl pH 8.0" }, ...]
```

### Get just the names for simple dropdowns

```typescript
const bufferNames = getIngredientNames("buffer");
// Returns: ["Tris-HCl pH 8.0", "PBS pH 7.4", ...]
```

### Find specific ingredient by ID

```typescript
import { getIngredientById } from "@/lib/ingredient-data";

const buffer = getIngredientById("buffer", "1");
// Returns: { id: "1", name: "Tris-HCl pH 8.0", ... }
```

### Search ingredients

```typescript
import { searchIngredients } from "@/lib/ingredient-data";

const results = searchIngredients("buffer", "tris");
// Returns all buffers containing "tris" in the name
```

## Dropdown Component

Use the provided `IngredientSelect` component:

```typescript
import { IngredientSelect } from "@/components/ingredient-select";

// In your component
const [selectedBuffer, setSelectedBuffer] = useState("");

<IngredientSelect
  category="buffer"
  value={selectedBuffer}
  onValueChange={setSelectedBuffer}
  placeholder="Select a buffer..."
/>
```

## Available Categories

```typescript
type IngredientCategory = 
  | "buffer" 
  | "enzyme" 
  | "oligonucleotide" 
  | "preservatives" 
  | "primer-probe-pair" 
  | "protocol" 
  | "salt" 
  | "stabilizers" 
  | "target" 
  | "thermocycler";
```

## Adding New Ingredients

To add new ingredients, edit `lib/ingredient-data.ts` and add entries to the appropriate array:

```typescript
export const buffers: Buffer[] = [
  // ... existing buffers
  { 
    id: "9", 
    name: "New Buffer", 
    concentration: "50 mM", 
    ph: "7.0", 
    storage: "4°C", 
    lastEdited: "September 1, 2025" 
  },
];
```

The data will automatically propagate to:
- Listing pages
- Detail pages
- All dropdowns throughout the app

