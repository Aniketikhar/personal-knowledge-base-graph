"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import GraphCanvas from "@/components/GraphCanvas";
import { DashboardView } from "@/components/DashboardView";
import { useGraphStorage } from "@/hooks/useGraphStorage";
import { Sidebar } from "@/components/Sidebar";

export type ViewMode = "graph" | "dashboard";

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewMode>("graph");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { nodes, edges } = useGraphStorage();

  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden">
      <Header 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <main className="flex-1 relative flex overflow-hidden">
        {currentView === "graph" ? (
          <GraphCanvas 
             isMobileOpen={isSidebarOpen} 
             onCloseMobile={() => setIsSidebarOpen(false)} 
          />
        ) : (
          <DashboardView nodes={nodes} edges={edges} />
        )}
      </main>
    </div>
  );
}
