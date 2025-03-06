import { z } from "zod";

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  dueDate: z.string().optional(),
  priority: z.enum(["Low", "Medium", "High"]),
  estimatedTime: z.string(),
  completed: z.boolean(),
  columnId: z.string()
});

export const columnSchema = z.object({
  id: z.string(),
  title: z.string(),
  taskIds: z.array(z.string())
});

export const linkSchema = z.object({
  id: z.string(), 
  url: z.string().url(),
  title: z.string(),
  groupId: z.string().optional()
});

export const linkGroupSchema = z.object({
  id: z.string(),
  name: z.string(),
  linkIds: z.array(z.string())
});

export type Task = z.infer<typeof taskSchema>;
export type Column = z.infer<typeof columnSchema>;
export type Link = z.infer<typeof linkSchema>;
export type LinkGroup = z.infer<typeof linkGroupSchema>;
