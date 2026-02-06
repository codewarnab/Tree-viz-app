import { Pause, Play, SkipBack, SkipForward, StepBack, StepForward } from "lucide-react";
import { useState } from "react";

export function BottomBar() {
    const [speed, setSpeed] = useState(1);

    return (
        <div className="flex items-center h-[36px] bg-bg-primary px-4 shrink-0 border-t border-border-primary z-50">
            {/* Speed controls */}
            <div className="flex items-center gap-2 text-text-secondary text-xs">
                <span className="text-text-muted text-[11px]">{speed.toFixed(1)}x</span>
                <input
                    type="range"
                    min={0.25}
                    max={4}
                    step={0.25}
                    value={speed}
                    onChange={(e) => setSpeed(parseFloat(e.target.value))}
                    className="w-28 h-0.5 accent-white cursor-pointer"
                />
                <span className="text-text-muted text-[11px]">{speed}x</span>
            </div>

            {/* Playback controls + Progress bar */}
            <div className="flex items-center gap-2 mx-auto">
                <div className="flex items-center gap-0.5">
                    <button className="p-1 text-text-muted hover:text-white transition-colors bg-transparent border-none cursor-pointer">
                        <SkipBack size={14} />
                    </button>
                    <button className="p-1 text-text-muted hover:text-white transition-colors bg-transparent border-none cursor-pointer">
                        <StepBack size={14} />
                    </button>
                    <button className="p-1 text-text-muted hover:text-white transition-colors bg-transparent border-none cursor-pointer">
                        <Pause size={14} />
                    </button>
                    <button className="p-1 text-text-muted hover:text-white transition-colors bg-transparent border-none cursor-pointer">
                        <Play size={14} />
                    </button>
                    <button className="p-1 text-text-muted hover:text-white transition-colors bg-transparent border-none cursor-pointer">
                        <StepForward size={14} />
                    </button>
                    <button className="p-1 text-text-muted hover:text-white transition-colors bg-transparent border-none cursor-pointer">
                        <SkipForward size={14} />
                    </button>
                </div>

                {/* Progress bar */}
                <div className="w-[280px] hidden sm:block">
                    <div className="h-[3px] bg-border-secondary rounded-full overflow-hidden">
                        <div className="h-full w-[45%] bg-white rounded-full" />
                    </div>
                </div>
            </div>

            {/* Right side links */}
            <div className="flex items-center gap-4 text-text-muted text-[11px]">
                <a href="#" className="hover:text-white transition-colors no-underline text-text-muted">About</a>
                <a href="#" className="hover:text-white transition-colors no-underline text-text-muted">Team</a>
                <a href="#" className="hover:text-white transition-colors no-underline text-text-muted">Terms of use</a>
                <a href="#" className="hover:text-white transition-colors no-underline text-text-muted">Privacy Policy</a>
            </div>
        </div>
    );
}
