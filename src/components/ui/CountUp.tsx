"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpProps {
    to: number;
    suffix?: string;
    format?: boolean; // adds comma formatting for thousands
    duration?: number;
}

export default function CountUp({
    to,
    suffix = "",
    format = false,
    duration = 2000,
}: CountUpProps) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    observer.disconnect();

                    const startTime = performance.now();

                    const tick = (now: number) => {
                        const elapsed = now - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        setCount(Math.round(eased * to));
                        if (progress < 1) requestAnimationFrame(tick);
                    };

                    requestAnimationFrame(tick);
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(el);

        // Fallback — if not intersecting within 1s, just show the value
        const fallback = setTimeout(() => {
            if (!hasAnimated.current) {
                hasAnimated.current = true;
                setCount(to);
            }
        }, 1000);

        return () => {
            observer.disconnect();
            clearTimeout(fallback);
        };
    }, [to, duration]);

    const display = format ? count.toLocaleString("en-GB") : count;

    return (
        <span ref={ref}>
            {display}
            {suffix}
        </span>
    );
}