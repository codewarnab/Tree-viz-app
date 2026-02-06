import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useBSTAnimation } from "../../hooks";

const PANEL_COLORS = [
    "#32CD32", // lime green
    "#FF69B4", // pink
    "#FF8C00", // orange
    "#FFD700", // yellow (gold)
    "#4169E1", // royal blue
    "#FF6347", // tomato
    "#00CED1", // dark turquoise
    "#9370DB", // medium purple
];

const INITIAL_BG_COLOR = PANEL_COLORS[Math.floor(Math.random() * PANEL_COLORS.length)]!;

type OperationKey =
    | "toggle"
    | "create"
    | "search"
    | "insert"
    | "remove"
    | "predsucc"
    | "select"
    | "traverse";

const OPERATIONS: { key: OperationKey; label: string }[] = [
    { key: "toggle", label: "Toggle BST Layout" },
    { key: "create", label: "Create" },
    { key: "search", label: "Search(v)" },
    { key: "insert", label: "Insert(v)" },
    { key: "remove", label: "Remove(v)" },
    { key: "predsucc", label: "Predec-/Succ-essor(v)" },
    { key: "select", label: "Select(k)" },
    { key: "traverse", label: "Traverse(root)" },
];

/* ── Shared styles for sub-menu action buttons ─────────────────────── */
const actionBtnClass =
    "px-3 py-1 text-[11px] font-bold border-none cursor-pointer hover:opacity-80 transition-opacity whitespace-nowrap";

const inputClass =
    "px-2 py-1 text-[11px] text-white border-none outline-none min-w-[80px]";
const inputStyle = { backgroundColor: "#000" };

/* ── Sub-menu renderers ────────────────────────────────────────────── */

function CreateSubMenu({ color }: { color: string }) {
    const [n, setN] = useState("18");
    const btnStyle = { backgroundColor: color, color: "#000" };
    return (
        <div className="flex items-center gap-1.5">
            <button className={actionBtnClass} style={btnStyle}>Empty</button>
            <button className={actionBtnClass} style={btnStyle}>Examples</button>
            <span className="text-[11px] font-bold whitespace-nowrap text-black">N =</span>
            <input
                className={inputClass}
                style={{ ...inputStyle, width: 48 }}
                value={n}
                onChange={(e) => setN(e.target.value)}
            />
            <button className={actionBtnClass} style={btnStyle}>Random</button>
            <button className={actionBtnClass} style={btnStyle}>Skewed</button>
        </div>
    );
}

function SearchSubMenu({
    color,
    onSearch,
}: {
    color: string;
    onSearch: (value: number, mode: "exact" | "lower_bound" | "min" | "max") => void;
}) {
    const [val, setVal] = useState("50");
    const btnStyle = { backgroundColor: color, color: "#000" };
    return (
        <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold whitespace-nowrap text-black">v =</span>
            <input
                className={inputClass}
                style={inputStyle}
                value={val}
                onChange={(e) => setVal(e.target.value)}
            />
            <button
                className={actionBtnClass}
                style={btnStyle}
                onClick={() => {
                    const n = Number(val);
                    if (!Number.isNaN(n)) onSearch(n, "exact");
                }}
            >
                Exact
            </button>
            <button
                className={actionBtnClass}
                style={btnStyle}
                onClick={() => {
                    const n = Number(val);
                    if (!Number.isNaN(n)) onSearch(n, "lower_bound");
                }}
            >
                lower_bound
            </button>
            <span className="text-[11px] font-bold whitespace-nowrap text-black">Extreme:</span>
            <button
                className={actionBtnClass}
                style={btnStyle}
                onClick={() => onSearch(0, "min")}
            >
                Min
            </button>
            <button
                className={actionBtnClass}
                style={btnStyle}
                onClick={() => onSearch(0, "max")}
            >
                Max
            </button>
        </div>
    );
}

function ValueInputSubMenu({ label = "v", color }: { label?: string; color: string }) {
    const [val, setVal] = useState("");
    const btnStyle = { backgroundColor: color, color: "#000" };
    return (
        <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold whitespace-nowrap text-black">{label} =</span>
            <input
                className={inputClass}
                style={inputStyle}
                value={val}
                onChange={(e) => setVal(e.target.value)}
                placeholder=""
            />
            <button className={actionBtnClass} style={btnStyle}>Go</button>
        </div>
    );
}

