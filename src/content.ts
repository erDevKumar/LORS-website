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

export type ProductFeature = {
  title: string;
  body: string;
};

export type Project = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  status: ProjectStatus;
  statusLabel?: string;
  classification?: string;
  platforms?: string;
  pitch?: string;
  features?: ProductFeature[];
  featured?: boolean;
  href?: string;
  category: ProjectCategory;
  glb?: string;
  notifyCta?: boolean;
};

export type TechStackLayer = {
  layer: string;
  technologies: string;
  purpose: string;
};

export type ContentHighlight = {
  title: string;
  body: string;
};

export type CareersRoleTrack = ContentHighlight;

export type EngineeringPrinciple = ContentHighlight;

export type LegalBullet = {
  title: string;
  body: string;
};

export type LegalSubsection = LegalBullet;

export type LegalSection = {
  title: string;
  intro?: string;
  body?: string;
  bullets?: LegalBullet[];
  subsections?: LegalSubsection[];
  emphasis?: "legal";
  contact?: {
    label: string;
    email: string;
  };
};

export type LegalDocument = {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
};

export const techStack = generatedContent.techStack;
export const engineeringCulture = generatedContent.engineeringCulture;
export const ecosystemContent = generatedContent.ecosystemContent;
export const careersContent = generatedContent.careersContent;
export const privacyPolicy = generatedContent.privacyPolicy as LegalDocument;
export const termsAndConditions = generatedContent.termsAndConditions as LegalDocument;
export const disclaimer = generatedContent.disclaimer as LegalDocument;

export const statusLabels: Record<ProjectStatus, string> = {
  live: "Live",
  beta: "Beta",
  "coming-soon": "Coming soon",
  concept: "In R&D",
};

function resolveProjectUrls(projects: Record<string, unknown>[]): Project[] {
  return projects.map((p) => {
    let href = p.href as string | undefined;
    if (p.href_env) {
      const envUrl = import.meta.env[p.href_env as string];
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

export function getProject(id: string): Project | undefined {
  return featuredProjects.find((p) => p.id === id);
}

export const navLinks = [
  { label: "Products", href: "/#ecosystem" },
  { label: "Tech", href: "/#tech" },
  { label: "Careers", href: "/#careers" },
  { label: "Contact", href: "/#contact" },
] as const;

export function contactEmail(): string {
  return import.meta.env.VITE_CONTACT_EMAIL ?? siteContent.contactEmail ?? "lorsnexus@lorsnexus.com";
}

export function contactMailto(subject?: string): string {
  const subj = subject ?? "Hello LORS Nexus";
  return `mailto:${contactEmail()}?subject=${encodeURIComponent(subj)}`;
}

export function supportMailto(product: "routemates" | "familyos"): string {
  const subject =
    product === "routemates"
      ? siteContent.routematesSupportSubject ?? "Support - RouteMates"
      : siteContent.familyosSupportSubject ?? "Support - FamilyOS";
  return contactMailto(subject);
}

export function careersFormUrl(): string | undefined {
  const envKey = siteContent.careersFormUrl_env ?? "VITE_CAREERS_FORM_URL";
  const url = import.meta.env[envKey];
  return url && url.trim() !== "" ? url.trim() : undefined;
}
