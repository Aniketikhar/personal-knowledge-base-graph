import { Handle, Position, NodeProps } from "reactflow";
import ReactMarkdown from "react-markdown";

const CustomNode = ({ data }: NodeProps) => {
  const isHighlighted = data.isHighlighted;

  // Determine accent color based on node content for a minimal color hint
  const accentColor = data.label.toLowerCase().includes("react")
    ? "bg-cyan-500"
    : data.label.toLowerCase().includes("state")
      ? "bg-emerald-500"
      : "bg-primary";

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="w-2.5 h-2.5 border-2 border-background bg-muted-foreground transition-all duration-300 z-10"
      />

      <div
        className={`group relative min-w-[160px] max-w-[260px] p-4 rounded-lg bg-card transition-all duration-300
        ${data.selected ? "border-2 border-primary shadow-sm" : "border border-border shadow-sm hover:border-primary/40"}
        ${isHighlighted ? "ring-2 ring-violet-500 ring-offset-1 scale-[1.02]" : ""}
        ${data.isDimmed ? "opacity-25 grayscale duration-500 delay-75 blur-[1px]" : "opacity-100 filter-none"}
      `}
      >
        <div className="relative z-10 flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <div
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${accentColor}`}
            />
            <h3 className="font-semibold text-sm leading-tight text-foreground transition-colors line-clamp-2">
              {data.label}
            </h3>
          </div>

          {data.note && (
            <div className="text-xs text-muted-foreground line-clamp-3 leading-relaxed prose prose-sm dark:prose-invert prose-p:my-0 prose-ul:my-0 prose-pre:my-0 max-w-none">
              <ReactMarkdown>{data.note}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2.5 h-2.5 border-2 border-background bg-muted-foreground transition-all duration-300 z-10"
      />
    </>
  );
};

export const nodeTypes = { default: CustomNode };
export default CustomNode;
