import { Router } from 'express';
import { taskService } from '../services';
import { createTaskInputSchema, updateTaskInputSchema } from '../validation/schemas';
import { asyncHandler } from '../middleware/errorHandling';

export const tasksRouter = Router();

tasksRouter.get('/', asyncHandler(async (req, res) => {
  const { projectId, tagId, priority, status } = req.query;
  res.json(await taskService.getAllTasks({
    projectId: projectId !== undefined ? Number(projectId) : undefined,
    tagId: tagId !== undefined ? Number(tagId) : undefined,
    priority: priority !== undefined ? Number(priority) : undefined,
    status: status !== undefined ? Number(status) : undefined,
  }));
}));

tasksRouter.get('/:id', asyncHandler(async (req, res) => {
  const task = await taskService.getTaskById(Number(req.params.id));
  if (!task) { res.status(404).json({ error: 'Task not found' }); return; }
  res.json(task);
}));

tasksRouter.post('/', asyncHandler(async (req, res) => {
  const input = createTaskInputSchema.parse(req.body);
  res.status(201).json(await taskService.createTask(input));
}));

tasksRouter.put('/:id', asyncHandler(async (req, res) => {
  const input = updateTaskInputSchema.parse(req.body);
  res.json(await taskService.updateTask(Number(req.params.id), input));
}));

tasksRouter.delete('/:id', asyncHandler(async (req, res) => {
  await taskService.deleteTask(Number(req.params.id));
  res.status(204).send();
}));

tasksRouter.post('/:taskId/tags/:tagId', asyncHandler(async (req, res) => {
  res.json(await taskService.addTagToTask(Number(req.params.taskId), Number(req.params.tagId)));
}));

tasksRouter.delete('/:taskId/tags/:tagId', asyncHandler(async (req, res) => {
  res.json(await taskService.removeTagFromTask(Number(req.params.taskId), Number(req.params.tagId)));
}));
