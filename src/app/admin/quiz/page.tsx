// src/app/admin/quiz/page.tsx
import { getAllQuizSessions, getRegistrationsForMonth } from "@/lib/admin/quiz";
import AdminQuizClient from "@/components/admin/AdminQuizClient";

export default async function AdminQuizPage() {
    const sessions = await getAllQuizSessions();
    const activeSession = sessions.find((s) => s.registration_open) ?? null;

    const registrations = activeSession
        ? await getRegistrationsForMonth(activeSession.quiz_month)
        : [];

    return (
        <div>
            <div style={{ marginBottom: "2rem" }}>
                <h1 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.625rem", color: "#111827", marginBottom: "0.375rem" }}>
                    Monthly Quiz
                </h1>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "#6B7280" }}>
                    {activeSession
                        ? `Registration open — ${activeSession.title} · ${registrations.length} registered`
                        : "No active quiz session"}
                </p>
            </div>

            <AdminQuizClient sessions={sessions} registrations={registrations} />
        </div>
    );
}