import { Task, Column, Link, LinkGroup } from "@shared/schema";

const STORAGE_KEYS = {
  TASKS: "studbud_tasks",
  COLUMNS: "studbud_columns",
  LINKS: "studbud_links",
  LINK_GROUPS: "studbud_link_groups",
} as const;

export function getTasks(): Task[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || "[]");
}

export function saveTasks(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
}

export function getColumns(): Column[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.COLUMNS) || "[]");
}

export function saveColumns(columns: Column[]) {
  localStorage.setItem(STORAGE_KEYS.COLUMNS, JSON.stringify(columns));
}

export function getLinks(): Link[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.LINKS) || "[]");
}

export function saveLinks(links: Link[]) {
  localStorage.setItem(STORAGE_KEYS.LINKS, JSON.stringify(links));
}

export function getLinkGroups(): LinkGroup[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.LINK_GROUPS) || "[]");
}

export function saveLinkGroups(groups: LinkGroup[]) {
  localStorage.setItem(STORAGE_KEYS.LINK_GROUPS, JSON.stringify(groups));
}
