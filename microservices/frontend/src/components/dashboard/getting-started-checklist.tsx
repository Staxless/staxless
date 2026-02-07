'use client';

import { Check, ListChecks } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BRAND_CONFIG } from '@config/brand-config';

const STORAGE_KEY = 'staxless_checklist_progress';

const CHECKLIST_STEPS = [
  {
    id: 'link-github',
    label: 'Link GitHub account',
    description: 'Sign in with GitHub to get repo access',
  },
  {
    id: 'clone-repo',
    label: 'Clone the repository',
    description: 'git clone the Staxless repo to your machine',
  },
  {
    id: 'run-init',
    label: 'Run staxless init',
    description: 'Initialize your project with the CLI',
  },
  {
    id: 'start-dev',
    label: 'Start dev environment',
    description: 'Run staxless dev start to spin up all services',
  },
  {
    id: 'generate-service',
    label: 'Generate your first service',
    description: 'Run staxless generate service to scaffold a new microservice',
  },
  {
    id: 'deploy-prod',
    label: 'Deploy to production',
    description: 'Run staxless prod deploy to ship your project',
  },
];

export default function GettingStartedChecklist() {
  const colors = BRAND_CONFIG.brand.colors;
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCompleted(JSON.parse(stored));
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  const toggleStep = (stepId: string) => {
    const updated = { ...completed, [stepId]: !completed[stepId] };
    setCompleted(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage errors
    }
  };

  const completedCount = CHECKLIST_STEPS.filter(
    (step) => completed[step.id]
  ).length;
  const totalCount = CHECKLIST_STEPS.length;
  const progressPercent = (completedCount / totalCount) * 100;

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
              <ListChecks
                className="h-5 w-5"
                style={{ color: colors.primary }}
              />
            </div>
            <div>
              <CardTitle
                className="font-semibold text-lg"
                style={{ color: colors.textPrimary }}
              >
                Getting Started
              </CardTitle>
              <p className="text-sm" style={{ color: colors.textMuted }}>
                {completedCount} of {totalCount} complete
              </p>
            </div>
          </div>
          <span
            className="font-semibold text-2xl"
            style={{ color: colors.primary }}
          >
            {Math.round(progressPercent)}%
          </span>
        </div>
        <div
          className="mt-3 h-2 w-full overflow-hidden rounded-full"
          style={{ backgroundColor: colors.backgroundTertiary }}
        >
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              backgroundColor: colors.primary,
              width: `${progressPercent}%`,
            }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        {CHECKLIST_STEPS.map((step) => {
          const isChecked = completed[step.id];

          return (
            <button
              key={step.id}
              type="button"
              className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors"
              onClick={() => toggleStep(step.id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  colors.backgroundTertiary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors"
                style={{
                  backgroundColor: isChecked
                    ? colors.primary
                    : 'transparent',
                  borderColor: isChecked ? colors.primary : colors.border,
                }}
              >
                {isChecked && (
                  <Check
                    className="h-3 w-3"
                    style={{ color: colors.background }}
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <span
                  className="font-medium text-sm"
                  style={{
                    color: isChecked
                      ? colors.textMuted
                      : colors.textPrimary,
                    textDecoration: isChecked ? 'line-through' : 'none',
                  }}
                >
                  {step.label}
                </span>
                <p className="text-xs" style={{ color: colors.textMuted }}>
                  {step.description}
                </p>
              </div>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}
