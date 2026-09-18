import { relations } from 'drizzle-orm';
import { sqliteTable, integer, text, primaryKey } from 'drizzle-orm/sqlite-core';

export const projects = sqliteTable('projects', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description'),
});

export const tasks = sqliteTable('tasks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description'),
  priority: integer('priority').notNull(), // 0-3 (lowest to highest)
  status: integer('status').notNull(), // 0-4 (different task states)
  progress: integer('progress').notNull().default(0), // 0-100
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
  projectId: integer('project_id').references(() => projects.id, { onDelete: 'set null' }),
});

export const tags = sqliteTable('tags', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
});

export const taskTags = sqliteTable(
  'task_tags',
  {
    taskId: integer('taskId')
      .notNull()
      .references(() => tasks.id, { onDelete: 'cascade' }),
    tagId: integer('tagId')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
  },
  (table) => [primaryKey({ columns: [table.taskId, table.tagId] })],
);

export const projectsRelations = relations(projects, ({ many }) => ({
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  project: one(projects, { fields: [tasks.projectId], references: [projects.id] }),
  tags: many(taskTags),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  tasks: many(taskTags),
}));

export const taskTagsRelations = relations(taskTags, ({ one }) => ({
  task: one(tasks, { fields: [taskTags.taskId], references: [tasks.id] }),
  tag: one(tags, { fields: [taskTags.tagId], references: [tags.id] }),
}));
