"use server";

import { revalidatePath } from "next/cache";
import {
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    type AnnouncementInput,
} from "@/lib/admin/announcements";
import { sendPushToAll } from "@/lib/push/send-push";

export async function createAnnouncementAction(input: AnnouncementInput) {
    await createAnnouncement(input);

    // Notify all push subscribers of the new announcement
    await sendPushToAll({
        title: "JMA UK — New Announcement",
        body: input.message.slice(0, 100),
        url: "/",
    });

    revalidatePath("/");
    revalidatePath("/admin/announcements");
}

export async function updateAnnouncementAction(id: string, input: Partial<AnnouncementInput>) {
    await updateAnnouncement(id, input);
    revalidatePath("/");
    revalidatePath("/admin/announcements");
}

export async function deleteAnnouncementAction(id: string) {
    await deleteAnnouncement(id);
    revalidatePath("/");
    revalidatePath("/admin/announcements");
}