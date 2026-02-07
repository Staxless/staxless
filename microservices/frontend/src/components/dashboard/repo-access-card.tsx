'use client';

import { ExternalLink, Github } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BRAND_CONFIG } from '@config/brand-config';

interface RepoAccessCardProps {
  userEmail: string;
  subscriptionStatus: string;
}

const REPO_URL = 'https://github.com/Staxless/staxless';

export default function RepoAccessCard({
  userEmail,
  subscriptionStatus,
}: RepoAccessCardProps) {
  const colors = BRAND_CONFIG.brand.colors;
  const isActive = subscriptionStatus === 'active';

  return (
    <Card
      className="overflow-hidden border"
      style={{
        backgroundColor: colors.backgroundSecondary,
        borderColor: colors.border,
      }}
    >
      <div
        className="h-1"
        style={{
          background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary}, ${colors.accent})`,
        }}
      />
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg"
            style={{ backgroundColor: colors.backgroundTertiary }}
          >
            <Github className="h-5 w-5" style={{ color: colors.primary }} />
          </div>
          <div>
            <CardTitle
              className="font-semibold text-lg"
              style={{ color: colors.textPrimary }}
            >
              Repository Access
            </CardTitle>
            <p className="text-sm" style={{ color: colors.textMuted }}>
              {userEmail}
            </p>
          </div>
        </div>
        <Badge
          className="border-0"
          style={{
            backgroundColor: isActive ? colors.success : colors.warning,
            color: colors.background,
          }}
        >
          {isActive ? 'Access Granted' : 'Access Pending'}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button
              className="w-full transition-colors"
              style={{
                backgroundColor: colors.primary,
                color: colors.background,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.primaryHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.primary;
              }}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Repository
            </Button>
          </a>
          <a
            href="https://github.com/Staxless/staxless-docs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button
              className="w-full border transition-colors"
              variant="outline"
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
              <ExternalLink className="mr-2 h-4 w-4" />
              View Documentation
            </Button>
          </a>
        </div>

        <p className="text-xs" style={{ color: colors.textMuted }}>
          Check your GitHub notifications if you haven&apos;t accepted the
          repository invitation yet.
        </p>
      </CardContent>
    </Card>
  );
}
