"use client";

import { GraphAnalytics } from "./GraphAnalytics";

interface SidebarProps {
  nodes: any[];
  edges: any[];
  onAddNode: () => void;
  onImportCSV: () => void;
  onExportJSON: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function Sidebar({
  nodes,
  edges,
  onAddNode,
  onImportCSV,
  onExportJSON,
  searchTerm,
  onSearchChange,
}: SidebarProps) {
  return (
    <div className="w-80 h-full border-r bg-card/50 backdrop-blur supports-backdrop-filter:bg-background/60 flex flex-col shadow-sm">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg tracking-tight mb-4">Controls</h2>
        
        <div className="flex flex-col gap-2">
          <button
            onClick={onAddNode}
            className="w-full justify-start bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow"
          >
            Add Node
          </button>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onImportCSV}
              className="border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring shadow-sm"
            >
              Import CSV
            </button>
            <button
              onClick={onExportJSON}
              className="border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring shadow-sm"
            >
              Export JSON
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 border-b">
        <label className="text-sm font-medium leading-none mb-2 block">
          Search / Highlight
        </label>
        <input
          type="text"
          placeholder="Search nodes by title..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        <GraphAnalytics nodes={nodes} edges={edges} />
      </div>
    </div>
  );
}
