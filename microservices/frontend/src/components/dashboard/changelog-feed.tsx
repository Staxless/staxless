'use client';

import { GitCommit, History } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { ChangelogEntry } from '@/app/actions/get-changelog';
import { BRAND_CONFIG } from '@config/brand-config';

interface ChangelogFeedProps {
  entries: ChangelogEntry[];
}

const TYPE_STYLES: Record<
  string,
  { label: string; colorKey: 'success' | 'error' | 'primary' | 'warning' }
> = {
  feature: { label: 'Feature', colorKey: 'success' },
  fix: { label: 'Fix', colorKey: 'error' },
  improvement: { label: 'Improvement', colorKey: 'primary' },
  other: { label: 'Update', colorKey: 'warning' },
};

export default function ChangelogFeed({ entries }: ChangelogFeedProps) {
  const colors = BRAND_CONFIG.brand.colors;

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
              <History
                className="h-5 w-5"
                style={{ color: colors.primary }}
              />
            </div>
            <div>
              <CardTitle
                className="font-semibold text-lg"
                style={{ color: colors.textPrimary }}
              >
                Changelog
              </CardTitle>
              <p className="text-sm" style={{ color: colors.textMuted }}>
                Latest updates from the repository
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {entries.length === 0 ? (
          <p
            className="py-4 text-center text-sm"
            style={{ color: colors.textMuted }}
          >
            No changelog entries available.
          </p>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => {
              const typeStyle = TYPE_STYLES[entry.type] || TYPE_STYLES.other;
              return (
                <div
                  key={entry.sha}
                  className="flex gap-3 rounded-lg border p-3"
                  style={{ borderColor: colors.border }}
                >
                  <div className="mt-0.5 shrink-0">
                    <GitCommit
                      className="h-4 w-4"
                      style={{ color: colors.textMuted }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span
                        className="font-medium text-sm"
                        style={{ color: colors.textPrimary }}
                      >
                        {entry.message}
                      </span>
                      <Badge
                        className="border-0 text-xs"
                        style={{
                          backgroundColor: `${colors[typeStyle.colorKey]}20`,
                          color: colors[typeStyle.colorKey],
                        }}
                      >
                        {typeStyle.label}
                      </Badge>
                    </div>
                    {entry.details && entry.details.length > 0 && (
                      <ul
                        className="mb-1 list-inside list-disc space-y-0.5 text-xs"
                        style={{ color: colors.textMuted }}
                      >
                        {entry.details.map((detail, idx) => (
                          <li key={idx}>{detail}</li>
                        ))}
                      </ul>
                    )}
                    <div className="flex items-center gap-3">
                      <span
                        className="font-mono text-xs"
                        style={{ color: colors.textMuted }}
                      >
                        {entry.sha}
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: colors.textMuted }}
                      >
                        {new Date(entry.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: colors.textMuted }}
                      >
                        {entry.author}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
