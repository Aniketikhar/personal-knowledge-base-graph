import { BaseEdge, EdgeLabelRenderer, EdgeProps, getSmoothStepPath } from 'reactflow';
import { X } from 'lucide-react';

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  label,
  data,
  selected
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Extract the delete function passed down via edge data
  const onDelete = data?.onDelete;

  return (
    <>
      {/* Background thicker invisible path to make hovering/clicking easier */}
      <path
        d={edgePath}
        fill="none"
        strokeOpacity={0}
        strokeWidth={20}
        className="react-flow__edge-interaction"
        style={{ cursor: 'pointer' }}
      />
      
      {/* Glow Effect when Selected */}
      {selected && (
        <path
          d={edgePath}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={8}
          strokeOpacity={0.15}
          className="transition-all duration-300 pointer-events-none drop-shadow-md"
        />
      )}

      {/* Visible Path */}
      <path
        id={id}
        d={edgePath}
        markerEnd={markerEnd}
        fill="none"
        className="react-flow__edge-path transition-all duration-300 pointer-events-none"
        style={{
          ...style,
          stroke: selected ? 'var(--primary)' : 'var(--muted-foreground)',
          strokeWidth: selected ? 3 : 2,
        }}
      />
      
      {/* Interactive Edge Label */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan flex items-center gap-1 group"
        >
          {label && (
            <div className="bg-background text-foreground text-xs px-2 py-0.5 rounded-full border shadow-sm font-medium">
              {label}
            </div>
          )}
          
          {/* Delete Button (Appears on Hover or if Selected) */}
          <button
             onClick={(e) => {
                 e.stopPropagation();
                 if (onDelete) onDelete(id);
             }}
             className={`p-1 rounded-full bg-destructive text-destructive-foreground shadow focus:outline-none hover:bg-destructive/90 transition-opacity
                ${selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`
             }
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
