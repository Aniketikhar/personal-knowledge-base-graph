"use client";

import { useState } from "react";

interface AddNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingNodes: any[];
  onAdd: (node: any, edge?: any) => void;
}

export default function AddNodeModal({
  isOpen,
  onClose,
  existingNodes,
  onAdd,
}: AddNodeModalProps) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [linkTargetId, setLinkTargetId] = useState("");
  const [edgeLabel, setEdgeLabel] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newNodeId = Date.now().toString();
    const newNode = {
      id: newNodeId,
      type: "default",
      data: { label: title, note },
      position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
    };

    let newEdge: any = undefined;
    if (linkTargetId) {
      newEdge = {
        id: `e-${linkTargetId}-${newNodeId}`,
        source: linkTargetId,
        target: newNodeId,
      };
      if (edgeLabel.trim()) newEdge.label = edgeLabel.trim();
    }

    onAdd(newNode, newEdge);
    setTitle("");
    setNote("");
    setLinkTargetId("");
    setEdgeLabel("");
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card text-card-foreground border border-border p-6 rounded-xl shadow-xl w-96 max-w-full">
        <h2 className="text-xl font-semibold mb-4 tracking-tight">
          Add New Node
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Title <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="e.g. React Concepts"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Note / Description
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Optional details..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Link to existing node (Optional)
            </label>
            <select
              value={linkTargetId}
              onChange={(e) => setLinkTargetId(e.target.value)}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">-- None --</option>
              {existingNodes.map((n: any) => (
                <option key={n.id} value={n.id}>
                  {n.data.label || n.id}
                </option>
              ))}
            </select>
          </div>
          {linkTargetId && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
              <label className="block text-sm font-medium mb-1.5">
                Edge Label <span className="text-muted-foreground font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={edgeLabel}
                onChange={(e) => setEdgeLabel(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="e.g. belongs to, depends on..."
              />
            </div>
          )}
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Save Node
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
