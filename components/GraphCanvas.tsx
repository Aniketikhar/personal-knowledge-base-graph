"use client";

import { useState } from "react";
import ReactFlow, { Background, Controls, Panel } from "reactflow";
import "reactflow/dist/style.css";

import { nodeTypes } from "@/components/CustomNode";
import { useGraphStorage } from "@/hooks/useGraphStorage";
import ImportCSVModal from "@/components/modals/ImportCSVModal";
import AddNodeModal from "@/components/modals/AddNodeModal";
import EditNodeModal from "@/components/modals/EditNodeModal";
import EditEdgeModal from "@/components/modals/EditEdgeModal";

export default function GraphCanvas() {
  const {
    nodes,
    setNodes,
    onNodesChange,
    edges,
    setEdges,
    onEdgesChange,
    onConnect,
    isLoaded,
  } = useGraphStorage();

  // Modal visibility
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [selectedEdge, setSelectedEdge] = useState<any>(null);

  // ── Import ──────────────────────────────────────────────────────────────
  const handleCSVImport = (newNodes: any[], newEdges: any[]) => {
    setNodes(newNodes);
    setEdges(newEdges);
    setIsImportOpen(false);
  };

  // ── Add Node ────────────────────────────────────────────────────────────
  const handleAddNode = (node: any, edge?: any) => {
    setNodes((prev) => [...prev, node]);
    if (edge) setEdges((prev) => [...prev, edge]);
    setIsAddOpen(false);
  };

  // ── Edit / Delete Node ──────────────────────────────────────────────────
  const handleNodeClick = (_: React.MouseEvent, node: any) =>
    setSelectedNode(node);

  const handleNodeSave = (id: string, label: string, note: string) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, label, note } } : n,
      ),
    );
    setSelectedNode(null);
  };

  const handleNodeDelete = (id: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
    setSelectedNode(null);
  };

  // ── Edit / Delete Edge ──────────────────────────────────────────────────
  const handleEdgeClick = (_: React.MouseEvent, edge: any) =>
    setSelectedEdge(edge);

  const handleEdgeSave = (id: string, label: string) => {
    setEdges((eds) =>
      eds.map((e) => {
        if (e.id !== id) return e;
        const updated = { ...e };
        if (label.trim()) updated.label = label;
        else delete updated.label;
        return updated;
      }),
    );
    setSelectedEdge(null);
  };

  const handleEdgeDelete = (id: string) => {
    setEdges((eds) => eds.filter((e) => e.id !== id));
    setSelectedEdge(null);
  };

  if (!isLoaded) return null;

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
        fitView
      >
        <Panel position="top-left">
          <div className="bg-slate-200 p-2 rounded shadow">
            <ul className="list-none flex gap-2 m-0 p-0">
              <li>
                <button
                  onClick={() => setIsImportOpen(true)}
                  className="bg-white border px-3 py-1 rounded text-sm hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Import CSV
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsAddOpen(true)}
                  className="bg-white border px-3 py-1 rounded text-sm hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Add Node
                </button>
              </li>
            </ul>
          </div>
        </Panel>
        <Background />
        <Controls />
      </ReactFlow>

      <ImportCSVModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImport={handleCSVImport}
      />
      <AddNodeModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        existingNodes={nodes}
        onAdd={handleAddNode}
      />
      <EditNodeModal
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
        onSave={handleNodeSave}
        onDelete={handleNodeDelete}
      />
      <EditEdgeModal
        edge={selectedEdge}
        onClose={() => setSelectedEdge(null)}
        onSave={handleEdgeSave}
        onDelete={handleEdgeDelete}
      />
    </div>
  );
}
