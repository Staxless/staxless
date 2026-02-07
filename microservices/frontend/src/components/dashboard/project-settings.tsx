'use client';

import { Loader2, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { BRAND_CONFIG } from '@config/brand-config';
import {
  getProjects,
  createProject,
  deleteProject,
  toggleProjectActive,
  type Project,
} from '@/app/actions/projects';

export function ProjectSettings() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState({ name: '', url: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const colors = BRAND_CONFIG.brand.colors;

  // Load projects on mount
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setIsLoading(true);
    setError(null);
    const result = await getProjects();
    if (result.success) {
      setProjects(result.data);
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  };

  const addProject = async () => {
    if (!newProject.name || !newProject.url) return;

    setIsAdding(true);
    setError(null);

    const result = await createProject(newProject.name, newProject.url);
    if (result.success) {
      setProjects([result.data, ...projects]);
      setNewProject({ name: '', url: '' });
    } else {
      setError(result.error);
    }
    setIsAdding(false);
  };

  const removeProject = async (id: string) => {
    const result = await deleteProject(id);
    if (result.success) {
      setProjects(projects.filter((project) => project.id !== id));
    } else {
      setError(result.error);
    }
  };

  const toggleProjectStatus = async (id: string) => {
    const result = await toggleProjectActive(id);
    if (result.success) {
      setProjects(
        projects.map((project) =>
          project.id === id ? { ...project, isActive: result.data.isActive } : project
        )
      );
    } else {
      setError(result.error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" style={{ color: colors.primary }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-lg" style={{ color: colors.textPrimary }}>
          Your Projects
        </h3>
        <p className="text-sm" style={{ color: colors.textMuted }}>
          Add your projects to share backlinks and showcase what you&apos;ve built.
        </p>
      </div>

      {error && (
        <p className="text-sm" style={{ color: colors.error }}>
          {error}
        </p>
      )}

      <Separator style={{ backgroundColor: colors.border }} />

      <div className="space-y-4">
        {projects.length === 0 ? (
          <p className="text-sm py-4 text-center" style={{ color: colors.textMuted }}>
            No projects yet. Add your first project below.
          </p>
        ) : (
          projects.map((project) => (
            <div
              className="flex items-center justify-between space-x-4 p-3 rounded-lg"
              key={project.id}
              style={{ backgroundColor: colors.backgroundTertiary }}
            >
              <div className="grow space-y-1 min-w-0">
                <p className="font-medium truncate" style={{ color: colors.textPrimary }}>
                  {project.name}
                </p>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm truncate block hover:underline"
                  style={{ color: colors.primary }}
                >
                  {project.url}
                </a>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <Switch
                  checked={project.isActive}
                  id={`project-status-${project.id}`}
                  onCheckedChange={() => toggleProjectStatus(project.id)}
                />
                <Button
                  onClick={() => removeProject(project.id)}
                  size="icon"
                  variant="ghost"
                  style={{ color: colors.textMuted }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <Separator style={{ backgroundColor: colors.border }} />

      <div className="space-y-4">
        <h4 className="font-medium text-sm" style={{ color: colors.textPrimary }}>
          Add New Project
        </h4>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="project-name" style={{ color: colors.textPrimary }}>
              Project Name
            </Label>
            <Input
              id="project-name"
              onChange={(e) =>
                setNewProject({ ...newProject, name: e.target.value })
              }
              placeholder="My Awesome Project"
              value={newProject.name}
              style={{
                backgroundColor: colors.backgroundTertiary,
                borderColor: colors.border,
                color: colors.textPrimary,
              }}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="project-url" style={{ color: colors.textPrimary }}>
              Project URL
            </Label>
            <Input
              id="project-url"
              onChange={(e) =>
                setNewProject({ ...newProject, url: e.target.value })
              }
              placeholder="https://myproject.com"
              value={newProject.url}
              style={{
                backgroundColor: colors.backgroundTertiary,
                borderColor: colors.border,
                color: colors.textPrimary,
              }}
            />
          </div>
        </div>
        <Button
          className="w-full transition-colors"
          onClick={addProject}
          disabled={isAdding || !newProject.name || !newProject.url}
          style={{
            backgroundColor: colors.primary,
            color: colors.background,
          }}
          onMouseEnter={(e) => {
            if (!isAdding) e.currentTarget.style.backgroundColor = colors.primaryHover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = colors.primary;
          }}
        >
          {isAdding ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          {isAdding ? 'Adding...' : 'Add Project'}
        </Button>
      </div>
    </div>
  );
}
