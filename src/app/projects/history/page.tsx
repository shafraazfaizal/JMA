import type { Metadata } from "next";
import { PROJECTS, computeStats } from "@/lib/projects-data";
import ProjectsClient from "./ProjectsClient";

export const metadata: Metadata = {
    title: "Our Projects | Jaffna Muslim Association UK",
    description:
        "Explore 340+ charitable projects completed by JMA UK from 2002 to 2023 across education, medical aid, housing, water infrastructure, emergency relief, and more.",
    openGraph: {
        title: "Our Projects | JMA UK",
        description:
            "Over two decades of charitable work — education, medical, housing, wells, disaster relief and more for communities in Sri Lanka and beyond.",
        url: "https://jaffnamuslimuk.org/projects",
    },
};

export default function ProjectsPage() {
    const stats = computeStats(PROJECTS);
    return <ProjectsClient yearGroups={PROJECTS} stats={stats} />;
}