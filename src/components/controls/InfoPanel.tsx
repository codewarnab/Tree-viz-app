import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useBSTAnimation } from "../../hooks";

/* ── colour palettes — status & code use *contrasting* hues ── */
const PANEL_PALETTES = [
    { status: "#2563eb", code: "#16a34a" },   // blue  → green
    { status: "#16a34a", code: "#ca8a04" },   // green → yellow
    { status: "#ca8a04", code: "#7c3aed" },   // yellow → purple
    { status: "#ea580c", code: "#0d9488" },   // orange → teal
    { status: "#dc2626", code: "#2563eb" },   // red   → blue
    { status: "#7c3aed", code: "#ea580c" },   // purple → orange
    { status: "#0d9488", code: "#db2777" },   // teal  → pink
    { status: "#db2777", code: "#0d9488" },   // pink  → teal
];

// Module-level random pick — evaluated once per page load / refresh
const initialPalette =
    PANEL_PALETTES[Math.floor(Math.random() * PANEL_PALETTES.length)]!;

/* ── spring config for width animation ── */
const WIDTH_SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };

/* ── component ────────────────────────────────────────────────────────── */

export function InfoPanel() {
    const {
        infoPanelOpen: isOpen,
        setInfoPanelOpen: setIsOpen,
        statusText,
        codeLines,
        highlightIndex,
        operationLabel,
    } = useBSTAnimation();

    const palette = initialPalette;

    const chevron = isOpen ? (
        <ChevronRight size={18} className="text-white" />
    ) : (
        <ChevronLeft size={18} className="text-white" />
    );

    /* Collapse (not hide) when there's no content */
    const hasContent = codeLines.length > 0;
    const effectiveOpen = isOpen && hasContent;

    return (
        <div className="fixed bottom-12.5 right-10 z-40 flex flex-col items-end">
            {/* Operation label — hidden when collapsed */}
            <AnimatePresence>
                {effectiveOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden pr-12 pb-1.5"
                    >
                        <span className="text-[#1a1a1a] font-bold text-xl tracking-tight">
                            {operationLabel}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Status row: content always rendered (keeps height), width animates */}
            <div className="flex w-full items-stretch">
                <motion.div
                    animate={{
                        width: effectiveOpen ? "auto" : 0,
                        opacity: effectiveOpen ? 1 : 0,
                    }}
                    transition={WIDTH_SPRING}
                    className="overflow-hidden"
                >
                    <div
                        className="px-4 py-2.5 text-white text-[15px] font-bold font-body leading-snug min-w-80 h-full flex items-center mr-4"
                        style={{ backgroundColor: palette.status }}
                    >
                        {statusText}
                    </div>
                </motion.div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="shrink-0 w-10 flex items-center justify-center cursor-pointer border-none transition-opacity hover:opacity-80"
                    style={{ backgroundColor: palette.status }}
                    aria-label={isOpen ? "Collapse panels" : "Expand panels"}
                >
                    {chevron}
                </button>
            </div>

            {/* Code row */}
            <div className="flex w-full items-stretch">
                <motion.div
                    animate={{
                        width: effectiveOpen ? "auto" : 0,
                        opacity: effectiveOpen ? 1 : 0,
                    }}
                    transition={WIDTH_SPRING}
                    className="overflow-hidden"
                >
                    <div
                        className="px-4 py-2 font-mono text-[13px] leading-relaxed min-w-80 mr-4"
                        style={{ backgroundColor: palette.code }}
                    >
                        {codeLines.map((line, idx) => (
                            <div
                                key={idx}
                                className="px-2 py-0.5 whitespace-pre transition-colors duration-300"
                                style={
                                    idx === highlightIndex
                                        ? {
                                            backgroundColor: "#000000",
                                            color: "#ffffff",
                                        }
                                        : { color: "#1a1a1a" }
                                }
                            >
                                {line}
                            </div>
                        ))}
                    </div>
                </motion.div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="shrink-0 w-10 flex items-center justify-center cursor-pointer border-none transition-opacity hover:opacity-80"
                    style={{ backgroundColor: palette.code }}
                    aria-label={isOpen ? "Collapse panels" : "Expand panels"}
                >
                    {chevron}
                </button>
            </div>
        </div>
    );
}
