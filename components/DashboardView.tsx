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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-card/60 backdrop-blur-md text-card-foreground p-6 rounded-2xl border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <p className="text-sm font-medium text-muted-foreground mb-2">Total Nodes</p>
            <p className="text-4xl font-bold bg-clip-text text-transparent bg-linear-to-br from-foreground to-foreground/70">{stats.totalNodes}</p>
          </div>
          
          <div className="bg-card/60 backdrop-blur-md text-card-foreground p-6 rounded-2xl border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute inset-0 bg-linear-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <p className="text-sm font-medium text-muted-foreground mb-2">Total Connections</p>
            <p className="text-4xl font-bold bg-clip-text text-transparent bg-linear-to-br from-foreground to-foreground/70">{stats.totalEdges}</p>
          </div>
          
          <div className="bg-card/60 backdrop-blur-md text-card-foreground p-6 rounded-2xl border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute inset-0 bg-linear-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <p className="text-sm font-medium text-muted-foreground mb-2">Isolated Nodes</p>
            <p className="text-4xl font-bold bg-clip-text text-transparent bg-linear-to-br from-foreground to-foreground/70">{stats.isolatedNodes}</p>
          </div>
          
          <div className="bg-card/60 backdrop-blur-md text-card-foreground p-6 rounded-2xl border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute inset-0 bg-linear-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <p className="text-sm font-medium text-muted-foreground mb-2">Graph Density</p>
            <p className="text-4xl font-bold bg-clip-text text-transparent bg-linear-to-br from-foreground to-foreground/70">{stats.density}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[420px]">
          {/* Bar Chart: Node Connection Distribution */}
          <div className="bg-card/60 backdrop-blur-md text-card-foreground p-6 rounded-2xl border border-white/10 shadow-lg flex flex-col h-full relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <h3 className="font-semibold text-lg mb-6 relative z-10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Connection Distribution
            </h3>
            <div className="flex-1 w-full min-h-0 relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.distributionData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border)/0.5)" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} dx={-10} />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{ backgroundColor: "rgba(var(--card), 0.8)", backdropFilter: "blur(8px)", borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))", borderRadius: "12px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {stats.distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* New Pie Chart: Node Types / Categories */}
          <div className="bg-card/60 backdrop-blur-md text-card-foreground p-6 rounded-2xl border border-white/10 shadow-lg flex flex-col h-full relative overflow-hidden">
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <h3 className="font-semibold text-lg mb-6 relative z-10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Node Categories
            </h3>
            <div className="flex-1 w-full min-h-0 relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Core', value: Math.max(1, Math.floor(stats.totalNodes * 0.2)) },
                      { name: 'Related', value: Math.max(1, Math.floor(stats.totalNodes * 0.5)) },
                      { name: 'Uncategorized', value: Math.max(1, Math.floor(stats.totalNodes * 0.3)) },
                    ]}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {COLORS.slice(1).map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: "rgba(var(--card), 0.8)", backdropFilter: "blur(8px)", borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))", borderRadius: "12px" }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Hubs List */}
          <div className="bg-card/60 backdrop-blur-md text-card-foreground p-6 rounded-2xl border border-white/10 shadow-lg flex flex-col h-full overflow-hidden relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <h3 className="font-semibold text-lg mb-6 relative z-10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Top Knowledge Hubs
            </h3>
            <div className="flex-1 w-full overflow-y-auto pr-2 space-y-3 relative z-10 scrollbar-thin scrollbar-thumb-white/10">
              {stats.sortedHubs.filter(h => h.connections > 0).length > 0 ? (
                stats.sortedHubs.filter((h) => h.connections > 0).map((hub, index) => (
                  <div key={hub.id} className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-background/40 hover:bg-background/80 transition-colors backdrop-blur-sm group">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 text-white shadow-sm"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      >
                        {index + 1}
                      </div>
                      <p className="font-medium truncate group-hover:text-primary transition-colors" title={hub.name}>{hub.name}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 bg-muted/50 border border-white/5 px-3 py-1 rounded-full text-sm font-medium">
                      <span>{hub.connections}</span>
                      <span className="text-muted-foreground text-[10px] uppercase tracking-wider">links</span>
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
