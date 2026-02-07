'use server';

import { cookies } from 'next/headers';
import {
  type ActionResult,
  success,
  failure,
  safeFetch,
  logError,
} from '@/lib/error-handling';
import { getApiGatewayUrl } from '@/lib/api-config';

export interface ChangelogEntry {
  sha: string;
  message: string;
  details: string[];
  date: string;
  author: string;
  type: 'feature' | 'fix' | 'improvement' | 'other';
}

export async function getChangelog(
  limit = 15
): Promise<ActionResult<ChangelogEntry[]>> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('auth_session');

    if (!sessionCookie) {
      return failure('No session cookie found. Please log in.');
    }

    const data = await safeFetch<{ entries: ChangelogEntry[] }>(
      `${getApiGatewayUrl()}/github/changelog?limit=${limit}`,
      {
        method: 'GET',
        headers: {
          Cookie: `auth_session=${sessionCookie.value}`,
        },
        cache: 'no-store',
      }
    );

    return success(data.entries);
  } catch (error) {
    logError(error, { action: 'getChangelog' });
    return failure('Failed to fetch changelog.');
  }
}
