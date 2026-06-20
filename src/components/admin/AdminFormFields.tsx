"use client";

export function adminInputStyle(): React.CSSProperties {
    return {
        width: "100%",
        padding: "0.75rem 1rem",
        borderRadius: "0.5rem",
        border: "1.5px solid #E5E7EB",
        fontFamily: "var(--font-inter)",
        fontWeight: 500,
        fontSize: "0.9375rem",
        color: "#111827",
        backgroundColor: "#ffffff",
        outline: "none",
        transition: "border-color 0.15s ease",
        boxSizing: "border-box" as const,
    };
}

export function AdminFieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
    return (
        <label
            style={{
                display: "block",
                fontFamily: "var(--font-inter)",
                fontWeight: 600,
                fontSize: "0.8125rem",
                color: "#374151",
                marginBottom: "0.5rem",
            }}
        >
            {children}
            {required && <span style={{ color: "#EF4444", marginLeft: "0.25rem" }}>*</span>}
        </label>
    );
}

export function AdminFieldHint({ children }: { children: React.ReactNode }) {
    return (
        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", color: "#9CA3AF", marginTop: "0.375rem" }}>
            {children}
        </p>
    );
}

export function onFocusBorder(e: React.FocusEvent<HTMLElement>) {
    (e.target as HTMLElement).style.borderColor = "#0D5C6B";
}

export function onBlurBorder(e: React.FocusEvent<HTMLElement>) {
    (e.target as HTMLElement).style.borderColor = "#E5E7EB";
}