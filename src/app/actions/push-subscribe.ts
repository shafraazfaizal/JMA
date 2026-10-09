// src/app/actions/push-subscribe.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

export async function subscribeToPushAction(subscription: {
    endpoint: string;
    keys: { p256dh: string; auth: string };
}): Promise<{ success: boolean }> {
    try {
        const supabase = await createClient();
        const headersList = await headers();
        const userAgent = headersList.get("user-agent") ?? null;

        const { error } = await supabase.from("push_subscriptions").upsert(
            {
                endpoint: subscription.endpoint,
                p256dh: subscription.keys.p256dh,
                auth: subscription.keys.auth,
                user_agent: userAgent,
            },
            { onConflict: "endpoint" }
        );

        if (error) {
            console.error("[push-subscribe]", error.message);
            return { success: false };
        }

        return { success: true };
    } catch (err) {
        console.error("[push-subscribe]", err);
        return { success: false };
    }
}

export async function unsubscribeFromPushAction(endpoint: string): Promise<{ success: boolean }> {
    try {
        const supabase = await createClient();
        await supabase.from("push_subscriptions").delete().eq("endpoint", endpoint);
        return { success: true };
    } catch {
        return { success: false };
    }
}