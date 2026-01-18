'use client';

import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

interface Project {
  id: string;
  name: string;
  url: string;
  isActive: boolean;
}

export function ProjectSettings() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState({ name: '', url: '' });

  const addProject = () => {
    if (newProject.name && newProject.url) {
      setProjects([
        ...projects,
        { ...newProject, id: Date.now().toString(), isActive: true },
      ]);
      setNewProject({ name: '', url: '' });
    }
  };

  const removeProject = (id: string) => {
    setProjects(projects.filter((project) => project.id !== id));
  };

  const toggleProjectStatus = (id: string) => {
    setProjects(
      projects.map((project) =>
        project.id === id
          ? { ...project, isActive: !project.isActive }
          : project
      )
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-lg">Connected Projects</h3>
        <p className="text-muted-foreground text-sm">
          Manage projects using your boilerplate.
        </p>
      </div>

      <Separator />

      <div className="space-y-4">
        {projects.map((project) => (
          <div
            className="flex items-center justify-between space-x-4"
            key={project.id}
          >
            <div className="grow space-y-1">
              <p className="font-medium">{project.name}</p>
              <p className="text-muted-foreground text-sm">{project.url}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={project.isActive}
                id={`project-status-${project.id}`}
                onCheckedChange={() => toggleProjectStatus(project.id)}
              />
              <Button
                onClick={() => removeProject(project.id)}
                size="icon"
                variant="ghost"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Separator />

      <div className="space-y-4">
        <h4 className="font-medium text-sm">Add New Project</h4>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="project-name">Project Name</Label>
            <Input
              id="project-name"
              onChange={(e) =>
                setNewProject({ ...newProject, name: e.target.value })
              }
              placeholder="My Awesome Project"
              value={newProject.name}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="project-url">Project URL</Label>
            <Input
              id="project-url"
              onChange={(e) =>
                setNewProject({ ...newProject, url: e.target.value })
              }
              placeholder="https://myproject.com"
              value={newProject.url}
            />
          </div>
        </div>
        <Button className="w-full" onClick={addProject}>
          <Plus className="mr-2 h-4 w-4" /> Add Project
        </Button>
      </div>
    </div>
  );
}
