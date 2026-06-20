"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
    createCampaign,
    updateCampaign,
    deleteCampaign,
    slugify,
    type CampaignInput,
} from "@/lib/admin/campaigns";

export async function createCampaignAction(formData: FormData) {
    const title = formData.get("title") as string;

    const input: CampaignInput = {
        slug: slugify(title),
        title,
        short_description: formData.get("short_description") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as CampaignInput["category"],
        status: formData.get("status") as CampaignInput["status"],
        goal: Number(formData.get("goal")),
        raised: Number(formData.get("raised")) || 0,
        donor_count: Number(formData.get("donor_count")) || 0,
        days_remaining: formData.get("days_remaining")
            ? Number(formData.get("days_remaining"))
            : null,
        image_url: (formData.get("image_url") as string) || null,
    };

    await createCampaign(input);

    // Refresh cached data on every page that shows campaigns
    revalidatePath("/campaigns");
    revalidatePath("/");
    revalidatePath("/admin/campaigns");

    redirect("/admin/campaigns");
}

export async function updateCampaignAction(id: string, formData: FormData) {
    const title = formData.get("title") as string;

    const input: Partial<CampaignInput> = {
        title,
        short_description: formData.get("short_description") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as CampaignInput["category"],
        status: formData.get("status") as CampaignInput["status"],
        goal: Number(formData.get("goal")),
        raised: Number(formData.get("raised")) || 0,
        donor_count: Number(formData.get("donor_count")) || 0,
        days_remaining: formData.get("days_remaining")
            ? Number(formData.get("days_remaining"))
            : null,
        image_url: (formData.get("image_url") as string) || null,
    };

    await updateCampaign(id, input);

    revalidatePath("/campaigns");
    revalidatePath(`/campaigns/${formData.get("slug")}`);
    revalidatePath("/");
    revalidatePath("/admin/campaigns");

    redirect("/admin/campaigns");
}

export async function deleteCampaignAction(id: string) {
    await deleteCampaign(id);

    revalidatePath("/campaigns");
    revalidatePath("/");
    revalidatePath("/admin/campaigns");
}