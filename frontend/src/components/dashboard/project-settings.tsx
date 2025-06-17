"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

interface Project {
  id: string
  name: string
  url: string
  isActive: boolean
}

export function ProjectSettings() {
  const [projects, setProjects] = useState<Project[]>([
  ])
  const [newProject, setNewProject] = useState({ name: "", url: "" })

  const addProject = () => {
    if (newProject.name && newProject.url) {
      setProjects([...projects, { ...newProject, id: Date.now().toString(), isActive: true }])
      setNewProject({ name: "", url: "" })
    }
  }

  const removeProject = (id: string) => {
    setProjects(projects.filter((project) => project.id !== id))
  }

  const toggleProjectStatus = (id: string) => {
    setProjects(projects.map((project) => (project.id === id ? { ...project, isActive: !project.isActive } : project)))
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Connected Projects</h3>
        <p className="text-sm text-muted-foreground">Manage projects using your boilerplate.</p>
      </div>

      <Separator />

      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="flex items-center justify-between space-x-4">
            <div className="grow space-y-1">
              <p className="font-medium">{project.name}</p>
              <p className="text-sm text-muted-foreground">{project.url}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id={`project-status-${project.id}`}
                checked={project.isActive}
                onCheckedChange={() => toggleProjectStatus(project.id)}
              />
              <Button variant="ghost" size="icon" onClick={() => removeProject(project.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Separator />

      <div className="space-y-4">
        <h4 className="text-sm font-medium">Add New Project</h4>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="project-name">Project Name</Label>
            <Input
              id="project-name"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              placeholder="My Awesome Project"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="project-url">Project URL</Label>
            <Input
              id="project-url"
              value={newProject.url}
              onChange={(e) => setNewProject({ ...newProject, url: e.target.value })}
              placeholder="https://myproject.com"
            />
          </div>
        </div>
        <Button onClick={addProject} className="w-full">
          <Plus className="mr-2 h-4 w-4" /> Add Project
        </Button>
      </div>
    </div>
  )
}

