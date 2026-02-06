import {
    useState,
    useCallback,
    useRef,
    type ReactNode,
} from "react";
import {
    type BSTNode,
    type SearchStep,
    buildBST,
    SAMPLE_BST_VALUES,
    SEARCH_CODE,
    LOWER_BOUND_CODE,
    MIN_MAX_CODE,
    generateExactSearchSteps,
    generateLowerBoundSteps,
    generateMinSteps,
    generateMaxSteps,
} from "../utils/bst";
import { BSTAnimationContext, type SearchMode, type BSTAnimationState } from "./BSTAnimationContext";

/* ── Default / idle values ─────────────────────────────────────────── */

const IDLE_STATUS = "";
const IDLE_CODE: string[] = [];
const IDLE_HIGHLIGHT = -1;


/* ── Provider ──────────────────────────────────────────────────────── */

export function BSTAnimationProvider({ children }: { children: ReactNode }) {
    /* ── Tree ── */
    const [tree, setTree] = useState<BSTNode | null>(() => buildBST(SAMPLE_BST_VALUES));

    /* ── Panel visibility ── */
    const [infoPanelOpen, setInfoPanelOpen] = useState(false);
    const [operationsPanelOpen, setOperationsPanelOpen] = useState(true);

    /* ── Animation state ── */
    const [isAnimating, setIsAnimating] = useState(false);
    const [visitedNodes, setVisitedNodes] = useState<number[]>([]);
    const [activeNode, setActiveNode] = useState<number | null>(null);
    const [foundNode, setFoundNode] = useState<number | null>(null);

    /* ── Info panel content ── */
    const [statusText, setStatusText] = useState(IDLE_STATUS);
    const [codeLines, setCodeLines] = useState<string[]>(IDLE_CODE);
    const [highlightIndex, setHighlightIndex] = useState(IDLE_HIGHLIGHT);
    const [operationLabel, setOperationLabel] = useState("");

    /* ── Timer ref for cleanup ── */
    const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

    const clearTimers = useCallback(() => {
        timerRef.current.forEach(clearTimeout);
        timerRef.current = [];
    }, []);

    /* ── Core: play search steps ─────────────────────────────────────── */

    const playSteps = useCallback(
        (steps: SearchStep[], stepDelay: number) => {
            clearTimers();
            setIsAnimating(true);
            setVisitedNodes([]);
            setActiveNode(null);
            setFoundNode(null);

            steps.forEach((step, idx) => {
                const timerId = setTimeout(() => {
                    /* Update visited trail (accumulated) */
                    setVisitedNodes(step.visitedSoFar);

                    /* Active (bright) node */
                    setActiveNode(step.nodeValue >= 0 ? step.nodeValue : null);

                    /* Info panel text */
                    setStatusText(step.statusText);
                    setHighlightIndex(step.highlightLine);

                    /* Last step — mark result */
                    if (idx === steps.length - 1) {
                        if (step.result === "found" && step.nodeValue >= 0) {
                            setFoundNode(step.nodeValue);
                        }
                        /* Small delay then stop animating */
                        const doneTimer = setTimeout(() => {
                            setIsAnimating(false);
                            setActiveNode(null);
                        }, stepDelay);
                        timerRef.current.push(doneTimer);
                    }
                }, idx * stepDelay);

                timerRef.current.push(timerId);
            });
        },
        [clearTimers],
    );

    /* ── startSearch action ──────────────────────────────────────────── */

    const startSearch = useCallback(
        (value: number, mode: SearchMode) => {
            /* Clean up any running animation */
            clearTimers();
            setFoundNode(null);
            setVisitedNodes([]);

            /* Generate steps & pick pseudocode */
            let steps: SearchStep[];
            let code: string[];
            let label: string;

            switch (mode) {
                case "exact":
                    steps = generateExactSearchSteps(tree, value);
                    code = SEARCH_CODE;
                    label = `Search(${value})`;
                    break;
                case "lower_bound":
                    steps = generateLowerBoundSteps(tree, value);
                    code = LOWER_BOUND_CODE;
                    label = `LowerBound(${value})`;
                    break;
                case "min":
                    steps = generateMinSteps(tree);
                    code = MIN_MAX_CODE;
                    label = "FindMin()";
                    break;
                case "max":
                    steps = generateMaxSteps(tree);
                    code = MIN_MAX_CODE;
                    label = "FindMax()";
                    break;
            }

            if (steps.length === 0) return;

            /* Set code & label */
            setCodeLines(code);
            setOperationLabel(label);

            /* Close operations panel, open info panel */
            setOperationsPanelOpen(false);
            setInfoPanelOpen(true);

            /* Begin playback after a short delay so panel animation starts first */
            const kickoff = setTimeout(() => {
                playSteps(steps, 1000);
            }, 350);
            timerRef.current.push(kickoff);
        },
        [tree, clearTimers, playSteps],
    );

    /* ── Context value ── */

    const value: BSTAnimationState = {
        tree,
        isAnimating,
        visitedNodes,
        activeNode,
        foundNode,
        infoPanelOpen,
        statusText,
        codeLines,
        highlightIndex,
        operationLabel,
        operationsPanelOpen,
        startSearch,
        setTree,
        setOperationsPanelOpen,
        setInfoPanelOpen,
    };

    return (
        <BSTAnimationContext.Provider value={value}>
            {children}
        </BSTAnimationContext.Provider>
    );
}

