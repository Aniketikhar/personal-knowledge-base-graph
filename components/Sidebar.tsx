"use client";

import { GraphAnalytics } from "./GraphAnalytics";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Download, Wand2 } from "lucide-react";

interface SidebarProps {
  nodes: any[];
  edges: any[];
  onAddNode: () => void;
  onImportCSV: () => void;
  onExportJSON: () => void;
  onArrange: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({
  nodes,
  edges,
  onAddNode,
  onImportCSV,
  onExportJSON,
  onArrange,
  isOpen = false,
  onClose,
}: SidebarProps) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}
      
      <div className={`
        fixed inset-y-0 left-0 z-50 w-80 h-[calc(100vh-3.5rem)] top-14
        border-r bg-card/95 backdrop-blur supports-backdrop-filter:bg-background/60 shadow-lg 
        transform transition-transform duration-300 ease-in-out flex flex-col
        md:relative md:top-0 md:h-full md:shadow-none md:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg tracking-tight mb-4">Controls</h2>
        
        <div className="flex flex-col gap-3">
          <Button
            onClick={onAddNode}
            className="w-full justify-start bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)] hover:shadow-[0_0_20px_rgba(16,185,129,0.7)] border-0 font-medium text-base h-10 transition-all duration-300 active:scale-[0.98]"
            size="lg"
          >
            <div className="bg-white/20 p-1 rounded-sm mr-3">
              <Plus className="h-4 w-4 text-white" />
            </div>
            Add New Node
          </Button>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={onImportCSV}
              variant="outline"
              className="w-full"
            >
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
            <Button
              onClick={onExportJSON}
              variant="outline"
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
          
          <Button
            onClick={onArrange}
            className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)] hover:shadow-[0_0_20px_rgba(168,85,247,0.7)] border-0 transition-all duration-300"
          >
            <Wand2 className="mr-2 h-4 w-4" />
            Magic Arrange
          </Button>
        </div>
      </div>

      <div className="p-4 border-b">
        <label className="text-sm font-medium leading-none mb-3 block">
          Appearance
        </label>
        <ThemeToggle />
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        <GraphAnalytics nodes={nodes} edges={edges} />
      </div>
    </div>
    </>
  );
}
