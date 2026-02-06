import { useRef, useState, useCallback, useEffect, useMemo, type WheelEvent, type MouseEvent } from "react";
import {
  computeLayout,
  countNodes,
  treeHeight,
  type LayoutNode,
} from "../../utils/bst";
import { ZoomIn, ZoomOut, RotateCcw, TreePine } from "lucide-react";
import { useBSTAnimation } from "../../hooks";

/* ── Constants ─────────────────────────────────────────────────────── */
const NODE_RADIUS = 18;
const MIN_ZOOM = 0.2;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.1;

/* ── Component ─────────────────────────────────────────────────────── */

/* ── Highlight colours ─────────────────────────────────────────────── */
const COLOR_DEFAULT_FILL = "#1a1a2e";
const COLOR_DEFAULT_STROKE = "#888";
const COLOR_VISITED_FILL = "#f59e0b";    // amber — already-visited trail
const COLOR_VISITED_STROKE = "#b45309";
const COLOR_ACTIVE_FILL = "#ef4444";     // red — currently comparing
const COLOR_ACTIVE_STROKE = "#b91c1c";
const COLOR_FOUND_FILL = "#22c55e";      // green — result found
const COLOR_FOUND_STROKE = "#15803d";
const COLOR_EDGE_DEFAULT = "#555";
const COLOR_EDGE_VISITED = "#f59e0b";
const COLOR_EDGE_ACTIVE = "#ef4444";

