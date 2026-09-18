import { Check } from "lucide-react";

interface StepIndicatorProps {
    step: number; // current step, 1-indexed
    totalSteps: number;
    labels: string[];
}

export default function StepIndicator({ step: current, totalSteps, labels }: StepIndicatorProps) {
    const steps = labels.slice(0, totalSteps).map((label, i) => ({
        number: i + 1,
        label,
    }));

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0",
                marginBottom: "2.5rem",
            }}
        >
            {steps.map((step, i) => {
                const done = current > step.number;
                const active = current === step.number;

                return (
                    <div key={step.number} style={{ display: "flex", alignItems: "center" }}>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column" as const,
                                alignItems: "center",
                                gap: "0.5rem",
                            }}
                        >
                            <div
                                style={{
                                    width: "36px",
                                    height: "36px",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontFamily: "var(--font-jakarta)",
                                    fontWeight: 700,
                                    fontSize: "0.875rem",
                                    transition: "all 0.3s ease",
                                    backgroundColor: done ? "#0D5C6B" : active ? "#C9A84C" : "#F3F4F6",
                                    color: done || active ? "#ffffff" : "#9CA3AF",
                                    border: `2px solid ${done ? "#0D5C6B" : active ? "#C9A84C" : "#E5E7EB"}`,
                                    boxShadow: active ? "0 0 0 4px rgba(201,168,76,0.15)" : "none",
                                }}
                            >
                                {done ? <Check size={16} aria-hidden="true" /> : step.number}
                            </div>
                            <span
                                style={{
                                    fontFamily: "var(--font-inter)",
                                    fontSize: "0.75rem",
                                    fontWeight: active ? 600 : 400,
                                    color: active ? "#111827" : done ? "#0D5C6B" : "#9CA3AF",
                                    whiteSpace: "nowrap" as const,
                                    transition: "color 0.3s ease",
                                }}
                            >
                                {step.label}
                            </span>
                        </div>

                        {i < steps.length - 1 && (
                            <div
                                style={{
                                    width: "80px",
                                    height: "2px",
                                    marginBottom: "1.25rem",
                                    backgroundColor: done ? "#0D5C6B" : "#E5E7EB",
                                    transition: "background-color 0.3s ease",
                                }}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}