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
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card text-card-foreground border border-border p-6 rounded-xl shadow-xl w-[450px] max-w-full m-4">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold tracking-tight">Edit Node</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
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
            <label className="block text-sm font-medium mb-1.5">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Note / Description
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => onDelete(node.id)}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2"
          >
            Delete Node
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => onSave(node.id, title, note)}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
