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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96 max-w-full">
        <h2 className="text-xl font-semibold mb-4 text-slate-800">
          Add New Node
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Title (Required)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. React Concepts"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Note / Description
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm max-h-32 min-h-[64px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Optional details..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Link to existing node (Optional)
            </label>
            <select
              value={linkTargetId}
              onChange={(e) => setLinkTargetId(e.target.value)}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Edge Label (Optional)
              </label>
              <input
                type="text"
                value={edgeLabel}
                onChange={(e) => setEdgeLabel(e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. belongs to, depends on..."
              />
            </div>
          )}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 border border-blue-600 rounded text-white hover:bg-blue-700 text-sm transition-colors"
            >
              Save Node
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
