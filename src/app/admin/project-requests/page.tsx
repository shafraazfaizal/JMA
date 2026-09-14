import { createClient } from "@/lib/supabase/server";
import ProjectRequestsClient from "./ProjectRequestsClient";

export const revalidate = 0;

export default async function AdminProjectRequestsPage() {
    const supabase = await createClient();
    const { data: requests } = await supabase
        .from("project_requests")
        .select("*")
        .order("created_at", { ascending: false });

    return <ProjectRequestsClient requests={requests ?? []} />;
}