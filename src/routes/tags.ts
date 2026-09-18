import { Router } from 'express';
import { tagService } from '../services';
import { createTagInputSchema, updateTagInputSchema } from '../validation/schemas';
import { asyncHandler } from '../middleware/errorHandling';

export const tagsRouter = Router();

tagsRouter.get('/', asyncHandler(async (_req, res) => {
  res.json(await tagService.getAllTags());
}));

tagsRouter.get('/:id', asyncHandler(async (req, res) => {
  const tag = await tagService.getTagById(Number(req.params.id));
  if (!tag) { res.status(404).json({ error: 'Tag not found' }); return; }
  res.json(tag);
}));

tagsRouter.post('/', asyncHandler(async (req, res) => {
  const input = createTagInputSchema.parse(req.body);
  res.status(201).json(await tagService.createTag(input));
}));

tagsRouter.put('/:id', asyncHandler(async (req, res) => {
  const input = updateTagInputSchema.parse(req.body);
  res.json(await tagService.updateTag(Number(req.params.id), input));
}));

tagsRouter.delete('/:id', asyncHandler(async (req, res) => {
  await tagService.deleteTag(Number(req.params.id));
  res.status(204).send();
}));
