import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background/80 backdrop-blur-sm fixed inset-0 z-[9999]">
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                    <Loader2 className="h-6 w-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary animate-pulse" />
                </div>
                <p className="text-base font-medium text-foreground/80 animate-pulse tracking-wide">Loading...</p>
            </div>
        </div>
    );
}
