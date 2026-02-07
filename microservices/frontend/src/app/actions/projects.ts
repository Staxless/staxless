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

export interface Project {
  id: string;
  name: string;
  url: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get all projects for the current user
 */
export async function getProjects(): Promise<ActionResult<Project[]>> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('auth_session');

    if (!sessionCookie) {
      return failure('No session cookie found. Please log in.');
    }

    const data = await safeFetch<{ projects: Project[] }>(
      `${getApiGatewayUrl()}/user/projects`,
      {
        method: 'GET',
        headers: {
          Cookie: `auth_session=${sessionCookie.value}`,
        },
        cache: 'no-store',
      }
    );

    return success(data.projects);
  } catch (error) {
    logError(error, { action: 'getProjects' });
    return failure('Failed to fetch projects.');
  }
}

/**
 * Create a new project
 */
export async function createProject(
  name: string,
  url: string
): Promise<ActionResult<Project>> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('auth_session');

    if (!sessionCookie) {
      return failure('No session cookie found. Please log in.');
    }

    const data = await safeFetch<Project>(
      `${getApiGatewayUrl()}/user/projects`,
      {
        method: 'POST',
        headers: {
          Cookie: `auth_session=${sessionCookie.value}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, url }),
        cache: 'no-store',
      }
    );

    return success(data);
  } catch (error) {
    logError(error, { action: 'createProject' });
    return failure('Failed to create project.');
  }
}

/**
 * Update a project
 */
export async function updateProject(
  projectId: string,
  updates: { name?: string; url?: string; isActive?: boolean }
): Promise<ActionResult<Project>> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('auth_session');

    if (!sessionCookie) {
      return failure('No session cookie found. Please log in.');
    }

    const data = await safeFetch<Project>(
      `${getApiGatewayUrl()}/user/projects/${projectId}`,
      {
        method: 'PUT',
        headers: {
          Cookie: `auth_session=${sessionCookie.value}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
        cache: 'no-store',
      }
    );

    return success(data);
  } catch (error) {
    logError(error, { action: 'updateProject' });
    return failure('Failed to update project.');
  }
}

/**
 * Delete a project
 */
export async function deleteProject(
  projectId: string
): Promise<ActionResult<boolean>> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('auth_session');

    if (!sessionCookie) {
      return failure('No session cookie found. Please log in.');
    }

    await safeFetch<{ success: boolean }>(
      `${getApiGatewayUrl()}/user/projects/${projectId}`,
      {
        method: 'DELETE',
        headers: {
          Cookie: `auth_session=${sessionCookie.value}`,
        },
        cache: 'no-store',
      }
    );

    return success(true);
  } catch (error) {
    logError(error, { action: 'deleteProject' });
    return failure('Failed to delete project.');
  }
}

/**
 * Toggle project active status
 */
export async function toggleProjectActive(
  projectId: string
): Promise<ActionResult<Project>> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('auth_session');

    if (!sessionCookie) {
      return failure('No session cookie found. Please log in.');
    }

    const data = await safeFetch<Project>(
      `${getApiGatewayUrl()}/user/projects/${projectId}/toggle`,
      {
        method: 'PATCH',
        headers: {
          Cookie: `auth_session=${sessionCookie.value}`,
        },
        cache: 'no-store',
      }
    );

    return success(data);
  } catch (error) {
    logError(error, { action: 'toggleProjectActive' });
    return failure('Failed to toggle project status.');
  }
}