export function TreeCanvas() {
  /* ── Tree + animation state from context ── */
  const { tree, visitedNodes, activeNode, foundNode } = useBSTAnimation();
  const layout = useMemo(() => (tree ? computeLayout(tree) : []), [tree]);
  const nodeCount = countNodes(tree);
  const height = treeHeight(tree);

  /* Build lookup sets for O(1) membership checks */
  const visitedSet = useMemo(() => new Set(visitedNodes), [visitedNodes]);
  const nodeColor = useCallback(
    (value: number) => {
      if (foundNode === value) return { fill: COLOR_FOUND_FILL, stroke: COLOR_FOUND_STROKE };
      if (activeNode === value) return { fill: COLOR_ACTIVE_FILL, stroke: COLOR_ACTIVE_STROKE };
      if (visitedSet.has(value)) return { fill: COLOR_VISITED_FILL, stroke: COLOR_VISITED_STROKE };
      return { fill: COLOR_DEFAULT_FILL, stroke: COLOR_DEFAULT_STROKE };
    },
    [visitedSet, activeNode, foundNode],
  );

  /* ── Pan / Zoom state ── */
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState<{ x: number; y: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  /* ── Zoom helpers ── */
  const clampZoom = (z: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z));

  const handleWheel = useCallback((e: WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    setZoom((prev) => clampZoom(prev - e.deltaY * 0.001));
  }, []);

  const zoomIn = () => setZoom((z) => clampZoom(z + ZOOM_STEP));
  const zoomOut = () => setZoom((z) => clampZoom(z - ZOOM_STEP));
  const resetView = () => {
    setPan(null); // will re-trigger centering effect
    setZoom(1);
  };

  /* ── Pan (drag) handlers ── */
  const handleMouseDown = useCallback(
    (e: MouseEvent<SVGSVGElement>) => {
      if (e.button !== 0) return; // left button only
      setDragging(true);
      dragStart.current = { x: e.clientX, y: e.clientY, panX: pan?.x ?? 0, panY: pan?.y ?? 0 };
    },
    [pan],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent<SVGSVGElement>) => {
      if (!dragging) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setPan({ x: dragStart.current.panX + dx, y: dragStart.current.panY + dy });
    },
    [dragging],
  );

  const handleMouseUp = useCallback(() => setDragging(false), []);

  /* Release drag if mouse leaves the window */
  useEffect(() => {
    const up = () => setDragging(false);
    window.addEventListener("mouseup", up);
    return () => window.removeEventListener("mouseup", up);
  }, []);

  /* ── Center tree on first render ── */
  const needsCenter = pan === null && layout.length > 0;
  useEffect(() => {
    if (!needsCenter) return;
    const container = containerRef.current ?? svgRef.current?.parentElement;
    const cw = container?.clientWidth ?? window.innerWidth;
    const ch = container?.clientHeight ?? window.innerHeight;
    const xs = layout.map((n) => n.x);
    const ys = layout.map((n) => n.y);
    const minX = Math.min(...xs) - NODE_RADIUS;
    const maxX = Math.max(...xs) + NODE_RADIUS;
    const minY = Math.min(...ys) - NODE_RADIUS;
    const maxY = Math.max(...ys) + NODE_RADIUS;
    const treeW = maxX - minX;
    const treeH = maxY - minY;
    // Use rAF to avoid synchronous setState inside an effect
    const id = requestAnimationFrame(() => {
      setPan({
        x: (cw - treeW) / 2 - minX,
        y: Math.max(30, (ch - treeH) * 0.25) - minY,
      });
    });
    return () => cancelAnimationFrame(id);
  }, [needsCenter, layout]);

  /* ── Edge colour helper ── */
  const edgeColor = useCallback(
    (parentVal: number, childVal: number) => {
      if (activeNode === childVal && visitedSet.has(parentVal)) return COLOR_EDGE_ACTIVE;
      if (visitedSet.has(parentVal) && visitedSet.has(childVal)) return COLOR_EDGE_VISITED;
      return COLOR_EDGE_DEFAULT;
    },
    [visitedSet, activeNode],
  );

  /* ── Render helpers ── */
  const renderEdges = (nodes: LayoutNode[]) =>
    nodes.flatMap((node) =>
      node.children.map((child, i) => (
        <line
          key={`${node.value}-${child.target.value}-${i}`}
          x1={node.x}
          y1={node.y}
          x2={child.target.x}
          y2={child.target.y}
          stroke={edgeColor(node.value, child.target.value)}
          strokeWidth={visitedSet.has(node.value) && visitedSet.has(child.target.value) ? 3 : 2}
          style={{ transition: "stroke 0.4s ease, stroke-width 0.4s ease" }}
        />
      )),
    );

  const renderNodes = (nodes: LayoutNode[]) =>
    nodes.map((node) => {
      const colors = nodeColor(node.value);
      const isActive = activeNode === node.value;
      const isFound = foundNode === node.value;
      const scale = isActive || isFound ? 1.25 : 1;
      return (
        <g key={node.value} style={{ transition: "transform 0.35s ease" }} transform={`translate(${node.x},${node.y})`}>
          <circle
            cx={0}
            cy={0}
            r={NODE_RADIUS * scale}
            fill={colors.fill}
            stroke={colors.stroke}
            strokeWidth={isActive || isFound ? 3 : 2}
            style={{ transition: "fill 0.4s ease, stroke 0.4s ease, r 0.35s ease, stroke-width 0.35s ease" }}
          />
          {/* Glow ring for active / found nodes */}
          {(isActive || isFound) && (
            <circle
              cx={0}
              cy={0}
              r={NODE_RADIUS * scale + 5}
              fill="none"
              stroke={colors.fill}
              strokeWidth={2}
              opacity={0.45}
              style={{ transition: "stroke 0.4s ease, r 0.35s ease" }}
            />
          )}
          <text
            x={0}
            y={0}
            textAnchor="middle"
            dominantBaseline="central"
            fill="#fff"
            fontSize={13}
            fontFamily="PT Sans, sans-serif"
            fontWeight={700}
          >
            {node.value}
          </text>
        </g>
      );
    });

  /* ── Empty state ── */
  if (!tree) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 select-none">
        <TreePine size={64} className="text-text-muted opacity-40" />
        <p className="text-text-muted text-lg font-body">
          No tree exists — use <strong>Create</strong> or <strong>Insert</strong> to get started.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* ── Stats pill (top center, subtle) ── */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 bg-[#00000033] rounded-full px-2.5 py-0.5 select-none pointer-events-none">
        <span className="text-text-muted text-[11px] font-mono">
          N={nodeCount}
        </span>
        <span className="text-text-muted text-[11px]">·</span>
        <span className="text-text-muted text-[11px] font-mono">
          h={height}
        </span>
      </div>

      {/* ── Zoom controls (top right) ── */}
      <div className="absolute top-3 right-4 z-30 flex flex-col gap-1">
        <button
          onClick={zoomIn}
          className="flex items-center justify-center w-8 h-8 rounded bg-[#1a1a2ecc] backdrop-blur-sm border border-border-secondary text-white hover:bg-[#2a2a4e] transition-colors cursor-pointer"
          aria-label="Zoom in"
        >
          <ZoomIn size={16} />
        </button>
        <button
          onClick={zoomOut}
          className="flex items-center justify-center w-8 h-8 rounded bg-[#1a1a2ecc] backdrop-blur-sm border border-border-secondary text-white hover:bg-[#2a2a4e] transition-colors cursor-pointer"
          aria-label="Zoom out"
        >
          <ZoomOut size={16} />
        </button>
        <button
          onClick={resetView}
          className="flex items-center justify-center w-8 h-8 rounded bg-[#1a1a2ecc] backdrop-blur-sm border border-border-secondary text-white hover:bg-[#2a2a4e] transition-colors cursor-pointer"
          aria-label="Reset zoom and position"
          title="Reset"
        >
          <RotateCcw size={14} />
        </button>
        <span className="text-center text-[11px] text-text-muted mt-0.5 font-mono select-none">
          {Math.round(zoom * 100)}%
        </span>
      </div>

      {/* ── SVG Canvas ── */}
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ cursor: dragging ? "grabbing" : "grab" }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <g transform={`translate(${pan?.x ?? 0}, ${pan?.y ?? 0}) scale(${zoom})`}>
          {renderEdges(layout)}
          {renderNodes(layout)}
        </g>
      </svg>
    </>
  );
}
