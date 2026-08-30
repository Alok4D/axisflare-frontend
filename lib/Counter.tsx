"use client";

import { useEffect, useState, useRef } from "react";
import { useInView, animate, useMotionValue, useTransform } from "framer-motion";

export function Counter({ value }: { value: number }) {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest));
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true });
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        if (isInView) {
            const controls = animate(count, value, { duration: 2, ease: "easeOut" });
            return controls.stop;
        }
    }, [isInView, count, value]);

    useEffect(() => {
        return rounded.on("change", (v) => setDisplay(v));
    }, [rounded]);

    return (
        <span ref={ref} style={{ display: "inline-block", minWidth: "28px" }}>
            {display}
        </span>
    );
}