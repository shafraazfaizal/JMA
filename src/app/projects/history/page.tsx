import { PROJECTS, computeStats } from "@/lib/projects-data";
import ProjectsClient from "./ProjectsClient";

export default function ProjectsPage() {
    const stats = computeStats(PROJECTS);
    return <ProjectsClient yearGroups={PROJECTS} stats={stats} />;
}