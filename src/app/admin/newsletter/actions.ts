// src/app/admin/newsletter/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function removeSubscriberAction(id: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("newsletter_subscribers")
        .delete()
        .eq("id", id);

    if (error) throw new Error(error.message);
    revalidatePath("/admin/newsletter");
}