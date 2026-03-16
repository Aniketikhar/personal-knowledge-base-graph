"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useNodesState, useEdgesState, addEdge, Connection, Edge, Node } from "reactflow";

interface HistoryState {
  nodes: Node[];
  edges: Edge[];
}

export function useGraphStorage() {
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // History tracking
  const [past, setPast] = useState<HistoryState[]>([]);
  const [future, setFuture] = useState<HistoryState[]>([]);
  
  // Use a ref to prevent infinite loops during history playback
  const isUndoRedoActive = useRef(false);

  const takeSnapshot = useCallback(() => {
    if (isUndoRedoActive.current) return;
    setPast((prev) => [...prev, { nodes: [...nodes], edges: [...edges] }]);
    setFuture([]); // Clearing future on new action
  }, [nodes, edges]);

  // Wrapper for setNodes that takes a snapshot before updating
  const setNodesWithHistory = useCallback((nodesUpdater: any) => {
    takeSnapshot();
    setNodes(nodesUpdater);
  }, [setNodes, takeSnapshot]);

  // Wrapper for setEdges that takes a snapshot before updating
  const setEdgesWithHistory = useCallback((edgesUpdater: any) => {
    takeSnapshot();
    setEdges(edgesUpdater);
  }, [setEdges, takeSnapshot]);

  // Initial fetch from localStorage
  useEffect(() => {
    const storedNodes = localStorage.getItem("nodes");
    const storedEdges = localStorage.getItem("edges");
    if (storedNodes) setNodes(JSON.parse(storedNodes));
    if (storedEdges) setEdges(JSON.parse(storedEdges));
    setIsLoaded(true);
  }, [setNodes, setEdges]);

  // Save nodes and edges to localstorage when they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("nodes", JSON.stringify(nodes));
      localStorage.setItem("edges", JSON.stringify(edges));
    }
  }, [nodes, edges, isLoaded]);

  // Handle Connections
  const onConnect = useCallback(
    (params: Edge | Connection) => {
      takeSnapshot();
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges, takeSnapshot]
  );

  // Undo / Redo logic
  const undo = useCallback(() => {
    if (past.length === 0) return;
    isUndoRedoActive.current = true;
    
    const previous = past[past.length - 1];
    setPast((prev) => prev.slice(0, prev.length - 1));
    setFuture((prev) => [...prev, { nodes: [...nodes], edges: [...edges] }]);
    
    setNodes(previous.nodes);
    setEdges(previous.edges);
    
    setTimeout(() => { isUndoRedoActive.current = false; }, 50);
  }, [past, nodes, edges, setNodes, setEdges]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    isUndoRedoActive.current = true;
    
    const next = future[future.length - 1];
    setFuture((prev) => prev.slice(0, prev.length - 1));
    setPast((prev) => [...prev, { nodes: [...nodes], edges: [...edges] }]);
    
    setNodes(next.nodes);
    setEdges(next.edges);
    
    setTimeout(() => { isUndoRedoActive.current = false; }, 50);
  }, [future, nodes, edges, setNodes, setEdges]);

  // Global Keyboard Shortcuts for Undo/Redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          redo();
        } else {
          e.preventDefault();
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return {
    nodes, setNodes: setNodesWithHistory, onNodesChange,
    edges, setEdges: setEdgesWithHistory, onEdgesChange,
    onConnect,
    isLoaded,
    takeSnapshot,
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0
  };
}
