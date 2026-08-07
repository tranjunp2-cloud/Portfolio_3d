import { projectIds } from "./projects/index";

import type { TagVariant } from "../components/tagVariants";
import type { ProjectComponent } from "../features/projects/types";

export type ProjectId = (typeof projectIds)[number];

export interface ProjectContent {
  title: string;
  theme: "light" | "dark";
  tags: TagVariant[];
  description?: string;
  videoBorder?: boolean;
  live?: string;
  source?: string;
  components?: ProjectComponent[];
}

export interface SkillContent {
  name: string;
  bullets: string[];
}

export type ProjectCategory = "web-design" | "app-design" | "branding" | "packaging";

export interface ProjectPreview {
  title: string;
  slug: string;
  thumbnail: string;
  description: string;
  category: ProjectCategory;
}
