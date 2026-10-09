// src/hooks/usePushNotifications.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { subscribeToPushAction, unsubscribeFromPushAction } from "@/app/actions/push-subscribe";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

type PermissionState = "default" | "granted" | "denied" | "unsupported";

export function usePushNotifications() {
    const [permission, setPermission] = useState<PermissionState>("default");
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!("Notification" in window) || !("serviceWorker" in navigator)) {
            setPermission("unsupported");
            return;
        }
        setPermission(Notification.permission as PermissionState);

        // Check if already subscribed
        navigator.serviceWorker.ready.then((reg) => {
            reg.pushManager.getSubscription().then((sub) => {
                setIsSubscribed(!!sub);
            });
        });
    }, []);

    const subscribe = useCallback(async (): Promise<boolean> => {
        if (!("serviceWorker" in navigator)) return false;
        if (!VAPID_PUBLIC_KEY) {
            console.error("[usePushNotifications] VAPID public key is missing");
            return false;
        }
        setLoading(true);
        try {
            const reg = await navigator.serviceWorker.ready;

            // Request permission
            const result = await Notification.requestPermission();
            setPermission(result as PermissionState);
            if (result !== "granted") return false;

            // Subscribe via push manager
            const sub = await reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as unknown as BufferSource,
            });

            const json = sub.toJSON() as {
                endpoint: string;
                keys: { p256dh: string; auth: string };
            };

            const { success } = await subscribeToPushAction(json);
            if (success) setIsSubscribed(true);
            return success;
        } catch (err) {
            console.error("[usePushNotifications] subscribe failed", err);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const unsubscribe = useCallback(async (): Promise<boolean> => {
        setLoading(true);
        try {
            const reg = await navigator.serviceWorker.ready;
            const sub = await reg.pushManager.getSubscription();
            if (!sub) return true;
            await unsubscribeFromPushAction(sub.endpoint);
            await sub.unsubscribe();
            setIsSubscribed(false);
            return true;
        } catch {
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    return { permission, isSubscribed, loading, subscribe, unsubscribe };
}