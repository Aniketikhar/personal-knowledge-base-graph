"use client";

import { useEffect, useState, useCallback } from "react";
import { useNodesState, useEdgesState, addEdge, Connection, Edge } from "reactflow";

export function useGraphStorage() {
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const storedNodes = localStorage.getItem("nodes");
    const storedEdges = localStorage.getItem("edges");
    if (storedNodes) setNodes(JSON.parse(storedNodes));
    if (storedEdges) setEdges(JSON.parse(storedEdges));
    setIsLoaded(true);
  }, [setNodes, setEdges]);

  // Save to localStorage whenever nodes/edges change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("nodes", JSON.stringify(nodes));
      localStorage.setItem("edges", JSON.stringify(edges));
    }
  }, [nodes, edges, isLoaded]);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return {
    nodes, setNodes, onNodesChange,
    edges, setEdges, onEdgesChange,
    onConnect,
    isLoaded,
  };
}
