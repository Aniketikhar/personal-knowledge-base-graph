"use client"

import { useEffect, useState } from "react"

export function useGraphData() {
  const [nodes, setNodes] = useState<any[]>([])
  const [edges, setEdges] = useState<any[]>([])

  useEffect(() => {
    const storedNodes = localStorage.getItem("nodes")
    const storedEdges = localStorage.getItem("edges")

    if (storedNodes && storedEdges) {
      setNodes(JSON.parse(storedNodes))
      setEdges(JSON.parse(storedEdges))
    }
  }, [])

  useEffect(() => {
    if (nodes.length) {
      localStorage.setItem("nodes", JSON.stringify(nodes))
      localStorage.setItem("edges", JSON.stringify(edges))
    }
  }, [nodes, edges])

  return { nodes, setNodes, edges, setEdges }
}