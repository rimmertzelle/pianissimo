import { ProjectInput, ProjectUpdateInput } from '../types';
import { prisma } from '../lib/prisma';

export class ProjectService {
  async getAllProjects() {
    try {
      return await prisma.project.findMany({
        include: {
          tasks: true,
        },
        orderBy: {
          id: 'asc',
        },
      });
    } catch (error) {
      throw new Error(`Failed to fetch projects: ${error}`);
    }
  }

  async getProjectById(id: number) {
    try {
      return await prisma.project.findUnique({
        where: { id },
        include: {
          tasks: {
            include: {
              tags: {
                include: {
                  tag: true,
                },
              },
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
      return await prisma.project.create({
        data: {
          title: input.title,
          description: input.description,
        },
        include: {
          tasks: true,
        },
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
      return await prisma.project.update({
        where: { id },
        data: {
          ...(input.title && { title: input.title }),
          ...(input.description !== undefined && { description: input.description }),
        },
        include: {
          tasks: true,
        },
      });
    } catch (error) {
      throw new Error(`Failed to update project: ${error}`);
    }
  }

  async deleteProject(id: number) {
    try {
      await prisma.project.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      throw new Error(`Failed to delete project: ${error}`);
    }
  }
}

export const projectService = new ProjectService();
