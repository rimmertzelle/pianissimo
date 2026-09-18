import { Router } from 'express';
import { projectService } from '../services';
import { createProjectInputSchema, updateProjectInputSchema } from '../validation/schemas';
import { asyncHandler } from '../middleware/errorHandling';

export const projectsRouter = Router();

projectsRouter.get('/', asyncHandler(async (_req, res) => {
  res.json(await projectService.getAllProjects());
}));

projectsRouter.get('/:id', asyncHandler(async (req, res) => {
  const project = await projectService.getProjectById(Number(req.params.id));
  if (!project) { res.status(404).json({ error: 'Project not found' }); return; }
  res.json(project);
}));

projectsRouter.post('/', asyncHandler(async (req, res) => {
  const input = createProjectInputSchema.parse(req.body);
  res.status(201).json(await projectService.createProject(input));
}));

projectsRouter.put('/:id', asyncHandler(async (req, res) => {
  const input = updateProjectInputSchema.parse(req.body);
  res.json(await projectService.updateProject(Number(req.params.id), input));
}));

projectsRouter.delete('/:id', asyncHandler(async (req, res) => {
  await projectService.deleteProject(Number(req.params.id));
  res.status(204).send();
}));
