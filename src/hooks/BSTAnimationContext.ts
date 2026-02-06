import { createContext } from "react";
import type { BSTNode } from "../utils/bst";

/* ── Types ─────────────────────────────────────────────────────────── */

export type SearchMode = "exact" | "lower_bound" | "min" | "max";

export interface BSTAnimationState {
    /* Tree data */
    tree: BSTNode | null;

    /* Animation playback */
    isAnimating: boolean;
    /** Nodes visited so far (dimmed highlight) */
    visitedNodes: number[];
    /** The node currently being compared (bright highlight) */
    activeNode: number | null;
    /** The final result node (green highlight when done) */
    foundNode: number | null;

    /* Info panel content */
    infoPanelOpen: boolean;
    statusText: string;
    codeLines: string[];
    highlightIndex: number;
    operationLabel: string;

    /* Operations panel */
    operationsPanelOpen: boolean;

    /* Actions */
    startSearch: (value: number, mode: SearchMode) => void;
    startRemove: (value: number) => void;
    setTree: (tree: BSTNode | null) => void;
    setOperationsPanelOpen: (open: boolean) => void;
    setInfoPanelOpen: (open: boolean) => void;
}

/* ── Context ───────────────────────────────────────────────────────── */

export const BSTAnimationContext = createContext<BSTAnimationState | null>(null);
