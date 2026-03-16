"use client";

import { useState, useMemo } from "react";
import ReactFlow, { Background, Controls, MiniMap, Node, Edge } from "reactflow";
import "reactflow/dist/style.css";

import { nodeTypes } from "@/components/CustomNode";
import CustomEdge from "@/components/CustomEdge";
import { useGraphStorage } from "@/hooks/useGraphStorage";
import { getLayoutedElements } from "@/utils/layout";
import ImportCSVModal from "@/components/modals/ImportCSVModal";
import AddNodeModal from "@/components/modals/AddNodeModal";
import EditNodeModal from "@/components/modals/EditNodeModal";
import EditEdgeModal from "@/components/modals/EditEdgeModal";
import { Sidebar } from "@/components/Sidebar";
import { ContextMenu } from "@/components/ContextMenu";

interface GraphCanvasProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  searchTerm: string;
  isReadOnly: boolean;
}

export default function GraphCanvas({ isMobileOpen, onCloseMobile, searchTerm, isReadOnly }: GraphCanvasProps) {
  const edgeTypes = useMemo(() => ({ custom: CustomEdge }), []);

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
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);
  const [menu, setMenu] = useState<{
    id?: string;
    top: number;
    left: number;
    right?: number;
    bottom?: number;
    type: 'node' | 'pane';
  } | null>(null);

  // Focus Mode Logic: Get all neighbors of the focused node
  const focusData = useMemo(() => {
    if (!focusedNodeId) return { neighborIds: new Set<string>(), active: false };
    
    const neighborIds = new Set<string>([focusedNodeId]);
    edges.forEach(edge => {
      if (edge.source === focusedNodeId) neighborIds.add(edge.target);
      if (edge.target === focusedNodeId) neighborIds.add(edge.source);
    });
    
    return { neighborIds, active: true };
  }, [focusedNodeId, edges]);

  // Search logic (Highlights nodes matching searchTerm) and Focus Dimming
  const processedNodes = useMemo(() => {
    const lowerSearch = searchTerm?.toLowerCase() || "";
    
    return nodes.map(node => {
      const isSearchMatch = lowerSearch ? (node.data.label?.toLowerCase().includes(lowerSearch) || 
                                          node.data.note?.toLowerCase().includes(lowerSearch)) : false;
      
      const isDimmed = focusData.active && !focusData.neighborIds.has(node.id);

      return {
        ...node,
        type: node.type || "custom",
        draggable: !isReadOnly,
        data: {
          ...node.data,
          isHighlighted: isSearchMatch,
          isDimmed: isDimmed
        }
      };
    });
  }, [nodes, searchTerm, focusData]);

  const handleCSVImport = (newNodes: any[], newEdges: any[]) => {
    // We can auto-layout newly imported graphs immediately
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      newNodes,
      newEdges,
      "LR"
    );
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
    setIsImportOpen(false);
  };

  const onLayout = () => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges,
      "LR"
    );
    setNodes([...layoutedNodes]);
    setEdges([...layoutedEdges]);
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
    setNodes((prev: Node[]) => [...prev, node]);
    if (edge) setEdges((prev: Edge[]) => [...prev, edge]);
    setIsAddOpen(false);
  };

  // ── Edit / Delete Node ──────────────────────────────────────────────────
  const handleNodeClick = (_: React.MouseEvent, node: any) => {
    setFocusedNodeId(node.id);
  };
  
  const handleNodeDoubleClick = (_: React.MouseEvent, node: any) => {
    setSelectedNode(node);
  };
  
  const handlePaneClick = () => {
    setFocusedNodeId(null);
    setMenu(null);
  };
  
  // ── Context Menus ───────────────────────────────────────────────────────
  const onNodeContextMenu = (event: React.MouseEvent, node: any) => {
    event.preventDefault();
    if (isReadOnly) return;
    
    const pane = (event.target as Element).closest('.react-flow');
    if (!pane) return;
    const { top, left, width, height } = pane.getBoundingClientRect();

    setMenu({
      id: node.id,
      top: event.clientY < top + height / 2 ? event.clientY - top : 0,
      left: event.clientX < left + width / 2 ? event.clientX - left : 0,
      bottom: event.clientY >= top + height / 2 ? top + height - event.clientY : undefined,
      right: event.clientX >= left + width / 2 ? left + width - event.clientX : undefined,
      type: 'node',
    });
  };

  const onPaneContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    if (isReadOnly) return;
    
    const pane = (event.target as Element).closest('.react-flow');
    if (!pane) return;
    const { top, left, width, height } = pane.getBoundingClientRect();

    setMenu({
      top: event.clientY < top + height / 2 ? event.clientY - top : 0,
      left: event.clientX < left + width / 2 ? event.clientX - left : 0,
      bottom: event.clientY >= top + height / 2 ? top + height - event.clientY : undefined,
      right: event.clientX >= left + width / 2 ? left + width - event.clientX : undefined,
      type: 'pane',
    });
  };
  
  const closeMenu = () => setMenu(null);

  const handleNodeSave = (id: string, label: string, note: string) => {
    setNodes((nds: Node[]) =>
      nds.map((n: Node) =>
        n.id === id ? { ...n, data: { ...n.data, label, note } } : n,
      ),
    );
    setSelectedNode(null);
  };

  const handleNodeDelete = (id: string) => {
    setNodes((nds: Node[]) => nds.filter((n: Node) => n.id !== id));
    setEdges((eds: Edge[]) => eds.filter((e: Edge) => e.source !== id && e.target !== id));
    setSelectedNode(null);
  };

  // ── Edit / Delete Edge ──────────────────────────────────────────────────
  const handleEdgeClick = (_: React.MouseEvent, edge: any) =>
    setSelectedEdge(edge);

  const handleEdgeSave = (id: string, label: string) => {
    setEdges((eds: Edge[]) =>
      eds.map((e: Edge) => {
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
    setEdges((eds: Edge[]) => eds.filter((e: Edge) => e.id !== id));
    setSelectedEdge(null);
  };

  // Map edges to inject the delete handler and use custom type/styling
  const customEdges = useMemo(() => {
    return edges.map((e) => {
      const isDimmed = focusData.active && e.source !== focusedNodeId && e.target !== focusedNodeId;

      return {
        ...e,
        type: 'custom',
        animated: true,
        style: {
          ...e.style,
          opacity: isDimmed ? 0.2 : 1,
        },
        data: {
          ...e.data,
          onDelete: handleEdgeDelete,
        },
      };
    });
  }, [edges, focusData, focusedNodeId]);

  if (!isLoaded) return null;

  return (
    <div className="w-full h-full flex relative overflow-hidden" onClick={closeMenu}>
      <Sidebar 
        nodes={nodes}
        edges={edges}
        onAddNode={() => setIsAddOpen(true)}
        onImportCSV={() => setIsImportOpen(true)}
        onExportJSON={handleJSONExport}
        onArrange={onLayout}
        isOpen={isMobileOpen}
        onClose={onCloseMobile}
      />
      
      <div className="flex-1 relative h-full w-full min-w-0">
        <ReactFlow
          nodes={processedNodes}
          edges={customEdges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={isReadOnly ? undefined : onNodesChange}
          onEdgesChange={isReadOnly ? undefined : onEdgesChange}
          onConnect={isReadOnly ? undefined : onConnect}
          onNodeClick={handleNodeClick}
          onNodeDoubleClick={isReadOnly ? undefined : handleNodeDoubleClick}
          onPaneClick={handlePaneClick}
          onEdgeClick={isReadOnly ? undefined : handleEdgeClick}
          onNodeContextMenu={onNodeContextMenu}
          onPaneContextMenu={onPaneContextMenu}
          nodesDraggable={!isReadOnly}
          nodesConnectable={!isReadOnly}
          elementsSelectable={!isReadOnly}
          fitView
        >
          <Background gap={16} />
          <Controls className="bg-background border-border shadow-sm fill-foreground text-foreground" />
          <MiniMap className="bg-background border border-border shadow-sm mask-border" 
                   nodeColor={(n) => n.data?.isHighlighted ? 'var(--primary)' : 'var(--muted-foreground)'}
                   maskColor="var(--background)"
           />
        </ReactFlow>
        
        {menu && (
          <ContextMenu 
            {...menu} 
            onEdit={() => {
              if (menu.id) {
                const node = nodes.find(n => n.id === menu.id);
                if (node) setSelectedNode(node);
              }
              closeMenu();
            }}
            onDelete={() => {
              if (menu.id) handleNodeDelete(menu.id);
              closeMenu();
            }}
            onAddNodeHere={() => {
              setIsAddOpen(true);
              closeMenu();
            }}
          />
        )}
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
