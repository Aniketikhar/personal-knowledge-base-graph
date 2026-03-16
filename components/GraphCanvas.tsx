"use client";

import { useState, useMemo } from "react";
import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
import "reactflow/dist/style.css";

import { nodeTypes } from "@/components/CustomNode";
import { useGraphStorage } from "@/hooks/useGraphStorage";
import ImportCSVModal from "@/components/modals/ImportCSVModal";
import AddNodeModal from "@/components/modals/AddNodeModal";
import EditNodeModal from "@/components/modals/EditNodeModal";
import EditEdgeModal from "@/components/modals/EditEdgeModal";
import { Sidebar } from "@/components/Sidebar";

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
  const [searchTerm, setSearchTerm] = useState("");

  // Search logic (Highlights nodes matching searchTerm)
  const highlightedNodes = useMemo(() => {
    if (!searchTerm) return nodes;
    const lowerSearch = searchTerm.toLowerCase();
    return nodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          isHighlighted: node.data.label?.toLowerCase().includes(lowerSearch) || 
                         node.data.note?.toLowerCase().includes(lowerSearch)
        }
    }));
  }, [nodes, searchTerm]);

  // ── Import / Export ──────────────────────────────────────────────────────
  const handleCSVImport = (newNodes: any[], newEdges: any[]) => {
    setNodes(newNodes);
    setEdges(newEdges);
    setIsImportOpen(false);
  };

  const handleJSONExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ nodes, edges }));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "knowledge-graph.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
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
    <div className="w-full h-full flex relative">
      <Sidebar 
        nodes={nodes}
        edges={edges}
        onAddNode={() => setIsAddOpen(true)}
        onImportCSV={() => setIsImportOpen(true)}
        onExportJSON={handleJSONExport}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      
      <div className="flex-1 relative h-full">
        <ReactFlow
          nodes={highlightedNodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={handleNodeClick}
          onEdgeClick={handleEdgeClick}
          fitView
        >
          <Background gap={16} />
          <Controls className="bg-background border-border shadow-sm fill-foreground text-foreground" />
          <MiniMap className="bg-background border border-border shadow-sm mask-border" 
                   nodeColor={(n) => n.data?.isHighlighted ? 'var(--primary)' : 'var(--muted-foreground)'}
                   maskColor="var(--background)"
          />
        </ReactFlow>
      </div>

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
