/**
 * @file app/actions/get-user-settings.ts
 * @description Server action for fetching user settings including account and subscription info
 */
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

export interface UserSettings {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  avatar?: string;
  subscription: {
    type: string;
    status: 'active' | 'pending_cancellation' | 'canceled' | 'none';
    startDate: string;
    endDate?: string | null;
  };
}

export async function getUserSettings(): Promise<ActionResult<UserSettings>> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('auth_session');

    if (!sessionCookie) {
      return failure('No session cookie found. Please log in.');
    }

    const data = await safeFetch<UserSettings>(
      `${getApiGatewayUrl()}/user/settings`,
      {
        method: 'GET',
        headers: {
          Cookie: `auth_session=${sessionCookie.value}`,
        },
        cache: 'no-store',
      }
    );

    return success(data);
  } catch (error) {
    logError(error, { action: 'getUserSettings' });
    return failure('Failed to fetch user settings.');
  }
}
