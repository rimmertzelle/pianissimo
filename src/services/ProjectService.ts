import { eq } from 'drizzle-orm';
import { ProjectInput, ProjectUpdateInput } from '../types';
import { db } from '../lib/db';
import { projects } from '../db/schema';

export class ProjectService {
  async getAllProjects() {
    try {
      return await db.query.projects.findMany({
        with: { tasks: true },
        orderBy: (project, { asc }) => [asc(project.id)],
      });
    } catch (error) {
      throw new Error(`Failed to fetch projects: ${error}`);
    }
  }

  async getProjectById(id: number) {
    try {
      return await db.query.projects.findFirst({
        where: eq(projects.id, id),
        with: {
          tasks: {
            with: {
              tags: { with: { tag: true } },
            },
          },
        },
      });
    } catch (error) {
      throw new Error(`Failed to fetch project: ${error}`);
    }
  }

  async createProject(input: ProjectInput) {
    if (!input.title || input.title.trim() === '') {
      throw new Error('Title is required');
    }

    try {
      const [created] = await db
        .insert(projects)
        .values({
          title: input.title,
          description: input.description,
        })
        .returning();

      return db.query.projects.findFirst({
        where: eq(projects.id, created.id),
        with: { tasks: true },
      });
    } catch (error) {
      throw new Error(`Failed to create project: ${error}`);
    }
  }

  async updateProject(id: number, input: ProjectUpdateInput) {
    if (input.title !== undefined && input.title.trim() === '') {
      throw new Error('Title cannot be empty');
    }

    try {
      await db
        .update(projects)
        .set({
          ...(input.title && { title: input.title }),
          ...(input.description !== undefined && { description: input.description }),
        })
        .where(eq(projects.id, id));

      return db.query.projects.findFirst({
        where: eq(projects.id, id),
        with: { tasks: true },
      });
    } catch (error) {
      throw new Error(`Failed to update project: ${error}`);
    }
  }

  async deleteProject(id: number) {
    try {
      await db.delete(projects).where(eq(projects.id, id));
      return true;
    } catch (error) {
      throw new Error(`Failed to delete project: ${error}`);
    }
  }
}

export const projectService = new ProjectService();
