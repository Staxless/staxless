/**
 * @file project-routes.ts
 * @description API routes for user project management
 */
import express, { type Request, type Response, type Router } from 'express';
import { Project } from '../models/project-model.js';

const router: Router = express.Router();

/**
 * Helper to extract user ID from Kong RBAC header
 */
function getUserId(req: Request): string | null {
  const userInfoHeader = req.headers['x-user-info'];
  if (!userInfoHeader) return null;

  try {
    const userInfo = JSON.parse(
      typeof userInfoHeader === 'string' ? userInfoHeader : userInfoHeader[0]
    );
    return userInfo.id || null;
  } catch {
    return null;
  }
}

/**
 * GET /user/projects
 * Returns all projects for the authenticated user
 */
router.get('/user/projects', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const projects = await Project.findByUserId(userId);

    res.json({
      projects: projects.map((p) => ({
        id: p._id.toString(),
        name: p.name,
        url: p.url,
        isActive: p.isActive,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /user/projects
 * Create a new project for the authenticated user
 */
router.post('/user/projects', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { name, url } = req.body;

    if (!name || !url) {
      res.status(400).json({ error: 'Name and URL are required' });
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      res.status(400).json({ error: 'Invalid URL format' });
      return;
    }

    const project = await Project.create({
      userId,
      name: name.trim(),
      url: url.trim(),
      isActive: true,
    });

    res.status(201).json({
      id: project._id?.toString(),
      name: project.name,
      url: project.url,
      isActive: project.isActive,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PUT /user/projects/:id
 * Update a project
 */
router.put('/user/projects/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const projectId = req.params.id;
    const { name, url, isActive } = req.body;

    // Validate URL if provided
    if (url) {
      try {
        new URL(url);
      } catch {
        res.status(400).json({ error: 'Invalid URL format' });
        return;
      }
    }

    const updates: { name?: string; url?: string; isActive?: boolean } = {};
    if (name !== undefined) updates.name = name.trim();
    if (url !== undefined) updates.url = url.trim();
    if (isActive !== undefined) updates.isActive = isActive;

    const result = await Project.update(projectId, userId, updates);

    if (result.matchedCount === 0) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    const updated = await Project.findById(projectId);
    if (!updated) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    res.json({
      id: updated._id.toString(),
      name: updated.name,
      url: updated.url,
      isActive: updated.isActive,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /user/projects/:id
 * Delete a project
 */
router.delete('/user/projects/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const projectId = req.params.id;
    const result = await Project.delete(projectId, userId);

    if (result.deletedCount === 0) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PATCH /user/projects/:id/toggle
 * Toggle project active status
 */
router.patch('/user/projects/:id/toggle', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const projectId = req.params.id;
    const result = await Project.toggleActive(projectId, userId);

    if (!result) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    const updated = await Project.findById(projectId);
    if (!updated) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    res.json({
      id: updated._id.toString(),
      name: updated.name,
      url: updated.url,
      isActive: updated.isActive,
    });
  } catch (error) {
    console.error('Error toggling project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
