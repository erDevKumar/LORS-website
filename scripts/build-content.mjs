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

// 2. Read tech-stack.md
const techStackPath = path.join(CONTENT_DIR, "tech-stack.md");
const techStackRaw = fs.readFileSync(techStackPath, "utf8");
const techStackMatter = matter(techStackRaw);
const techStack = {
  title: techStackMatter.data.title || "",
  subtitle: techStackMatter.data.subtitle || "",
  layers: techStackMatter.data.layers || [],
};

// 3. Read engineering-culture.md
const culturePath = path.join(CONTENT_DIR, "engineering-culture.md");
const cultureRaw = fs.readFileSync(culturePath, "utf8");
const cultureMatter = matter(cultureRaw);
const engineeringCulture = {
  title: cultureMatter.data.title || "",
  principles: cultureMatter.data.principles || [],
};

// 4. Read careers.md
const careersPath = path.join(CONTENT_DIR, "careers.md");
const careersRaw = fs.readFileSync(careersPath, "utf8");
const careersMatter = matter(careersRaw);
const careersContent = {
  title: careersMatter.data.title || "",
  subtitle: careersMatter.data.subtitle || "",
  body: careersMatter.data.body || "",
};

// 5. Read products/
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

const featuredOrder = ["routemates", "family-os"];
featuredProjects.sort(
  (a, b) => featuredOrder.indexOf(a.id) - featuredOrder.indexOf(b.id)
);

const contentObj = {
  siteContent,
  techStack,
  engineeringCulture,
  careersContent,
  featuredProjects,
};

fs.writeFileSync(
  path.join(OUTPUT_DIR, "content.json"),
  JSON.stringify(contentObj, null, 2),
  "utf8"
);

console.log("Content built successfully to src/generated/content.json!");
