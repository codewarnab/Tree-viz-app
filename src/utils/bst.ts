/* ── BST Data Structure & Layout Utilities ─────────────────────────── */

export interface BSTNode {
    value: number;
    left: BSTNode | null;
    right: BSTNode | null;
}

/** Insert a value into the BST (immutable — returns a new tree). */
export function bstInsert(root: BSTNode | null, value: number): BSTNode {
    if (root === null) return { value, left: null, right: null };
    if (value < root.value) return { ...root, left: bstInsert(root.left, value) };
    if (value > root.value) return { ...root, right: bstInsert(root.right, value) };
    return root; // duplicate — ignore
}

/** Build a BST from an array of values. */
export function buildBST(values: number[]): BSTNode | null {
    let root: BSTNode | null = null;
    for (const v of values) root = bstInsert(root, v);
    return root;
}

/** Count nodes in the tree. */
export function countNodes(root: BSTNode | null): number {
    if (!root) return 0;
    return 1 + countNodes(root.left) + countNodes(root.right);
}

/** Height of the tree (0 for a single node, -1 for null). */
export function treeHeight(root: BSTNode | null): number {
    if (!root) return -1;
    return 1 + Math.max(treeHeight(root.left), treeHeight(root.right));
}

/* ── Layout computation ────────────────────────────────────────────── */

export interface LayoutNode {
    value: number;
    x: number;
    y: number;
    children: { target: LayoutNode }[];
}

const H_GAP = 70; // horizontal gap between consecutive in-order nodes
const V_GAP = 70; // vertical gap between depth levels

/**
 * Convert a BSTNode tree into a flat-friendly layout.
 * Uses in-order index for x and depth for y.
 */
export function computeLayout(root: BSTNode | null): LayoutNode[] {
    if (!root) return [];

    const nodes: LayoutNode[] = [];
    let inorderIdx = 0;

    function walk(node: BSTNode, depth: number): LayoutNode {
        let leftLayout: LayoutNode | null = null;
        let rightLayout: LayoutNode | null = null;

        if (node.left) leftLayout = walk(node.left, depth + 1);

        const x = inorderIdx * H_GAP;
        const y = depth * V_GAP;
        inorderIdx++;

        if (node.right) rightLayout = walk(node.right, depth + 1);

        const layoutNode: LayoutNode = {
            value: node.value,
            x,
            y,
            children: [],
        };

        if (leftLayout) layoutNode.children.push({ target: leftLayout });
        if (rightLayout) layoutNode.children.push({ target: rightLayout });

        nodes.push(layoutNode);
        return layoutNode;
    }

    walk(root, 0);
    return nodes;
}

/** Sample BST values for showcasing (matches VisualGo-style demo). */
export const SAMPLE_BST_VALUES = [
    50, 25, 75, 12, 37, 62, 87, 6, 18, 30, 43, 56, 68, 81, 93,
];

/* ── Search Animation Step Types ───────────────────────────────────── */

export interface SearchStep {
    /** The node being visited (-1 for null / not-found terminal step) */
    nodeValue: number;
    /** Human-readable status text for this step */
    statusText: string;
    /** 0-based index of the pseudocode line to highlight */
    highlightLine: number;
    /** Set of node values visited so far (accumulated) */
    visitedSoFar: number[];
    /** Whether this is a terminal step */
    result?: "found" | "not-found";
}

/* ── Pseudocode lines ──────────────────────────────────────────────── */

export const SEARCH_CODE: string[] = [
    "if this == null",
    "    return null",
    "else if this.key == search value",
    "    return this",
    "else if this.key < search value",
    "    search right",
    "else search left",
];

export const LOWER_BOUND_CODE: string[] = [
    "result = null",
    "if this == null",
    "    return result",
    "else if this.key >= search value",
    "    result = this.key",
    "    search left (try smaller)",
    "else search right",
];

export const MIN_MAX_CODE: string[] = [
    "if this == null",
    "    return null",
    "else if target child == null",
    "    return this",
    "else go to target child",
];

/* ── Search step generators ────────────────────────────────────────── */

