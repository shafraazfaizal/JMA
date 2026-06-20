"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
    createImpactStory,
    updateImpactStory,
    deleteImpactStory,
    createAnnualHighlight,
    updateAnnualHighlight,
    deleteAnnualHighlight,
    updateProjectCategory,
    type ImpactStoryInput,
    type AnnualHighlightInput,
    type ProjectCategoryUpdateInput,
} from "@/lib/admin/impact";

// ============================================
// STORIES
// ============================================

export async function createImpactStoryAction(formData: FormData) {
    const input: ImpactStoryInput = {
        name: formData.get("name") as string,
        age: formData.get("age") ? Number(formData.get("age")) : null,
        location: formData.get("location") as string,
        category: formData.get("category") as ImpactStoryInput["category"],
        quote: formData.get("quote") as string,
        detail: formData.get("detail") as string,
        image_url: (formData.get("image_url") as string) || null,
        display_order: Number(formData.get("display_order")) || 0,
    };

    await createImpactStory(input);

    revalidatePath("/impact");
    revalidatePath("/admin/impact");
    redirect("/admin/impact");
}

export async function updateImpactStoryAction(id: string, formData: FormData) {
    const input: Partial<ImpactStoryInput> = {
        name: formData.get("name") as string,
        age: formData.get("age") ? Number(formData.get("age")) : null,
        location: formData.get("location") as string,
        category: formData.get("category") as ImpactStoryInput["category"],
        quote: formData.get("quote") as string,
        detail: formData.get("detail") as string,
        image_url: (formData.get("image_url") as string) || null,
        display_order: Number(formData.get("display_order")) || 0,
    };

    await updateImpactStory(id, input);

    revalidatePath("/impact");
    revalidatePath("/admin/impact");
    redirect("/admin/impact");
}

export async function deleteImpactStoryAction(id: string) {
    await deleteImpactStory(id);
    revalidatePath("/impact");
    revalidatePath("/admin/impact");
}

// ============================================
// ANNUAL HIGHLIGHTS
// ============================================

export async function createAnnualHighlightAction(input: AnnualHighlightInput) {
    await createAnnualHighlight(input);
    revalidatePath("/impact");
    revalidatePath("/admin/impact");
}

export async function updateAnnualHighlightAction(id: string, input: Partial<AnnualHighlightInput>) {
    await updateAnnualHighlight(id, input);
    revalidatePath("/impact");
    revalidatePath("/admin/impact");
}

export async function deleteAnnualHighlightAction(id: string) {
    await deleteAnnualHighlight(id);
    revalidatePath("/impact");
    revalidatePath("/admin/impact");
}

// ============================================
// PROJECT CATEGORIES
// ============================================

export async function updateProjectCategoryAction(id: string, input: ProjectCategoryUpdateInput) {
    await updateProjectCategory(id, input);
    revalidatePath("/impact");
    revalidatePath("/admin/impact");
}