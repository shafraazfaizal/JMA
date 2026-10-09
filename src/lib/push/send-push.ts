// src/lib/push/send-push.ts
// Server-side utility — call this from any server action to fan out a push notification

import webpush from "web-push";
import { createClient } from "@/lib/supabase/server";

webpush.setVapidDetails(
    "mailto:info@jaffnamuslimuk.org",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
);

export interface PushPayload {
    title: string;
    body: string;
    url?: string;        // where to navigate when tapped
    icon?: string;       // defaults to /logo/logo.svg
    badge?: string;      // small monochrome icon (mobile status bar)
}

export async function sendPushToAll(payload: PushPayload): Promise<void> {
    const supabase = await createClient();

    const { data: subscriptions, error } = await supabase
        .from("push_subscriptions")
        .select("id, endpoint, p256dh, auth");

    if (error || !subscriptions?.length) return;

    const notification = JSON.stringify({
        title: payload.title,
        body: payload.body,
        url: payload.url ?? "/",
        icon: payload.icon ?? "/logo/logo.svg",
        badge: payload.badge ?? "/logo/logo.svg",
    });

    const staleIds: string[] = [];

    await Promise.allSettled(
        subscriptions.map(async (sub) => {
            try {
                await webpush.sendNotification(
                    { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
                    notification
                );
            } catch (err: unknown) {
                // 404 / 410 = subscription expired — clean it up
                const status = (err as { statusCode?: number }).statusCode;
                if (status === 404 || status === 410) {
                    staleIds.push(sub.id);
                }
            }
        })
    );

    if (staleIds.length) {
        await supabase.from("push_subscriptions").delete().in("id", staleIds);
    }
}