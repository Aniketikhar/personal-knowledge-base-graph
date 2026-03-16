import { Trash2, Edit2, Network } from "lucide-react";

export interface ContextMenuProps {
  id?: string;
  top: number;
  left: number;
  right?: number;
  bottom?: number;
  type: 'node' | 'pane';
  onEdit?: () => void;
  onDelete?: () => void;
  onAddNodeHere?: () => void;
}

export function ContextMenu({
  top,
  left,
  right,
  bottom,
  type,
  onEdit,
  onDelete,
  onAddNodeHere,
}: ContextMenuProps) {
  return (
    <div
      style={{ top, left, right, bottom }}
      className="absolute z-50 min-w-40 bg-card rounded-md border shadow-md flex flex-col p-1 animate-in fade-in zoom-in-95 duration-100"
    >
      {type === 'node' && (
        <>
          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm text-left"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit Node
          </button>
          
          <hr className="my-1 border-border" />
          
          <button
            onClick={onDelete}
            className="flex items-center gap-2 px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10 rounded-sm text-left"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </>
      )}

      {type === 'pane' && (
        <>
          <button
            onClick={onAddNodeHere}
            className="flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm text-left"
          >
            <Network className="w-3.5 h-3.5" />
            Create Node Here
          </button>
        </>
      )}
    </div>
  );
}
