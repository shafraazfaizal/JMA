"use server";

import { revalidatePath } from "next/cache";
import {
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    type AnnouncementInput,
} from "@/lib/admin/announcements";

export async function createAnnouncementAction(input: AnnouncementInput) {
    await createAnnouncement(input);
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