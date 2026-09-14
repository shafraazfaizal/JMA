"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateProjectRequestStatusAction(
    id: string,
    status: "pending" | "under_review" | "approved" | "declined",
    admin_notes: string
) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("project_requests")
        .update({ status, admin_notes })
        .eq("id", id);

    if (error) throw new Error(error.message);
    revalidatePath("/admin/project-requests");
}