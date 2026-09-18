import { eq } from 'drizzle-orm';
import { TagInput, TagUpdateInput } from '../types';
import { db } from '../lib/db';
import { tags } from '../db/schema';

export class TagService {
  async getAllTags() {
    try {
      return await db.query.tags.findMany({
        with: { tasks: { with: { task: true } } },
        orderBy: (tag, { asc }) => [asc(tag.title)],
      });
    } catch (error) {
      throw new Error(`Failed to fetch tags: ${error}`);
    }
  }

  async getTagById(id: number) {
    try {
      return await db.query.tags.findFirst({
        where: eq(tags.id, id),
        with: { tasks: { with: { task: true } } },
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
      const [created] = await db.insert(tags).values({ title: input.title }).returning();
      return this.getTagById(created.id);
    } catch (error) {
      throw new Error(`Failed to create tag: ${error}`);
    }
  }

  async updateTag(id: number, input: TagUpdateInput) {
    if (input.title !== undefined && input.title.trim() === '') {
      throw new Error('Title cannot be empty');
    }

    try {
      await db
        .update(tags)
        .set({
          ...(input.title && { title: input.title }),
        })
        .where(eq(tags.id, id));

      return this.getTagById(id);
    } catch (error) {
      throw new Error(`Failed to update tag: ${error}`);
    }
  }

  async deleteTag(id: number) {
    try {
      await db.delete(tags).where(eq(tags.id, id));
      return true;
    } catch (error) {
      throw new Error(`Failed to delete tag: ${error}`);
    }
  }
}

export const tagService = new TagService();
