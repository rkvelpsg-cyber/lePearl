import path from "path";
import { promises as fs } from "fs";
import type { SiteContent } from "@/types/site";

const contentPath = path.join(process.cwd(), "content", "site.json");

export async function getSiteContent(): Promise<SiteContent> {
  const raw = await fs.readFile(contentPath, "utf-8");
  return JSON.parse(raw) as SiteContent;
}