function PredSuccSubMenu({ color }: { color: string }) {
    const [val, setVal] = useState("");
    const btnStyle = { backgroundColor: color, color: "#000" };
    return (
        <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold whitespace-nowrap text-black">v =</span>
            <input
                className={inputClass}
                style={{ ...inputStyle, width: 52 }}
                value={val}
                onChange={(e) => setVal(e.target.value)}
            />
            <button className={actionBtnClass} style={btnStyle}>Get Predecessor</button>
            <button className={actionBtnClass} style={btnStyle}>Get Successor</button>
        </div>
    );
}

function TraverseSubMenu({ color }: { color: string }) {
    const btnStyle = { backgroundColor: color, color: "#000" };
    return (
        <div className="flex items-center gap-1.5">
            <button className={actionBtnClass} style={btnStyle}>Inorder(root)</button>
            <button className={actionBtnClass} style={btnStyle}>Preorder(root)</button>
            <button className={actionBtnClass} style={btnStyle}>Postorder(root)</button>
        </div>
    );
}

function SubMenuContent({
    opKey,
    color,
    onSearch,
}: {
    opKey: OperationKey;
    color: string;
    onSearch: (value: number, mode: "exact" | "lower_bound" | "min" | "max") => void;
}) {
    switch (opKey) {
        case "create":
            return <CreateSubMenu color={color} />;
        case "search":
            return <SearchSubMenu color={color} onSearch={onSearch} />;
        case "insert":
        case "remove":
            return <ValueInputSubMenu label="v" color={color} />;
        case "select":
            return <ValueInputSubMenu label="k" color={color} />;
        case "predsucc":
            return <PredSuccSubMenu color={color} />;
        case "traverse":
            return <TraverseSubMenu color={color} />;
        default:
            return null;
    }
}

export function OperationsPanel() {
    const {
        operationsPanelOpen: isOpen,
        setOperationsPanelOpen: setIsOpen,
        startSearch,
        isAnimating,
    } = useBSTAnimation();
    const [activeOp, setActiveOp] = useState<OperationKey | null>(null);

    // Pick a random color on mount (changes on refresh)
    const bgColor = INITIAL_BG_COLOR;

    const handleSearch = (value: number, mode: "exact" | "lower_bound" | "min" | "max") => {
        if (isAnimating) return; // don't start a new search while one is running
        setActiveOp(null); // close sub-menu
        startSearch(value, mode);
    };

    return (
        <div className="fixed left-0 bottom-[50px] z-40 flex items-start">
            {/* Collapse / Expand toggle — fixed height so it stays the same when panel collapses */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center w-10 cursor-pointer border-none transition-opacity hover:opacity-80 shrink-0"
                style={{ backgroundColor: bgColor, height: 222 }}
                aria-label={isOpen ? "Collapse panel" : "Expand panel"}
            >
                <motion.span
                    animate={{ rotate: isOpen ? 0 : 180 }}
                    transition={{ duration: 0.25 }}
                    className="flex items-center justify-center text-white"
                >
                    <ChevronLeft size={18} />
                </motion.span>
            </button>

            {/* Gap between toggle and panel */}
            <div className="w-1.5 shrink-0" />

            {/* Panel */}
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "auto", opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="overflow-visible"
                    >
                        <nav
                            className="flex flex-col py-2 gap-0 justify-center"
                        >
                            {OPERATIONS.map((op) => (
                                <div key={op.key} className="flex items-center">
                                    {/* Colored label cell */}
                                    <div style={{ backgroundColor: bgColor }} className="shrink-0">
                                        <button
                                            onClick={() =>
                                                setActiveOp((prev) =>
                                                    prev === op.key ? null : op.key,
                                                )
                                            }
                                            className={`text-left font-body text-[12px] font-bold py-1 bg-transparent border-none cursor-pointer transition-opacity whitespace-nowrap px-3 w-[190px] ${activeOp === op.key
                                                ? "text-black"
                                                : "text-white hover:opacity-80"
                                                }`}
                                        >
                                            {op.label}
                                        </button>
                                    </div>

                                    {/* Sub-menu beside the label — slides in/out with framer-motion */}
                                    <AnimatePresence initial={false}>
                                        {activeOp === op.key && op.key !== "toggle" && (
                                            <motion.div
                                                initial={{ width: 0, opacity: 0 }}
                                                animate={{ width: "auto", opacity: 1 }}
                                                exit={{ width: 0, opacity: 0 }}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 350,
                                                    damping: 28,
                                                }}
                                                className="overflow-hidden"
                                            >
                                                <div className="flex items-center pl-3 whitespace-nowrap">
                                                    <SubMenuContent
                                                        opKey={op.key}
                                                        color={bgColor}
                                                        onSearch={handleSearch}
                                                    />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
