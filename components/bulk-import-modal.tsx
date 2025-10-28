"use client";

import { useState, useRef, KeyboardEvent, ClipboardEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BulkImportRow {
  id: string;
  [key: string]: string;
}

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: BulkImportRow[]) => void;
  columns: {
    key: string;
    label: string;
  }[];
}

export function BulkImportModal({
  isOpen,
  onClose,
  onImport,
  columns,
}: BulkImportModalProps) {
  const createEmptyRow = (index: number): BulkImportRow => {
    const row: BulkImportRow = { id: `row-${index}` };
    columns.forEach((col) => {
      row[col.key] = "";
    });
    return row;
  };

  const [rows, setRows] = useState<BulkImportRow[]>(() => {
    // Initialize with 13 empty rows
    const initialRows: BulkImportRow[] = [];
    for (let i = 0; i < 13; i++) {
      initialRows.push(createEmptyRow(i));
    }
    return initialRows;
  });

  const tableRef = useRef<HTMLTableElement>(null);

  if (!isOpen) return null;

  const handleCellChange = (rowIndex: number, field: string, value: string) => {
    const newRows = [...rows];
    newRows[rowIndex] = { ...newRows[rowIndex], [field]: value };
    setRows(newRows);

    // Add a new row if the last row is being edited
    if (rowIndex === rows.length - 1 && value.trim() !== "") {
      setRows([...newRows, createEmptyRow(rows.length)]);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>, rowIndex: number, colIndex: number) => {
    e.preventDefault();
    
    const pastedText = e.clipboardData.getData("text");
    const pastedRows = pastedText.split("\n").filter(row => row.trim() !== "");
    
    const newRows = [...rows];
    
    pastedRows.forEach((pastedRow, pasteRowOffset) => {
      const cells = pastedRow.split("\t");
      const targetRowIndex = rowIndex + pasteRowOffset;
      
      // Ensure we have enough rows
      while (targetRowIndex >= newRows.length) {
        newRows.push({
          id: `row-${newRows.length}`,
          assayTitle: "",
          primer1: "",
          primer2: "",
          probe: "",
        });
      }
      
      // Fill cells starting from the current column
      cells.forEach((cell, cellOffset) => {
        const targetColIndex = colIndex + cellOffset;
        if (targetColIndex < columns.length) {
          const field = columns[targetColIndex].key;
          newRows[targetRowIndex] = {
            ...newRows[targetRowIndex],
            [field]: cell.trim(),
          };
        }
      });
    });
    
    setRows(newRows);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, rowIndex: number, colIndex: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Move to next row, same column
      const nextRow = rowIndex + 1;
      if (nextRow < rows.length) {
        const input = document.querySelector(
          `input[data-row="${nextRow}"][data-col="${colIndex}"]`
        ) as HTMLInputElement;
        input?.focus();
      }
    } else if (e.key === "Tab") {
      // Default behavior is fine for Tab
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextRow = rowIndex + 1;
      if (nextRow < rows.length) {
        const input = document.querySelector(
          `input[data-row="${nextRow}"][data-col="${colIndex}"]`
        ) as HTMLInputElement;
        input?.focus();
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevRow = rowIndex - 1;
      if (prevRow >= 0) {
        const input = document.querySelector(
          `input[data-row="${prevRow}"][data-col="${colIndex}"]`
        ) as HTMLInputElement;
        input?.focus();
      }
    }
  };

  const handleImport = () => {
    // Filter out empty rows (rows where all column values are empty)
    const nonEmptyRows = rows.filter((row) => {
      return columns.some((col) => row[col.key]?.trim() !== "");
    });
    onImport(nonEmptyRows);
    onClose();
  };

  const handleCancel = () => {
    // Reset rows
    const emptyRows: BulkImportRow[] = [];
    for (let i = 0; i < 13; i++) {
      emptyRows.push(createEmptyRow(i));
    }
    setRows(emptyRows);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/25"
        onClick={handleCancel}
      />
      
      {/* Modal */}
      <div className="relative bg-white border border-border rounded-xl w-[966px] h-[800px] flex flex-col shadow-lg">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-6 shrink-0">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-base font-semibold text-card-foreground">Enter Data</h2>
            <p className="text-sm text-muted-foreground">Copy paste from Excel</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleImport}>
              Import
            </Button>
          </div>
        </div>

        {/* Table Container */}
        <div className="flex-1 overflow-auto px-6 pb-6">
          <div className="border rounded-lg bg-white">
            <Table ref={tableRef}>
              <TableHeader>
                <TableRow className="bg-white border-t">
                  {columns.map((col) => (
                    <TableHead
                      key={col.key}
                      className="text-sm font-medium text-muted-foreground h-10"
                    >
                      {col.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, rowIndex) => (
                  <TableRow key={row.id} className="h-[52px]">
                    {columns.map((col, colIndex) => (
                      <TableCell key={col.key} className="p-2">
                        <input
                          type="text"
                          value={row[col.key] as string}
                          onChange={(e) =>
                            handleCellChange(rowIndex, col.key, e.target.value)
                          }
                          onPaste={(e) => handlePaste(e, rowIndex, colIndex)}
                          onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                          data-row={rowIndex}
                          data-col={colIndex}
                          className="w-full h-full text-sm text-foreground bg-transparent border-none outline-none focus:outline-none px-1"
                          placeholder=""
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

