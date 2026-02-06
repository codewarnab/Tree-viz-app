import type { ReactNode } from "react";
import { Header } from "./Header";
import { BottomBar } from "./BottomBar";

interface RootLayoutProps {
    children: ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
    return (
        <div className="flex h-screen w-screen overflow-hidden">
            {/* Left sidebar border */}
            <div className="w-[40px] min-w-[40px] h-full bg-bg-primary" />

            {/* Main app content */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                {/* Fixed header */}
                <Header />

                {/* Flexible main content area */}
                <main className="flex-1 overflow-auto canvas-dots relative">
                    {children}
                </main>

                {/* Fixed bottom bar */}
                <BottomBar />
            </div>

            {/* Right sidebar border */}
            <div className="w-[40px] min-w-[40px] h-full bg-bg-primary" />
        </div>
    );
}
