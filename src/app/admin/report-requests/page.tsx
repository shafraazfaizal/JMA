import { createClient } from "@/lib/supabase/server";
import ReportRequestsClient from "./ReportRequestsClient";

export const revalidate = 0;

export default async function AdminReportRequestsPage() {
    const supabase = await createClient();
    const { data: requests } = await supabase
        .from("report_requests")
        .select("*")
        .order("created_at", { ascending: false });

    return <ReportRequestsClient requests={requests ?? []} />;
}