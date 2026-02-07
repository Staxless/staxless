'use client';

import { ChevronDown, ChevronUp, ExternalLink, FolderKanban, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { BRAND_CONFIG } from '@config/brand-config';

interface Project {
  id: string;
  name: string;
  url: string;
  description: string;
  logoUrl?: string;
}

const STORAGE_KEY = 'staxless_project_showcase';

export default function ProjectShowcase() {
  const colors = BRAND_CONFIG.brand.colors;
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    url: '',
    description: '',
    logoUrl: '',
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProjects(JSON.parse(stored));
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  const saveProjects = (updated: Project[]) => {
    setProjects(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage errors
    }
  };

  const addProject = () => {
    if (!newProject.name || !newProject.url) return;
    const project: Project = {
      id: Date.now().toString(),
      name: newProject.name,
      url: newProject.url,
      description: newProject.description,
      logoUrl: newProject.logoUrl || undefined,
    };
    saveProjects([...projects, project]);
    setNewProject({ name: '', url: '', description: '', logoUrl: '' });
    setShowForm(false);
  };

  const removeProject = (id: string) => {
    saveProjects(projects.filter((p) => p.id !== id));
  };

  return (
    <Card
      className="border"
      style={{
        backgroundColor: colors.backgroundSecondary,
        borderColor: colors.border,
      }}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: colors.backgroundTertiary }}
            >
              <FolderKanban
                className="h-5 w-5"
                style={{ color: colors.primary }}
              />
            </div>
            <div>
              <CardTitle
                className="font-semibold text-lg"
                style={{ color: colors.textPrimary }}
              >
                Project Showcase
              </CardTitle>
              <p className="text-sm" style={{ color: colors.textMuted }}>
                Share what you&apos;ve built with Staxless
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border transition-colors"
            onClick={() => setShowForm(!showForm)}
            style={{
              borderColor: colors.border,
              color: colors.textPrimary,
              backgroundColor: 'transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                colors.backgroundTertiary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {showForm ? (
              <>
                <ChevronUp className="mr-1 h-4 w-4" />
                Hide
              </>
            ) : (
              <>
                <Plus className="mr-1 h-4 w-4" />
                Add Project
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Collapsible Add Project Form */}
        {showForm && (
          <div
            className="space-y-4 rounded-lg border p-4"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.backgroundTertiary,
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label
                  htmlFor="showcase-name"
                  style={{ color: colors.textPrimary }}
                >
                  Project Name *
                </Label>
                <Input
                  id="showcase-name"
                  placeholder="My SaaS App"
                  value={newProject.name}
                  onChange={(e) =>
                    setNewProject({ ...newProject, name: e.target.value })
                  }
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.textPrimary,
                  }}
                />
              </div>
              <div className="grid gap-2">
                <Label
                  htmlFor="showcase-url"
                  style={{ color: colors.textPrimary }}
                >
                  Project URL *
                </Label>
                <Input
                  id="showcase-url"
                  placeholder="https://myapp.com"
                  value={newProject.url}
                  onChange={(e) =>
                    setNewProject({ ...newProject, url: e.target.value })
                  }
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.textPrimary,
                  }}
                />
              </div>
              <div className="grid gap-2">
                <Label
                  htmlFor="showcase-description"
                  style={{ color: colors.textPrimary }}
                >
                  Short Description
                </Label>
                <Input
                  id="showcase-description"
                  placeholder="A brief description of your project"
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      description: e.target.value,
                    })
                  }
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.textPrimary,
                  }}
                />
              </div>
              <div className="grid gap-2">
                <Label
                  htmlFor="showcase-logo"
                  style={{ color: colors.textPrimary }}
                >
                  Logo / Screenshot URL
                </Label>
                <Input
                  id="showcase-logo"
                  placeholder="https://myapp.com/logo.png"
                  value={newProject.logoUrl}
                  onChange={(e) =>
                    setNewProject({ ...newProject, logoUrl: e.target.value })
                  }
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.textPrimary,
                  }}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                className="transition-colors"
                onClick={addProject}
                disabled={!newProject.name || !newProject.url}
                style={{
                  backgroundColor:
                    newProject.name && newProject.url
                      ? colors.primary
                      : colors.textMuted,
                  color: colors.background,
                }}
                onMouseEnter={(e) => {
                  if (newProject.name && newProject.url) {
                    e.currentTarget.style.backgroundColor =
                      colors.primaryHover;
                  }
                }}
                onMouseLeave={(e) => {
                  if (newProject.name && newProject.url) {
                    e.currentTarget.style.backgroundColor = colors.primary;
                  }
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Project
              </Button>
            </div>
          </div>
        )}

        {/* Project List */}
        {projects.length > 0 && (
          <>
            {showForm && (
              <Separator style={{ backgroundColor: colors.border }} />
            )}
            <div className="space-y-3">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between gap-4 rounded-lg border p-4"
                  style={{ borderColor: colors.border }}
                >
                  <div className="min-w-0 flex-1">
                    <p
                      className="font-medium text-sm"
                      style={{ color: colors.textPrimary }}
                    >
                      {project.name}
                    </p>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs hover:underline"
                      style={{ color: colors.primary }}
                    >
                      {project.url}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    {project.description && (
                      <p
                        className="mt-1 text-xs"
                        style={{ color: colors.textMuted }}
                      >
                        {project.description}
                      </p>
                    )}
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeProject(project.id)}
                    style={{ color: colors.textMuted }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}

        {projects.length === 0 && !showForm && (
          <p
            className="py-4 text-center text-sm"
            style={{ color: colors.textMuted }}
          >
            No projects yet. Add your first project built with Staxless!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
