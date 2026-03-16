"use client";

import { useMemo } from "react";
import { GraphNode, GraphEdge } from "@/types/graph";

interface GraphAnalyticsProps {
  nodes: any[];
  edges: any[];
}

export function GraphAnalytics({ nodes, edges }: GraphAnalyticsProps) {
  const stats = useMemo(() => {
    const totalNodes = nodes.length;
    const totalEdges = edges.length;

    const connectedNodeIds = new Set<string>();
    edges.forEach((edge) => {
      connectedNodeIds.add(edge.source);
      connectedNodeIds.add(edge.target);
    });

    const isolatedNodes = nodes.filter((node) => !connectedNodeIds.has(node.id)).length;

    // simplistic hub detection: max edges connected to a single node
    const connectionCounts: Record<string, number> = {};
    edges.forEach((edge) => {
      connectionCounts[edge.source] = (connectionCounts[edge.source] || 0) + 1;
      connectionCounts[edge.target] = (connectionCounts[edge.target] || 0) + 1;
    });

    let maxConnections = 0;
    let hubNodeId = "";
    Object.entries(connectionCounts).forEach(([nodeId, count]) => {
      if (count > maxConnections) {
        maxConnections = count;
        hubNodeId = nodeId;
      }
    });

    const hubNode = nodes.find((n) => n.id === hubNodeId);

    return {
      totalNodes,
      totalEdges,
      isolatedNodes,
      hubNodeName: hubNode ? hubNode.data?.label || hubNode.title || "Unknown" : "None",
      maxConnections,
    };
  }, [nodes, edges]);

  return (
    <div className="flex flex-col gap-3 p-4 bg-muted/30 rounded-lg border border-border/50">
      <h3 className="text-sm font-semibold tracking-tight">Graph Analytics</h3>
      
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col bg-background p-2 rounded border shadow-sm">
          <span className="text-xs text-muted-foreground">Nodes</span>
          <span className="font-semibold text-lg">{stats.totalNodes}</span>
        </div>
        <div className="flex flex-col bg-background p-2 rounded border shadow-sm">
          <span className="text-xs text-muted-foreground">Edges</span>
          <span className="font-semibold text-lg">{stats.totalEdges}</span>
        </div>
        <div className="flex flex-col bg-background p-2 rounded border shadow-sm">
          <span className="text-xs text-muted-foreground">Isolated</span>
          <span className="font-semibold text-lg">{stats.isolatedNodes}</span>
        </div>
        <div className="flex flex-col bg-background p-2 rounded border shadow-sm">
          <span className="text-xs text-muted-foreground">Top Hub</span>
          <span className="font-semibold text-sm truncate" title={stats.hubNodeName}>
            {stats.maxConnections > 0 ? stats.hubNodeName : "-"}
          </span>
        </div>
      </div>
    </div>
  );
}
