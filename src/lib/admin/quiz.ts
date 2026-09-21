// src/lib/admin/quiz.ts
import { createClient } from "@/lib/supabase/server";
import type { DBQuizRegistration, DBQuizSession, AgeGroup } from "@/types/database";

// ── Sessions ─────────────────────────────────────────────────

export async function getAllQuizSessions(): Promise<DBQuizSession[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("quiz_sessions")
        .select("*")
        .order("quiz_month", { ascending: false });

    if (error) throw new Error(error.message);
    return data ?? [];
}

export async function getActiveQuizSession(): Promise<DBQuizSession | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("quiz_sessions")
        .select("*")
        .eq("registration_open", true)
        .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
}

export async function getLatestPublishedQuizSession(): Promise<DBQuizSession | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("quiz_sessions")
        .select("*")
        .eq("results_published", true)
        .order("quiz_month", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
}

export async function createQuizSession(input: {
    quiz_month: string;
    title: string;
    topic?: string;
    scheduled_at?: string;
}): Promise<DBQuizSession> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("quiz_sessions")
        .insert({ ...input, registration_open: false })
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function updateQuizSession(
    id: string,
    update: Partial<DBQuizSession>
): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
        .from("quiz_sessions")
        .update(update)
        .eq("id", id);

    if (error) throw new Error(error.message);
}

// ── Registrations ─────────────────────────────────────────────

export async function getRegistrationsForMonth(quizMonth: string): Promise<DBQuizRegistration[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("quiz_registrations")
        .select("*")
        .eq("quiz_month", quizMonth)
        .order("created_at", { ascending: true });

    if (error) throw new Error(error.message);
    return data ?? [];
}

export async function createQuizRegistration(input: {
    child_name: string;
    age_group: AgeGroup;
    parent_name: string;
    parent_email: string;
    parent_phone?: string;
    quiz_month: string;
}): Promise<DBQuizRegistration> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("quiz_registrations")
        .insert({ ...input, status: "registered", link_sent: false })
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function markLinkSent(quizMonth: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
        .from("quiz_registrations")
        .update({ link_sent: true })
        .eq("quiz_month", quizMonth);

    if (error) throw new Error(error.message);
}

export async function updateRegistrationStatus(
    id: string,
    status: DBQuizRegistration["status"]
): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
        .from("quiz_registrations")
        .update({ status })
        .eq("id", id);

    if (error) throw new Error(error.message);
}