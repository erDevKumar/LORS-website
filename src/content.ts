import generatedContent from "./generated/content.json";

export const siteContent = {
  ...generatedContent.siteContent,
  year: new Date().getFullYear(),
};

export type ProjectStatus = "live" | "beta" | "coming-soon" | "concept";

export type ProjectCategory =
  | "travel"
  | "family"
  | "media"
  | "productivity"
  | "platform";

export type Project = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  status: ProjectStatus;
  featured?: boolean;
  href?: string;
  category: ProjectCategory;
  glb?: string;
  notifyCta?: boolean;
};

export const missionPillars = generatedContent.missionPillars;
export const itCapabilities = generatedContent.itCapabilities;

export const statusLabels: Record<ProjectStatus, string> = {
  live: "Live",
  beta: "Beta",
  "coming-soon": "Coming soon",
  concept: "In R&D",
};

// Resolve env-based URLs if specified
function resolveProjectUrls(projects: any[]): Project[] {
  return projects.map((p) => {
    let href = p.href;
    if (p.href_env) {
      const envUrl = import.meta.env[p.href_env];
      if (envUrl && envUrl.trim() !== "") {
        href = envUrl.trim();
      }
    }
    return {
      ...p,
      href,
    } as Project;
  });
}

export const featuredProjects = resolveProjectUrls(generatedContent.featuredProjects);
export const upcomingProjects = resolveProjectUrls(generatedContent.upcomingProjects);

export const navLinks = [
  { label: "Mission", href: "#mission" },
  { label: "Products", href: "#products" },
  { label: "IT", href: "#it" },
  { label: "Contact", href: "#contact" },
] as const;

export function contactEmail(): string {
  return import.meta.env.VITE_CONTACT_EMAIL ?? siteContent.contactEmail ?? "lorsnexus@lorsnexus.com";
}

export function contactMailto(): string {
  return `mailto:${contactEmail()}?subject=${encodeURIComponent("Hello LORS Nexus")}`;
}

