"use client";

import { ThemeToggle } from "./ThemeToggle";
import { ViewMode } from "@/app/page";
import { Menu, LayoutDashboard, Share2 } from "lucide-react";

interface HeaderProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  toggleSidebar: () => void;
}

export function Header({ currentView, onViewChange, toggleSidebar }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-14 items-center px-4 md:px-6 gap-4">
        {currentView === "graph" && (
          <button 
            onClick={toggleSidebar}
            className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        
        <div className="flex items-center gap-2 font-bold text-lg tracking-tight shrink-0">
          <div className="w-6 h-6 rounded bg-primary text-primary-foreground flex items-center justify-center text-sm">
            KG
          </div>
          <span className="hidden sm:inline-block">Knowledge Graph</span>
        </div>
        
        <div className="flex-1 flex justify-center">
          <div className="flex items-center bg-muted/50 p-1 rounded-full border border-border/50">
            <button
              onClick={() => onViewChange("graph")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                currentView === "graph" 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline-block">Graph View</span>
            </button>
            <button
              onClick={() => onViewChange("dashboard")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                currentView === "dashboard" 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline-block">Dashboard</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
