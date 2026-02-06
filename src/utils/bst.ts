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

/** Remove a value from the BST (immutable — returns a new tree). */
export function bstRemove(root: BSTNode | null, value: number): BSTNode | null {
    if (root === null) return null;
    if (value < root.value) return { ...root, left: bstRemove(root.left, value) };
    if (value > root.value) return { ...root, right: bstRemove(root.right, value) };
    // Found the node to remove
    if (root.left === null) return root.right;
    if (root.right === null) return root.left;
    // Two children — replace with in-order successor (min of right subtree)
    let successor = root.right;
    while (successor.left !== null) successor = successor.left;
    return { ...root, value: successor.value, right: bstRemove(root.right, successor.value) };
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

export const INSERT_CODE: string[] = [
    "if this == null",
    "    create new node",
    "else if value < this.key",
    "    insert to left subtree",
    "else if value > this.key",
    "    insert to right subtree",
    "else duplicate — ignore",
];

export const REMOVE_CODE: string[] = [
    "if this == null",
    "    value not found",
    "else if value < this.key",
    "    search left subtree",
    "else if value > this.key",
    "    search right subtree",
    "else (found node to remove)",
    "    if leaf: just remove",
    "    if one child: bypass",
    "    if two children: find successor",
    "    replace with successor & remove it",
];

export const PREDECESSOR_CODE: string[] = [
    "search for node with value v",
    "if node has left subtree",
    "    predecessor = max of left subtree",
    "else predecessor = last right-turn ancestor",
    "return predecessor",
];

export const SUCCESSOR_CODE: string[] = [
    "search for node with value v",
    "if node has right subtree",
    "    successor = min of right subtree",
    "else successor = last left-turn ancestor",
    "return successor",
];

export const SELECT_CODE: string[] = [
    "function select(node, k)",
    "    leftSize = size(node.left)",
    "    if k <= leftSize",
    "        return select(node.left, k)",
    "    else if k == leftSize + 1",
    "        return node  // found k-th",
    "    else select(node.right, k-leftSize-1)",
];

export const INORDER_CODE: string[] = [
    "function inorder(node)",
    "    if node == null: return",
    "    inorder(node.left)",
    "    visit(node)",
    "    inorder(node.right)",
];

export const PREORDER_CODE: string[] = [
    "function preorder(node)",
    "    if node == null: return",
    "    visit(node)",
    "    preorder(node.left)",
    "    preorder(node.right)",
];

export const POSTORDER_CODE: string[] = [
    "function postorder(node)",
    "    if node == null: return",
    "    postorder(node.left)",
    "    postorder(node.right)",
    "    visit(node)",
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

/* ── Insert step generator ─────────────────────────────────────────── */

export function generateInsertSteps(
    root: BSTNode | null,
    value: number,
): SearchStep[] {
    const steps: SearchStep[] = [];
    const visited: number[] = [];
    let current = root;

    if (current === null) {
        steps.push({
            nodeValue: value,
            statusText: `Tree is empty — create node ${value}.`,
            highlightLine: 1,
            visitedSoFar: [],
            result: "found",
        });
        return steps;
    }

    while (current !== null) {
        visited.push(current.value);

        if (value === current.value) {
            steps.push({
                nodeValue: current.value,
                statusText: `${current.value} == ${value}, duplicate — ignored.`,
                highlightLine: 6,
                visitedSoFar: [...visited],
                result: "not-found",
            });
            return steps;
        } else if (value < current.value) {
            if (current.left === null) {
                steps.push({
                    nodeValue: current.value,
                    statusText: `${value} < ${current.value}, go left — null, insert here.`,
                    highlightLine: 1,
                    visitedSoFar: [...visited],
                });
                steps.push({
                    nodeValue: value,
                    statusText: `Created new node ${value}.`,
                    highlightLine: 1,
                    visitedSoFar: [...visited, value],
                    result: "found",
                });
                return steps;
            } else {
                steps.push({
                    nodeValue: current.value,
                    statusText: `${value} < ${current.value}, go left.`,
                    highlightLine: 3,
                    visitedSoFar: [...visited],
                });
                current = current.left;
            }
        } else {
            if (current.right === null) {
                steps.push({
                    nodeValue: current.value,
                    statusText: `${value} > ${current.value}, go right — null, insert here.`,
                    highlightLine: 1,
                    visitedSoFar: [...visited],
                });
                steps.push({
                    nodeValue: value,
                    statusText: `Created new node ${value}.`,
                    highlightLine: 1,
                    visitedSoFar: [...visited, value],
                    result: "found",
                });
                return steps;
            } else {
                steps.push({
                    nodeValue: current.value,
                    statusText: `${value} > ${current.value}, go right.`,
                    highlightLine: 5,
                    visitedSoFar: [...visited],
                });
                current = current.right;
            }
        }
    }

    return steps;
}

/* ── Remove step generator ─────────────────────────────────────────── */

export function generateRemoveSteps(
    root: BSTNode | null,
    value: number,
): SearchStep[] {
    const steps: SearchStep[] = [];
    const visited: number[] = [];
    let current = root;

    if (!current) {
        steps.push({
            nodeValue: -1,
            statusText: "Tree is empty — nothing to remove.",
            highlightLine: 1,
            visitedSoFar: [],
            result: "not-found",
        });
        return steps;
    }

    // Search phase
    while (current !== null) {
        visited.push(current.value);

        if (current.value === value) {
            // Found the node
            if (current.left === null && current.right === null) {
                steps.push({
                    nodeValue: current.value,
                    statusText: `Found ${value} — it's a leaf, remove it.`,
                    highlightLine: 7,
                    visitedSoFar: [...visited],
                    result: "found",
                });
            } else if (current.left === null || current.right === null) {
                const child = current.left ?? current.right;
                steps.push({
                    nodeValue: current.value,
                    statusText: `Found ${value} — one child (${child!.value}), bypass node.`,
                    highlightLine: 8,
                    visitedSoFar: [...visited],
                    result: "found",
                });
            } else {
                // Two children — find successor
                steps.push({
                    nodeValue: current.value,
                    statusText: `Found ${value} — two children, find in-order successor.`,
                    highlightLine: 9,
                    visitedSoFar: [...visited],
                });
                let succ = current.right;
                while (succ.left !== null) {
                    visited.push(succ.value);
                    steps.push({
                        nodeValue: succ.value,
                        statusText: `Go left to find successor...`,
                        highlightLine: 9,
                        visitedSoFar: [...visited],
                    });
                    succ = succ.left;
                }
                visited.push(succ.value);
                steps.push({
                    nodeValue: succ.value,
                    statusText: `Successor is ${succ.value}. Replace ${value} with ${succ.value} and remove ${succ.value}.`,
                    highlightLine: 10,
                    visitedSoFar: [...visited],
                    result: "found",
                });
            }
            return steps;
        } else if (value < current.value) {
            steps.push({
                nodeValue: current.value,
                statusText: `${value} < ${current.value}, go left.`,
                highlightLine: 3,
                visitedSoFar: [...visited],
            });
            current = current.left;
        } else {
            steps.push({
                nodeValue: current.value,
                statusText: `${value} > ${current.value}, go right.`,
                highlightLine: 5,
                visitedSoFar: [...visited],
            });
            current = current.right;
        }
    }

    steps.push({
        nodeValue: -1,
        statusText: `Value ${value} not found in tree.`,
        highlightLine: 1,
        visitedSoFar: [...visited],
        result: "not-found",
    });
    return steps;
}

/* ── Predecessor step generator ────────────────────────────────────── */

export function generatePredecessorSteps(
    root: BSTNode | null,
    value: number,
): SearchStep[] {
    const steps: SearchStep[] = [];
    const visited: number[] = [];
    let current = root;
    let lastRightTurn: BSTNode | null = null;
    let target: BSTNode | null = null;

    // Search for the node
    while (current !== null) {
        visited.push(current.value);
        if (current.value === value) {
            target = current;
            steps.push({
                nodeValue: current.value,
                statusText: `Found node ${value}.`,
                highlightLine: 0,
                visitedSoFar: [...visited],
            });
            break;
        } else if (value < current.value) {
            steps.push({
                nodeValue: current.value,
                statusText: `${value} < ${current.value}, go left.`,
                highlightLine: 0,
                visitedSoFar: [...visited],
            });
            current = current.left;
        } else {
            lastRightTurn = current;
            steps.push({
                nodeValue: current.value,
                statusText: `${value} > ${current.value}, go right (mark as potential predecessor).`,
                highlightLine: 0,
                visitedSoFar: [...visited],
            });
            current = current.right;
        }
    }

    if (!target) {
        steps.push({
            nodeValue: -1,
            statusText: `Value ${value} not found in tree.`,
            highlightLine: 0,
            visitedSoFar: [...visited],
            result: "not-found",
        });
        return steps;
    }

    // Case 1: has left subtree — predecessor is max of left subtree
    if (target.left !== null) {
        steps.push({
            nodeValue: target.value,
            statusText: `Node has left subtree — predecessor is max of left subtree.`,
            highlightLine: 1,
            visitedSoFar: [...visited],
        });
        let pred = target.left;
        visited.push(pred.value);
        while (pred.right !== null) {
            steps.push({
                nodeValue: pred.value,
                statusText: `Go right to find max...`,
                highlightLine: 2,
                visitedSoFar: [...visited],
            });
            pred = pred.right;
            visited.push(pred.value);
        }
        steps.push({
            nodeValue: pred.value,
            statusText: `Predecessor of ${value} is ${pred.value}.`,
            highlightLine: 4,
            visitedSoFar: [...visited],
            result: "found",
        });
    } else if (lastRightTurn !== null) {
        // Case 2: no left subtree — predecessor is last right-turn ancestor
        steps.push({
            nodeValue: lastRightTurn.value,
            statusText: `No left subtree. Predecessor is last right-turn ancestor: ${lastRightTurn.value}.`,
            highlightLine: 3,
            visitedSoFar: [...visited],
            result: "found",
        });
    } else {
        steps.push({
            nodeValue: -1,
            statusText: `No predecessor exists for ${value}.`,
            highlightLine: 4,
            visitedSoFar: [...visited],
            result: "not-found",
        });
    }

    return steps;
}

/* ── Successor step generator ──────────────────────────────────────── */

export function generateSuccessorSteps(
    root: BSTNode | null,
    value: number,
): SearchStep[] {
    const steps: SearchStep[] = [];
    const visited: number[] = [];
    let current = root;
    let lastLeftTurn: BSTNode | null = null;
    let target: BSTNode | null = null;

    // Search for the node
    while (current !== null) {
        visited.push(current.value);
        if (current.value === value) {
            target = current;
            steps.push({
                nodeValue: current.value,
                statusText: `Found node ${value}.`,
                highlightLine: 0,
                visitedSoFar: [...visited],
            });
            break;
        } else if (value > current.value) {
            steps.push({
                nodeValue: current.value,
                statusText: `${value} > ${current.value}, go right.`,
                highlightLine: 0,
                visitedSoFar: [...visited],
            });
            current = current.right;
        } else {
            lastLeftTurn = current;
            steps.push({
                nodeValue: current.value,
                statusText: `${value} < ${current.value}, go left (mark as potential successor).`,
                highlightLine: 0,
                visitedSoFar: [...visited],
            });
            current = current.left;
        }
    }

    if (!target) {
        steps.push({
            nodeValue: -1,
            statusText: `Value ${value} not found in tree.`,
            highlightLine: 0,
            visitedSoFar: [...visited],
            result: "not-found",
        });
        return steps;
    }

    // Case 1: has right subtree — successor is min of right subtree
    if (target.right !== null) {
        steps.push({
            nodeValue: target.value,
            statusText: `Node has right subtree — successor is min of right subtree.`,
            highlightLine: 1,
            visitedSoFar: [...visited],
        });
        let succ = target.right;
        visited.push(succ.value);
        while (succ.left !== null) {
            steps.push({
                nodeValue: succ.value,
                statusText: `Go left to find min...`,
                highlightLine: 2,
                visitedSoFar: [...visited],
            });
            succ = succ.left;
            visited.push(succ.value);
        }
        steps.push({
            nodeValue: succ.value,
            statusText: `Successor of ${value} is ${succ.value}.`,
            highlightLine: 4,
            visitedSoFar: [...visited],
            result: "found",
        });
    } else if (lastLeftTurn !== null) {
        // Case 2: no right subtree — successor is last left-turn ancestor
        steps.push({
            nodeValue: lastLeftTurn.value,
            statusText: `No right subtree. Successor is last left-turn ancestor: ${lastLeftTurn.value}.`,
            highlightLine: 3,
            visitedSoFar: [...visited],
            result: "found",
        });
    } else {
        steps.push({
            nodeValue: -1,
            statusText: `No successor exists for ${value}.`,
            highlightLine: 4,
            visitedSoFar: [...visited],
            result: "not-found",
        });
    }

    return steps;
}

/* ── Select (k-th smallest) step generator ─────────────────────────── */

export function generateSelectSteps(
    root: BSTNode | null,
    k: number,
): SearchStep[] {
    const steps: SearchStep[] = [];
    const visited: number[] = [];

    if (!root || k < 1 || k > countNodes(root)) {
        steps.push({
            nodeValue: -1,
            statusText: k < 1 ? `k must be >= 1.` : `k=${k} is out of range (tree has ${countNodes(root)} nodes).`,
            highlightLine: 0,
            visitedSoFar: [],
            result: "not-found",
        });
        return steps;
    }

    let found = false;

    function walk(node: BSTNode | null, remaining: number): number {
        if (!node || found) return remaining;

        // Go left
        const leftSize = countNodes(node.left);
        visited.push(node.value);

        if (remaining <= leftSize) {
            steps.push({
                nodeValue: node.value,
                statusText: `k=${remaining}, left subtree has ${leftSize} nodes — go left.`,
                highlightLine: 3,
                visitedSoFar: [...visited],
            });
            return walk(node.left, remaining);
        } else if (remaining === leftSize + 1) {
            steps.push({
                nodeValue: node.value,
                statusText: `k=${remaining}, left subtree has ${leftSize} nodes — this is the ${k}-th smallest: ${node.value}!`,
                highlightLine: 5,
                visitedSoFar: [...visited],
                result: "found",
            });
            found = true;
            return 0;
        } else {
            steps.push({
                nodeValue: node.value,
                statusText: `k=${remaining}, left subtree has ${leftSize} nodes — go right with k=${remaining - leftSize - 1}.`,
                highlightLine: 6,
                visitedSoFar: [...visited],
            });
            return walk(node.right, remaining - leftSize - 1);
        }
    }

    walk(root, k);
    return steps;
}

/* ── Traversal step generators ─────────────────────────────────────── */

export function generateInorderSteps(root: BSTNode | null): SearchStep[] {
    const steps: SearchStep[] = [];
    const visited: number[] = [];

    function walk(node: BSTNode | null) {
        if (!node) return;
        walk(node.left);
        visited.push(node.value);
        steps.push({
            nodeValue: node.value,
            statusText: `Visit ${node.value}`,
            highlightLine: 3,
            visitedSoFar: [...visited],
        });
        walk(node.right);
    }

    walk(root);

    if (steps.length > 0) {
        steps[steps.length - 1].result = "found";
        steps[steps.length - 1].statusText += " — traversal complete.";
    } else {
        steps.push({
            nodeValue: -1,
            statusText: "Tree is empty.",
            highlightLine: 1,
            visitedSoFar: [],
            result: "not-found",
        });
    }
    return steps;
}

export function generatePreorderSteps(root: BSTNode | null): SearchStep[] {
    const steps: SearchStep[] = [];
    const visited: number[] = [];

    function walk(node: BSTNode | null) {
        if (!node) return;
        visited.push(node.value);
        steps.push({
            nodeValue: node.value,
            statusText: `Visit ${node.value}`,
            highlightLine: 2,
            visitedSoFar: [...visited],
        });
        walk(node.left);
        walk(node.right);
    }

    walk(root);

    if (steps.length > 0) {
        steps[steps.length - 1].result = "found";
        steps[steps.length - 1].statusText += " — traversal complete.";
    } else {
        steps.push({
            nodeValue: -1,
            statusText: "Tree is empty.",
            highlightLine: 1,
            visitedSoFar: [],
            result: "not-found",
        });
    }
    return steps;
}

export function generatePostorderSteps(root: BSTNode | null): SearchStep[] {
    const steps: SearchStep[] = [];
    const visited: number[] = [];

    function walk(node: BSTNode | null) {
        if (!node) return;
        walk(node.left);
        walk(node.right);
        visited.push(node.value);
        steps.push({
            nodeValue: node.value,
            statusText: `Visit ${node.value}`,
            highlightLine: 4,
            visitedSoFar: [...visited],
        });
    }

    walk(root);

    if (steps.length > 0) {
        steps[steps.length - 1].result = "found";
        steps[steps.length - 1].statusText += " — traversal complete.";
    } else {
        steps.push({
            nodeValue: -1,
            statusText: "Tree is empty.",
            highlightLine: 1,
            visitedSoFar: [],
            result: "not-found",
        });
    }
    return steps;
}

/* ── Remove operation ──────────────────────────────────────────────── */

export const REMOVE_CODE: string[] = [
    "if this == null",
    "    return null           // not found",
    "else if this.key < v",
    "    this.right = remove(right, v)",
    "else if this.key > v",
    "    this.left = remove(left, v)",
    "else                      // found node",
    "    if leaf: just delete",
    "    if one child: bypass",
    "    if two children:",
    "      find successor, swap, remove",
];

/** Remove a value from the BST (immutable — returns a new tree). */
export function bstRemove(root: BSTNode | null, value: number): BSTNode | null {
    if (root === null) return null;
    if (value < root.value) return { ...root, left: bstRemove(root.left, value) };
    if (value > root.value) return { ...root, right: bstRemove(root.right, value) };
    // Found the node
    if (root.left === null && root.right === null) return null;        // leaf
    if (root.left === null) return root.right;                         // one child (right)
    if (root.right === null) return root.left;                         // one child (left)
    // Two children — replace with in-order successor (min of right subtree)
    let successor = root.right;
    while (successor.left !== null) successor = successor.left;
    return { ...root, value: successor.value, right: bstRemove(root.right, successor.value) };
}

/** Find the in-order successor (min of right subtree). */
function findMin(node: BSTNode): BSTNode {
    let current = node;
    while (current.left !== null) current = current.left;
    return current;
}

/** Generate animation steps for the remove operation. */
export function generateRemoveSteps(
    root: BSTNode | null,
    target: number,
): SearchStep[] {
    const steps: SearchStep[] = [];
    const visited: number[] = [];

    function walkToTarget(node: BSTNode | null): void {
        if (node === null) {
            steps.push({
                nodeValue: -1,
                statusText: `Value ${target} is not in the BST.`,
                highlightLine: 1,
                visitedSoFar: [...visited],
                result: "not-found",
            });
            return;
        }

        visited.push(node.value);

        if (target < node.value) {
            steps.push({
                nodeValue: node.value,
                statusText: `${target} < ${node.value}, go left`,
                highlightLine: 4,
                visitedSoFar: [...visited],
            });
            walkToTarget(node.left);
        } else if (target > node.value) {
            steps.push({
                nodeValue: node.value,
                statusText: `${target} > ${node.value}, go right`,
                highlightLine: 2,
                visitedSoFar: [...visited],
            });
            walkToTarget(node.right);
        } else {
            // Found the node to remove
            if (node.left === null && node.right === null) {
                // Leaf node
                steps.push({
                    nodeValue: node.value,
                    statusText: `Found ${node.value} — it's a leaf, simply delete it.`,
                    highlightLine: 7,
                    visitedSoFar: [...visited],
                    result: "found",
                });
            } else if (node.left === null) {
                // One child (right only)
                steps.push({
                    nodeValue: node.value,
                    statusText: `Found ${node.value} — has only right child, bypass with right subtree.`,
                    highlightLine: 8,
                    visitedSoFar: [...visited],
                    result: "found",
                });
            } else if (node.right === null) {
                // One child (left only)
                steps.push({
                    nodeValue: node.value,
                    statusText: `Found ${node.value} — has only left child, bypass with left subtree.`,
                    highlightLine: 8,
                    visitedSoFar: [...visited],
                    result: "found",
                });
            } else {
                // Two children
                const succ = findMin(node.right);
                steps.push({
                    nodeValue: node.value,
                    statusText: `Found ${node.value} — has two children. Finding in-order successor…`,
                    highlightLine: 9,
                    visitedSoFar: [...visited],
                });

                // Walk to successor
                let cur = node.right;
                while (cur.left !== null) {
                    visited.push(cur.value);
                    steps.push({
                        nodeValue: cur.value,
                        statusText: `Looking for successor: ${cur.value} has left child, go left`,
                        highlightLine: 10,
                        visitedSoFar: [...visited],
                    });
                    cur = cur.left;
                }
                visited.push(cur.value);
                steps.push({
                    nodeValue: cur.value,
                    statusText: `Successor is ${succ.value}. Swap ${node.value} with ${succ.value}, then remove ${succ.value}.`,
                    highlightLine: 10,
                    visitedSoFar: [...visited],
                    result: "found",
                });
            }
        }
    }

    walkToTarget(root);
    return steps;
}
