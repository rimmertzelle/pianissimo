import { z } from 'zod';

// Task validation schemas
export const createTaskInputSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.number().int().min(0).max(3),
  status: z.number().int().min(0).max(4),
  progress: z.number().int().min(0).max(100).optional().default(0),
  projectId: z.number().int().optional(),
});

export const updateTaskInputSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty').optional(),
  description: z.string().optional(),
  priority: z.number().int().min(0).max(3).optional(),
  status: z.number().int().min(0).max(4).optional(),
  progress: z.number().int().min(0).max(100).optional(),
  projectId: z.number().int().optional(),
});

// Project validation schemas
export const createProjectInputSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
});

export const updateProjectInputSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty').optional(),
  description: z.string().optional(),
});

// Tag validation schemas
export const createTagInputSchema = z.object({
  title: z.string().min(1, 'Title is required'),
});

export const updateTagInputSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty').optional(),
});

// Type exports for TypeScript
export type CreateTaskInput = z.infer<typeof createTaskInputSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskInputSchema>;
export type CreateProjectInput = z.infer<typeof createProjectInputSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectInputSchema>;
export type CreateTagInput = z.infer<typeof createTagInputSchema>;
export type UpdateTagInput = z.infer<typeof updateTagInputSchema>;
