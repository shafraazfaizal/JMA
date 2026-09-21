// src/app/community/quiz/page.tsx
import { getActiveQuizSession, getLatestPublishedQuizSession } from "@/lib/admin/quiz";
import QuizClient from "@/components/community/QuizClient";

export const revalidate = 60;

export default async function QuizPage() {
    const [activeSession, latestWinner] = await Promise.all([
        getActiveQuizSession(),
        getLatestPublishedQuizSession(),
    ]);

    return <QuizClient activeSession={activeSession} latestWinner={latestWinner} />;
}