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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-[420px] max-w-full m-4">
        <h2 className="text-xl font-semibold mb-4 text-slate-800">
          Import from CSV
        </h2>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nodes CSV{" "}
              <span className="text-slate-400">(id, title, note)</span>
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setNodesFile(e.target.files?.[0] || null)}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm file:mr-3 file:border-0 file:bg-slate-100 file:px-3 file:py-1 file:rounded file:text-sm file:cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Edges CSV{" "}
              <span className="text-slate-400">(source, target, label)</span>
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setEdgesFile(e.target.files?.[0] || null)}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm file:mr-3 file:border-0 file:bg-slate-100 file:px-3 file:py-1 file:rounded file:text-sm file:cursor-pointer"
            />
          </div>

          {error && (
            <p className="text-red-600 text-xs bg-red-50 border border-red-200 px-3 py-2 rounded">
              {error}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            className="px-4 py-2 bg-blue-600 border border-blue-600 rounded text-white hover:bg-blue-700 text-sm transition-colors"
          >
            Import
          </button>
        </div>
      </div>
    </div>
  );
}
