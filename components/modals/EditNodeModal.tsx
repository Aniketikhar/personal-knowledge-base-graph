"use client";

import { useState, useEffect } from "react";

interface EditNodeModalProps {
  node: any | null;
  onClose: () => void;
  onSave: (id: string, label: string, note: string) => void;
  onDelete: (id: string) => void;
}

export default function EditNodeModal({
  node,
  onClose,
  onSave,
  onDelete,
}: EditNodeModalProps) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (node) {
      setTitle(node.data.label || "");
      setNote(node.data.note || "");
    }
  }, [node]);

  if (!node) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-[450px] max-w-full m-4">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold text-slate-800">Edit Node</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Note / Description
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm max-h-48 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => onDelete(node.id)}
            className="px-4 py-2 border border-red-200 text-red-600 bg-red-50 rounded hover:bg-red-100 text-sm transition-colors"
          >
            Delete Node
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => onSave(node.id, title, note)}
              className="px-4 py-2 bg-blue-600 border border-blue-600 rounded text-white hover:bg-blue-700 text-sm transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
