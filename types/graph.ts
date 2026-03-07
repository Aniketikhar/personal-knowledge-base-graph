export interface GraphNode {
  id: string
  title: string
  note?: string
}

export interface GraphEdge {
  source: string
  target: string
  label: string
}