import { useState } from "react";
import { useQueryState } from "nuqs";

const TREE_TYPES = [
    { key: "bst", label: "Binary Search Tree" },
    { key: "avl", label: "AVL Tree" },
] as const;

export function Header() {
    const [treeType, setTreeType] = useQueryState("type", {
        defaultValue: "bst",
    });
    const [modeOpen, setModeOpen] = useState(false);

    return (
        <nav className="flex items-center h-[40px] bg-bg-primary px-10 font-body text-[13px] relative shrink-0 z-50">
            {/* Logo section */}
            <span className="flex items-center mr-1 gap-1">
                {/* "7" badge */}
                <a href="#" className="no-underline text-white">
                    <span className="inline-flex items-center justify-center w-5 h-5 border border-accent-green rounded text-accent-orange font-silkscreen text-xs font-bold">
                        7
                    </span>
                </a>

                {/* Brand name - TreeViz */}
                <a href="#" className="font-silkscreen text-[20px] ml-1 no-underline">
                    <span className="text-white">Tree</span>
                    <span className="text-accent-orange">Viz</span>
                    <span className="text-[40%] text-white">.dev</span>
                </a>

                <span className="text-white mx-1">/</span>

                {/* Language dropdown (dummy) */}
                <select className="bg-white text-black border border-white rounded text-xs px-1 py-0.5 outline-none cursor-pointer appearance-auto">
                    <option value="en">en</option>
                    <option value="zh">zh</option>
                    <option value="id">id</option>
                </select>

                <span className="text-white font-mono">/bst</span>
            </span>

            {/* Tree type links */}
            <span className="flex items-center ml-4 max-h-[30px] gap-1">
                {TREE_TYPES.map(({ key, label }) => (
                    <a
                        key={key}
                        onClick={() => setTreeType(key)}
                        className={`cursor-pointer px-2 py-1 text-[13px] no-underline transition-colors ${treeType === key
                                ? "text-white font-bold border-b-2 border-accent-orange"
                                : "text-text-secondary hover:text-white"
                            }`}
                    >
                        {label}
                    </a>
                ))}
            </span>

            {/* Right side - mode menu + login */}
            <span className="flex items-center ml-auto max-h-[30px] gap-2">
                {/* Mode dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setModeOpen(!modeOpen)}
                        className="bg-bg-primary text-white border-none cursor-pointer px-3 py-1 text-[13px] hover:text-accent-orange transition-colors"
                    >
                        Exploration Mode ▿
                    </button>
                    {modeOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setModeOpen(false)}
                            />
                            <div className="absolute top-full right-0 bg-bg-primary border border-border-secondary py-2 z-50 min-w-[160px]">
                                <a className="block px-4 py-1.5 text-white hover:text-accent-orange cursor-pointer text-[13px] no-underline">
                                    e-Lecture Mode
                                </a>
                            </div>
                        </>
                    )}
                </div>

                {/* Login button */}
                <span className="font-silkscreen">
                    <a
                        href="#"
                        className="text-white no-underline border border-accent-green rounded px-3 py-1 hover:bg-accent-green/20 transition-colors text-sm tracking-wider"
                    >
                        LOGIN
                    </a>
                </span>
            </span>
        </nav>
    );
}
