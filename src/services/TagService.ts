import { TagInput, TagUpdateInput } from '../types';
import { prisma } from '../lib/prisma';

export class TagService {
  async getAllTags() {
    try {
      return await prisma.tag.findMany({
        include: {
          tasks: {
            include: {
              task: true,
            },
          },
        },
        orderBy: {
          title: 'asc',
        },
      });
    } catch (error) {
      throw new Error(`Failed to fetch tags: ${error}`);
    }
  }

  async getTagById(id: number) {
    try {
      return await prisma.tag.findUnique({
        where: { id },
        include: {
          tasks: {
            include: {
              task: true,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(`Failed to fetch tag: ${error}`);
    }
  }

  async createTag(input: TagInput) {
    if (!input.title || input.title.trim() === '') {
      throw new Error('Title is required');
    }

    try {
      return await prisma.tag.create({
        data: {
          title: input.title,
        },
        include: {
          tasks: {
            include: {
              task: true,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(`Failed to create tag: ${error}`);
    }
  }

  async updateTag(id: number, input: TagUpdateInput) {
    if (input.title !== undefined && input.title.trim() === '') {
      throw new Error('Title cannot be empty');
    }

    try {
      return await prisma.tag.update({
        where: { id },
        data: {
          ...(input.title && { title: input.title }),
        },
        include: {
          tasks: {
            include: {
              task: true,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(`Failed to update tag: ${error}`);
    }
  }

  async deleteTag(id: number) {
    try {
      await prisma.tag.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      throw new Error(`Failed to delete tag: ${error}`);
    }
  }
}

export const tagService = new TagService();
