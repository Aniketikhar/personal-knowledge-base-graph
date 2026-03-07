import { Handle, Position, NodeProps } from "reactflow";

const CustomNode = ({ data }: NodeProps) => {
  return (
    <div className="bg-white border-2 border-slate-300 rounded shadow-sm p-3 min-w-[150px] max-w-[250px]">
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 bg-slate-400"
      />
      <div className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-1 mb-1">
        {data.label || "Untitled"}
      </div>
      {data.note && (
        <div className="text-xs text-slate-500 overflow-hidden line-clamp-3 text-ellipsis whitespace-pre-wrap">
          {data.note}
        </div>
      )}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 bg-slate-400"
      />
    </div>
  );
};

export const nodeTypes = { default: CustomNode };
export default CustomNode;
