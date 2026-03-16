"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface DashboardViewProps {
  nodes: any[];
  edges: any[];
}

const COLORS = ["#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export function DashboardView({ nodes, edges }: DashboardViewProps) {
  const stats = useMemo(() => {
    const totalNodes = nodes.length;
    const totalEdges = edges.length;

    // Calculate node degrees (connections per node)
    const nodeDegrees: Record<string, number> = {};
    nodes.forEach((n) => (nodeDegrees[n.id] = 0));

    edges.forEach((e) => {
      if (nodeDegrees[e.source] !== undefined) nodeDegrees[e.source]++;
      if (nodeDegrees[e.target] !== undefined) nodeDegrees[e.target]++;
    });

    // Isolated Nodes
    const isolatedNodes = Object.values(nodeDegrees).filter((d) => d === 0).length;

    // Highest degree nodes (Hubs)
    const sortedHubs = Object.entries(nodeDegrees)
      .map(([id, degree]) => {
        const node = nodes.find((n) => n.id === id);
        return {
          id,
          name: node?.data?.label || id,
          connections: degree,
        };
      })
      .sort((a, b) => b.connections - a.connections)
      .slice(0, 5); // Top 5

    // Edges Distribution (Bar Chart Data)
    const degreeGaps: Record<string, number> = {
      "0": 0,
      "1-2": 0,
      "3-5": 0,
      "5+": 0,
    };

    Object.values(nodeDegrees).forEach((degree) => {
      if (degree === 0) degreeGaps["0"]++;
      else if (degree <= 2) degreeGaps["1-2"]++;
      else if (degree <= 5) degreeGaps["3-5"]++;
      else degreeGaps["5+"]++;
    });

    const distributionData = [
      { name: "Isolated (0)", count: degreeGaps["0"] },
      { name: "Low (1-2)", count: degreeGaps["1-2"] },
      { name: "Medium (3-5)", count: degreeGaps["3-5"] },
      { name: "High (5+)", count: degreeGaps["5+"] },
    ];

    return {
      totalNodes,
      totalEdges,
      isolatedNodes,
      sortedHubs,
      distributionData,
      density: totalNodes > 1 ? (totalEdges / (totalNodes * (totalNodes - 1))).toFixed(3) : 0,
    };
  }, [nodes, edges]);

  if (nodes.length === 0) {
    return (
      <div className="flex-1 h-full flex flex-col items-center justify-center p-8 text-center bg-muted/20">
        <h2 className="text-2xl font-semibold tracking-tight mb-2">Knowledge Dashboard</h2>
        <p className="text-muted-foreground max-w-md">
          Your graph is currently empty. Add some nodes and connections to see powerful analytics and visualizations here!
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full overflow-y-auto p-6 md:p-8 bg-muted/10">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Knowledge Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive insights into your personal knowledge base.</p>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card text-card-foreground p-6 rounded-xl border shadow-sm">
            <p className="text-sm font-medium text-muted-foreground mb-1">Total Nodes</p>
            <p className="text-3xl font-bold">{stats.totalNodes}</p>
          </div>
          <div className="bg-card text-card-foreground p-6 rounded-xl border shadow-sm">
            <p className="text-sm font-medium text-muted-foreground mb-1">Total Connections</p>
            <p className="text-3xl font-bold">{stats.totalEdges}</p>
          </div>
          <div className="bg-card text-card-foreground p-6 rounded-xl border shadow-sm">
            <p className="text-sm font-medium text-muted-foreground mb-1">Isolated Nodes</p>
            <p className="text-3xl font-bold">{stats.isolatedNodes}</p>
          </div>
          <div className="bg-card text-card-foreground p-6 rounded-xl border shadow-sm">
            <p className="text-sm font-medium text-muted-foreground mb-1">Graph Density</p>
            <p className="text-3xl font-bold">{stats.density}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[400px]">
          {/* Bar Chart: Node Connection Distribution */}
          <div className="bg-card text-card-foreground p-6 rounded-xl border shadow-sm flex flex-col h-full">
            <h3 className="font-semibold text-lg mb-6">Connection Distribution</h3>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.distributionData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    cursor={{ fill: "hsl(var(--muted))" }}
                    contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))", borderRadius: "8px" }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Hubs List */}
          <div className="bg-card text-card-foreground p-6 rounded-xl border shadow-sm flex flex-col h-full overflow-hidden">
            <h3 className="font-semibold text-lg mb-6">Top Knowledge Hubs</h3>
            <div className="flex-1 w-full overflow-y-auto pr-2 space-y-3">
              {stats.sortedHubs.filter(h => h.connections > 0).length > 0 ? (
                stats.sortedHubs.filter((h) => h.connections > 0).map((hub, index) => (
                  <div key={hub.id} className="flex items-center justify-between p-3 rounded-lg border bg-background/50">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                        {index + 1}
                      </div>
                      <p className="font-medium truncate" title={hub.name}>{hub.name}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 bg-muted px-2.5 py-1 rounded-full text-sm font-medium">
                      <span>{hub.connections}</span>
                      <span className="text-muted-foreground text-xs">links</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground flex items-center justify-center h-full pb-8">
                  No connections established yet.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
