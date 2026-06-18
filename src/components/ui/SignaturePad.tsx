"use client";

import { useRef, useState, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { RotateCcw } from "lucide-react";

interface SignaturePadProps {
    onSave: (dataUrl: string | null) => void;
    error?: boolean;
}

export default function SignaturePad({ onSave, error }: SignaturePadProps) {
    const sigRef = useRef<SignatureCanvas>(null);
    const wrapRef = useRef<HTMLDivElement>(null);
    const [isEmpty, setIsEmpty] = useState(true);
    const [width, setWidth] = useState(0);

    // Measure container width for responsive canvas
    useEffect(() => {
        if (!wrapRef.current) return;
        const ro = new ResizeObserver(() => {
            setWidth(wrapRef.current?.offsetWidth ?? 0);
        });
        ro.observe(wrapRef.current);
        setWidth(wrapRef.current.offsetWidth);
        return () => ro.disconnect();
    }, []);

    const handleEnd = () => {
        if (!sigRef.current) return;
        const empty = sigRef.current.isEmpty();
        setIsEmpty(empty);
        onSave(empty ? null : sigRef.current.getTrimmedCanvas().toDataURL("image/png"));
    };

    const handleClear = () => {
        sigRef.current?.clear();
        setIsEmpty(true);
        onSave(null);
    };

    return (
        <div ref={wrapRef}>
            {/* Canvas area */}
            <div
                style={{
                    border: `1.5px solid ${error ? "#EF4444" : isEmpty ? "#E5E7EB" : "#0D5C6B"}`,
                    borderRadius: "0.625rem",
                    backgroundColor: "#ffffff",
                    overflow: "hidden",
                    cursor: "crosshair",
                    position: "relative",
                    transition: "border-color 0.15s ease",
                }}
            >
                {width > 0 && (
                    <SignatureCanvas
                        ref={sigRef}
                        canvasProps={{
                            width,
                            height: 130,
                            style: { display: "block" },
                        }}
                        penColor="#0D5C6B"
                        minWidth={1.5}
                        maxWidth={3}
                        onEnd={handleEnd}
                    />
                )}

                {/* Placeholder label */}
                {isEmpty && (
                    <div
                        aria-hidden="true"
                        style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            pointerEvents: "none",
                        }}
                    >
                        <p
                            style={{
                                fontFamily: "var(--font-noto)",
                                fontStyle: "italic",
                                fontSize: "0.9375rem",
                                color: "#D1D5DB",
                            }}
                        >
                            Draw your signature here
                        </p>
                    </div>
                )}
            </div>

            {/* Controls row */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: "0.5rem",
                }}
            >
                <p
                    style={{
                        fontFamily: "var(--font-inter)",
                        fontSize: "0.75rem",
                        color: error ? "#EF4444" : "#9CA3AF",
                    }}
                >
                    {error
                        ? "Signature is required before submitting."
                        : isEmpty
                            ? "Use your mouse or finger to sign above."
                            : "Signature captured — you can redraw if needed."}
                </p>

                {!isEmpty && (
                    <button
                        type="button"
                        onClick={handleClear}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.3rem",
                            padding: "0.3rem 0.75rem",
                            borderRadius: "0.375rem",
                            border: "1px solid #E5E7EB",
                            backgroundColor: "#ffffff",
                            fontFamily: "var(--font-inter)",
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            color: "#6B7280",
                            cursor: "pointer",
                            transition: "border-color 0.15s ease, color 0.15s ease",
                        }}
                        onMouseEnter={(e) => {
                            const el = e.currentTarget as HTMLButtonElement;
                            el.style.borderColor = "#EF4444";
                            el.style.color = "#EF4444";
                        }}
                        onMouseLeave={(e) => {
                            const el = e.currentTarget as HTMLButtonElement;
                            el.style.borderColor = "#E5E7EB";
                            el.style.color = "#6B7280";
                        }}
                    >
                        <RotateCcw size={11} aria-hidden="true" />
                        Clear
                    </button>
                )}
            </div>
        </div>
    );
}