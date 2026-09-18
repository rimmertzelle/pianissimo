import { and, eq, inArray } from 'drizzle-orm';
import { TaskInput, TaskUpdateInput } from '../types';
import { db } from '../lib/db';
import { tasks, taskTags } from '../db/schema';

export class TaskService {
  async getAllTasks(filters?: {
    projectId?: number;
    tagId?: number;
    priority?: number;
    status?: number;
  }) {
    try {
      if (filters?.tagId !== undefined) {
        // Get tasks by tag
        return await db.query.tasks.findMany({
          where: inArray(
            tasks.id,
            db.select({ id: taskTags.taskId }).from(taskTags).where(eq(taskTags.tagId, filters.tagId)),
          ),
          with: {
            project: true,
            tags: { with: { tag: true } },
          },
        });
      }

      // Get tasks with optional filters
      const conditions = [
        ...(filters?.projectId !== undefined ? [eq(tasks.projectId, filters.projectId)] : []),
        ...(filters?.priority !== undefined ? [eq(tasks.priority, filters.priority)] : []),
        ...(filters?.status !== undefined ? [eq(tasks.status, filters.status)] : []),
      ];

      return await db.query.tasks.findMany({
        where: conditions.length ? and(...conditions) : undefined,
        with: {
          project: true,
          tags: { with: { tag: true } },
        },
        orderBy: (task, { desc }) => [desc(task.createdAt)],
      });
    } catch (error) {
      throw new Error(`Failed to fetch tasks: ${error}`);
    }
  }

  async getTaskById(id: number) {
    try {
      return await db.query.tasks.findFirst({
        where: eq(tasks.id, id),
        with: {
          project: true,
          tags: { with: { tag: true } },
        },
      });
    } catch (error) {
      throw new Error(`Failed to fetch task: ${error}`);
    }
  }

  async createTask(input: TaskInput) {
    // Validate priority (0-3) and status (0-4)
    if (input.priority < 0 || input.priority > 3) {
      throw new Error('Priority must be between 0 and 3');
    }
    if (input.status < 0 || input.status > 4) {
      throw new Error('Status must be between 0 and 4');
    }
    if (!input.title || input.title.trim() === '') {
      throw new Error('Title is required');
    }

    try {
      const [created] = await db
        .insert(tasks)
        .values({
          title: input.title,
          description: input.description,
          priority: input.priority,
          status: input.status,
          progress: input.progress || 0,
          projectId: input.projectId,
        })
        .returning();

      return this.getTaskById(created.id);
    } catch (error) {
      throw new Error(`Failed to create task: ${error}`);
    }
  }

  async updateTask(id: number, input: TaskUpdateInput) {
    // Validate inputs if provided
    if (input.priority !== undefined && (input.priority < 0 || input.priority > 3)) {
      throw new Error('Priority must be between 0 and 3');
    }
    if (input.status !== undefined && (input.status < 0 || input.status > 4)) {
      throw new Error('Status must be between 0 and 4');
    }
    if (input.title !== undefined && input.title.trim() === '') {
      throw new Error('Title cannot be empty');
    }

    try {
      await db
        .update(tasks)
        .set({
          ...(input.title && { title: input.title }),
          ...(input.description !== undefined && { description: input.description }),
          ...(input.priority !== undefined && { priority: input.priority }),
          ...(input.status !== undefined && { status: input.status }),
          ...(input.progress !== undefined && { progress: input.progress }),
          ...(input.projectId !== undefined && { projectId: input.projectId }),
        })
        .where(eq(tasks.id, id));

      return this.getTaskById(id);
    } catch (error) {
      throw new Error(`Failed to update task: ${error}`);
    }
  }

  async deleteTask(id: number) {
    try {
      await db.delete(tasks).where(eq(tasks.id, id));
      return true;
    } catch (error) {
      throw new Error(`Failed to delete task: ${error}`);
    }
  }

  async addTagToTask(taskId: number, tagId: number) {
    try {
      // Check if tag already exists for task
      const existing = await db.query.taskTags.findFirst({
        where: and(eq(taskTags.taskId, taskId), eq(taskTags.tagId, tagId)),
      });

      if (!existing) {
        await db.insert(taskTags).values({ taskId, tagId });
      }

      return await this.getTaskById(taskId);
    } catch (error) {
      throw new Error(`Failed to add tag to task: ${error}`);
    }
  }

  async removeTagFromTask(taskId: number, tagId: number) {
    try {
      await db.delete(taskTags).where(and(eq(taskTags.taskId, taskId), eq(taskTags.tagId, tagId)));

      return await this.getTaskById(taskId);
    } catch (error) {
      throw new Error(`Failed to remove tag from task: ${error}`);
    }
  }
}

export const taskService = new TaskService();
