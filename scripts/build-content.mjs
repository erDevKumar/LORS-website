import fs from "fs";
import path from "path";
import matter from "gray-matter";
import YAML from "yaml";

const CONTENT_DIR = path.resolve("content");
const OUTPUT_DIR = path.resolve("src/generated");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 1. Read site.yaml
const siteYamlPath = path.join(CONTENT_DIR, "site.yaml");
const siteYamlRaw = fs.readFileSync(siteYamlPath, "utf8");
const siteContent = YAML.parse(siteYamlRaw);

// 2. Read mission.md
const missionPath = path.join(CONTENT_DIR, "mission.md");
const missionRaw = fs.readFileSync(missionPath, "utf8");
const missionMatter = matter(missionRaw);
const missionPillars = missionMatter.data.pillars || [];
const missionAbout = missionMatter.data.about || "";

// 3. Read it-capabilities.md
const itPath = path.join(CONTENT_DIR, "it-capabilities.md");
const itRaw = fs.readFileSync(itPath, "utf8");
const itMatter = matter(itRaw);
const itCapabilities = itMatter.data.capabilities || [];

// 4. Read products/
const productsDir = path.join(CONTENT_DIR, "products");
const productFiles = fs.existsSync(productsDir) ? fs.readdirSync(productsDir) : [];
const featuredProjects = [];

for (const file of productFiles) {
  if (file.endsWith(".md")) {
    const raw = fs.readFileSync(path.join(productsDir, file), "utf8");
    const parsed = matter(raw);
    featuredProjects.push({
      ...parsed.data,
      description: parsed.content.trim(),
    });
  }
}

// 5. Read pipeline/
const pipelineDir = path.join(CONTENT_DIR, "pipeline");
const pipelineFiles = fs.existsSync(pipelineDir) ? fs.readdirSync(pipelineDir) : [];
const upcomingProjects = [];

for (const file of pipelineFiles) {
  if (file.endsWith(".md")) {
    const raw = fs.readFileSync(path.join(pipelineDir, file), "utf8");
    const parsed = matter(raw);
    upcomingProjects.push({
      ...parsed.data,
      description: parsed.content.trim(),
    });
  }
}

// Build final object
const featuredOrder = ["routemates", "family-os"];
featuredProjects.sort(
  (a, b) => featuredOrder.indexOf(a.id) - featuredOrder.indexOf(b.id)
);

const pipelineOrder = ["tripkit", "docvault", "twincam", "nexus-lab"];
upcomingProjects.sort(
  (a, b) => pipelineOrder.indexOf(a.id) - pipelineOrder.indexOf(b.id)
);

const contentObj = {
  siteContent: {
    ...siteContent,
    about: missionAbout || siteContent.about,
  },
  missionPillars,
  itCapabilities,
  featuredProjects,
  upcomingProjects,
};

// Write output JSON
fs.writeFileSync(
  path.join(OUTPUT_DIR, "content.json"),
  JSON.stringify(contentObj, null, 2),
  "utf8"
);

console.log("Content built successfully to src/generated/content.json!");
