"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateReportRequestStatusAction(
    id: string,
    status: "pending" | "sent" | "rejected",
    notes: string
) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("report_requests")
        .update({ status, admin_notes: notes })
        .eq("id", id);

    if (error) throw new Error(error.message);
    revalidatePath("/admin/report-requests");
}

export async function deleteReportRequestAction(id: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("report_requests")
        .delete()
        .eq("id", id);

    if (error) throw new Error(error.message);
    revalidatePath("/admin/report-requests");
}