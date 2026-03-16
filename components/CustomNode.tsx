import { Handle, Position, NodeProps } from "reactflow";

const CustomNode = ({ data }: NodeProps) => {
  const isHighlighted = data.isHighlighted;

  return (
    <>
      <Handle type="target" position={Position.Top} className="w-3 h-3 border-2 border-background bg-muted-foreground transition-all duration-300 group-hover:bg-primary z-10" />
      
      <div 
        className={`group relative min-w-[180px] max-w-[280px] px-5 py-4 rounded-xl shadow-md border bg-card/90 backdrop-blur-md transition-all duration-300
        ${data.selected ? "ring-2 ring-primary border-primary shadow-lg shadow-primary/20 scale-[1.02] z-20" : "border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"}
        ${isHighlighted ? "ring-4 ring-offset-2 ring-violet-500 shadow-xl shadow-violet-500/30 scale-105" : ""}
      `}
      >
        {/* Glow effect behind node on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-2 gap-3">
            <h3 className="font-bold text-base leading-tight break-words text-foreground group-hover:text-primary transition-colors flex-1">
              {data.label}
            </h3>
            {/* Type/Category dot indicator */}
            <div className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 shadow-sm ${
              data.label.toLowerCase().includes('react') ? 'bg-cyan-500 shadow-cyan-500/50' : 
              data.label.toLowerCase().includes('state') ? 'bg-emerald-500 shadow-emerald-500/50' : 
              'bg-primary shadow-primary/50'
            }`} />
          </div>
          
          {data.note && (
            <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed mt-1 border-t border-border/50 pt-2 group-hover:text-foreground/80 transition-colors">
              {data.note}
            </p>
          )}
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 border-2 border-background bg-muted-foreground transition-all duration-300 group-hover:bg-primary z-10" />
    </>
  );
};

export const nodeTypes = { default: CustomNode };
export default CustomNode;