export function generateExactSearchSteps(
    root: BSTNode | null,
    target: number,
): SearchStep[] {
    const steps: SearchStep[] = [];
    const visited: number[] = [];
    let current = root;

    while (current !== null) {
        visited.push(current.value);

        if (current.value === target) {
            steps.push({
                nodeValue: current.value,
                statusText: `${current.value} == ${target}, found!`,
                highlightLine: 3,
                visitedSoFar: [...visited],
                result: "found",
            });
            return steps;
        } else if (current.value < target) {
            steps.push({
                nodeValue: current.value,
                statusText: `${current.value} < ${target}, go right`,
                highlightLine: 5,
                visitedSoFar: [...visited],
            });
            current = current.right;
        } else {
            steps.push({
                nodeValue: current.value,
                statusText: `${current.value} > ${target}, go left`,
                highlightLine: 6,
                visitedSoFar: [...visited],
            });
            current = current.left;
        }
    }

    steps.push({
        nodeValue: -1,
        statusText: `Value ${target} is not found.`,
        highlightLine: 1,
        visitedSoFar: [...visited],
        result: "not-found",
    });
    return steps;
}

export function generateLowerBoundSteps(
    root: BSTNode | null,
    target: number,
): SearchStep[] {
    const steps: SearchStep[] = [];
    const visited: number[] = [];
    let current = root;
    let bestSoFar: number | null = null;

    while (current !== null) {
        visited.push(current.value);

        if (current.value >= target) {
            bestSoFar = current.value;
            steps.push({
                nodeValue: current.value,
                statusText: `${current.value} >= ${target}, update result=${current.value}, go left`,
                highlightLine: 5,
                visitedSoFar: [...visited],
            });
            current = current.left;
        } else {
            steps.push({
                nodeValue: current.value,
                statusText: `${current.value} < ${target}, go right`,
                highlightLine: 6,
                visitedSoFar: [...visited],
            });
            current = current.right;
        }
    }

    steps.push({
        nodeValue: bestSoFar ?? -1,
        statusText:
            bestSoFar !== null
                ? `Lower bound of ${target} is ${bestSoFar}.`
                : `No lower bound found for ${target}.`,
        highlightLine: 2,
        visitedSoFar: [...visited],
        result: bestSoFar !== null ? "found" : "not-found",
    });
    return steps;
}

export function generateMinSteps(root: BSTNode | null): SearchStep[] {
    const steps: SearchStep[] = [];
    const visited: number[] = [];
    let current = root;

    if (!current) {
        steps.push({
            nodeValue: -1,
            statusText: "Tree is empty.",
            highlightLine: 1,
            visitedSoFar: [],
            result: "not-found",
        });
        return steps;
    }

    while (current.left !== null) {
        visited.push(current.value);
        steps.push({
            nodeValue: current.value,
            statusText: `${current.value} has left child, go left`,
            highlightLine: 4,
            visitedSoFar: [...visited],
        });
        current = current.left;
    }

    visited.push(current.value);
    steps.push({
        nodeValue: current.value,
        statusText: `${current.value} has no left child — minimum found!`,
        highlightLine: 3,
        visitedSoFar: [...visited],
        result: "found",
    });
    return steps;
}

export function generateMaxSteps(root: BSTNode | null): SearchStep[] {
    const steps: SearchStep[] = [];
    const visited: number[] = [];
    let current = root;

    if (!current) {
        steps.push({
            nodeValue: -1,
            statusText: "Tree is empty.",
            highlightLine: 1,
            visitedSoFar: [],
            result: "not-found",
        });
        return steps;
    }

    while (current.right !== null) {
        visited.push(current.value);
        steps.push({
            nodeValue: current.value,
            statusText: `${current.value} has right child, go right`,
            highlightLine: 4,
            visitedSoFar: [...visited],
        });
        current = current.right;
    }

    visited.push(current.value);
    steps.push({
        nodeValue: current.value,
        statusText: `${current.value} has no right child — maximum found!`,
        highlightLine: 3,
        visitedSoFar: [...visited],
        result: "found",
    });
    return steps;
}
