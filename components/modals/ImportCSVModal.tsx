"use client";

import { useState } from "react";
import { parseCSV } from "@/lib/parseCSV";

interface ImportCSVModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (nodes: any[], edges: any[]) => void;
}

export default function ImportCSVModal({
  isOpen,
  onClose,
  onImport,
}: ImportCSVModalProps) {
  const [nodesFile, setNodesFile] = useState<File | null>(null);
  const [edgesFile, setEdgesFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleImport = async () => {
    if (!nodesFile || !edgesFile) {
      setError("Please select both nodes.csv and edges.csv files.");
      return;
    }

    try {
      const nodesText = await nodesFile.text();
      const edgesText = await edgesFile.text();

      const nodesData = parseCSV(nodesText);
      const edgesData = parseCSV(edgesText);

      if (nodesData.length === 0) {
        setError(
          "nodes.csv is empty or has an invalid format. Expected columns: id, title, note",
        );
        return;
      }
      if (!nodesData[0].id || !nodesData[0].title) {
        setError("nodes.csv must have 'id' and 'title' columns.");
        return;
      }
      if (
        edgesData.length > 0 &&
        (!edgesData[0].source || !edgesData[0].target)
      ) {
        setError("edges.csv must have 'source' and 'target' columns.");
        return;
      }

      const cols = Math.ceil(Math.sqrt(nodesData.length));
      const flowNodes = nodesData.map((row, i) => ({
        id: row.id,
        type: "default",
        data: { label: row.title, note: row.note || "" },
        position: {
          x: (i % cols) * 280 + 50,
          y: Math.floor(i / cols) * 200 + 50,
        },
      }));

      const flowEdges = edgesData.map((row, i) => {
        const edge: any = {
          id: `e-${row.source}-${row.target}-${i}`,
          source: row.source,
          target: row.target,
        };
        if (row.label) edge.label = row.label;
        return edge;
      });

      onImport(flowNodes, flowEdges);
      setNodesFile(null);
      setEdgesFile(null);
      setError("");
    } catch {
      setError("Failed to read or parse the CSV files.");
    }
  };

  const downloadSample = (type: 'nodes' | 'edges') => {
    let content = "";
    let filename = "";
    
    if (type === 'nodes') {
      content = `id,title,note
1,React,"A JavaScript library for building user interfaces using components."
2,Next.js,"React framework with SSR, routing, and API support built in."
3,TypeScript,"Typed superset of JavaScript that compiles to plain JS."
4,State Management,"Patterns for managing shared application state (Context, Zustand, Redux)."
5,Component Design,"Principles for building reusable, composable UI components."
6,Performance,"Techniques like memoization, lazy loading, and virtualization."
7,Testing,"Unit, integration, and e2e testing strategies for frontend apps."
8,CSS & Styling,"Styling approaches including Tailwind, CSS Modules, and styled-components."`;
      filename = "sample-nodes.csv";
    } else {
      content = `source,target,label
2,1,built on
1,3,pairs well with
1,4,uses
1,5,guides
2,6,improves
1,7,requires
1,8,styled with
4,6,impacts
5,6,impacts`;
      filename = "sample-edges.csv";
    }

    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card text-card-foreground border border-border p-6 rounded-xl shadow-xl w-[440px] max-w-full m-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold tracking-tight">
            Import from CSV
          </h2>
          <div className="flex gap-2">
            <button 
              onClick={() => downloadSample('nodes')}
              className="text-xs text-primary hover:text-primary/80 transition-colors underline underline-offset-2"
            >
              Sample Nodes
            </button>
            <span className="text-muted-foreground text-xs">•</span>
            <button 
              onClick={() => downloadSample('edges')}
              className="text-xs text-primary hover:text-primary/80 transition-colors underline underline-offset-2"
            >
              Sample Edges
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Nodes CSV{" "}
              <span className="text-muted-foreground font-normal">(id, title, note)</span>
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setNodesFile(e.target.files?.[0] || null)}
              className="flex w-full rounded-md border border-input bg-background text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-medium file:bg-secondary file:text-secondary-foreground hover:file:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Edges CSV{" "}
              <span className="text-muted-foreground font-normal">(source, target, label)</span>
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setEdgesFile(e.target.files?.[0] || null)}
              className="flex w-full rounded-md border border-input bg-background text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-medium file:bg-secondary file:text-secondary-foreground hover:file:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
            />
          </div>

          {error && (
            <p className="text-destructive text-sm bg-destructive/10 border border-destructive/20 px-3 py-2 rounded-md">
              {error}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Import
          </button>
        </div>
      </div>
    </div>
  );
}
