"use client";
import GraphCanvas from "@/components/GraphCanvas";

export default function Home() {
  return (
    <main className="w-full h-full md:h-screen bg-orange-200">
      <div className="container mx-auto pt-10">
        <div>
          <h1 className="text-3xl font-bold mb-4">Personal Knowledge Base Graph</h1>
        </div>
        <div className="bg-slate-100 border-8 rounded-lg border-blue-400 h-[80vh] relative">
          <GraphCanvas />
        </div>
        <div className="footer">
          Made By Aniket Ikhar
        </div>
      </div>
    </main>
  );
}
