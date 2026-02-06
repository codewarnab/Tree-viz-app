import { useContext } from "react";
import { BSTAnimationContext, type BSTAnimationState } from "./BSTAnimationContext";

/* ── Hook ──────────────────────────────────────────────────────────── */

export function useBSTAnimation(): BSTAnimationState {
    const ctx = useContext(BSTAnimationContext);
    if (!ctx) {
        throw new Error(
            "useBSTAnimation must be used inside <BSTAnimationProvider>",
        );
    }
    return ctx;
}
