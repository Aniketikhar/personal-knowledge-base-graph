import { Header } from "@/components/Header";
import GraphCanvas from "@/components/GraphCanvas";

export default function Home() {
  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden">
      <Header />
      <main className="flex-1 relative flex">
        <GraphCanvas />
      </main>
    </div>
  );
}
