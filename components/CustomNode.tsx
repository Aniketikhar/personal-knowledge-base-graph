import { Handle, Position, NodeProps } from "reactflow";

const CustomNode = ({ data }: NodeProps) => {
  const isHighlighted = data.isHighlighted;

  return (
    <div 
      className={`bg-card text-card-foreground border rounded-xl shadow-sm p-4 min-w-[180px] max-w-[280px] transition-all duration-200 
      ${isHighlighted ? 'ring-2 ring-primary border-primary shadow-md scale-[1.02]' : 'border-border hover:shadow-md hover:border-muted-foreground/50'}`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-muted-foreground border-2 border-background"
      />
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isHighlighted ? 'bg-primary' : 'bg-muted-foreground/40'}`} />
          <div className="font-semibold text-sm leading-none tracking-tight">
            {data.label || "Untitled"}
          </div>
        </div>
        
        {data.note && (
          <div className="text-xs text-muted-foreground mt-1 bg-muted/30 p-2 rounded-md overflow-hidden line-clamp-4 text-ellipsis whitespace-pre-wrap">
            {data.note}
          </div>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-muted-foreground border-2 border-background"
      />
    </div>
  );
};

export const nodeTypes = { default: CustomNode };
export default CustomNode;
