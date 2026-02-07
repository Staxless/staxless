/**
 * @file services/github-api.ts
 * @description GitHub API service for managing repository collaborators
 */

import { loadSecret } from '../lib/secrets-manager.js';

const GITHUB_TOKEN = loadSecret('GITHUB_TOKEN') || process.env.GITHUB_TOKEN;
const GITHUB_API_BASE = 'https://api.github.com';

// Repository to grant access to
const REPO_OWNER = 'Staxless';
const REPO_NAME = 'staxless';

interface GitHubUser {
  id: number;
  login: string;
  name: string | null;
  email: string | null;
  avatar_url: string;
}

interface CollaboratorInvitation {
  id: number;
  repository: {
    id: number;
    name: string;
    full_name: string;
  };
  invitee: GitHubUser;
  permissions: string;
}

/**
 * Get GitHub user by their numeric ID
 * @param userId - GitHub numeric user ID
 * @returns GitHub user profile or null if not found
 */
export async function getGitHubUserById(userId: string): Promise<GitHubUser | null> {
  if (!GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN is not configured');
  }

  try {
    const response = await fetch(`${GITHUB_API_BASE}/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`[GitHub API] User not found with ID: ${userId}`);
        return null;
      }
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`[GitHub API] Failed to fetch user ${userId}:`, error);
    throw error;
  }
}

/**
 * Add a user as a collaborator to the Staxless repository with triage permission
 * @param username - GitHub username
 * @returns Invitation details or null if user is already a collaborator
 */
export async function addRepoCollaborator(username: string): Promise<CollaboratorInvitation | null> {
  if (!GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN is not configured');
  }

  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/collaborators/${username}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          permission: 'triage', // Read access + manage issues/PRs
        }),
      }
    );

    // 201 = invitation created, 204 = user is already a collaborator
    if (response.status === 201) {
      const invitation = await response.json();
      console.log(`[GitHub API] Invitation sent to ${username} for ${REPO_OWNER}/${REPO_NAME}`);
      return invitation;
    }

    if (response.status === 204) {
      console.log(`[GitHub API] ${username} is already a collaborator on ${REPO_OWNER}/${REPO_NAME}`);
      return null;
    }

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`GitHub API error: ${response.status} ${response.statusText} - ${errorBody}`);
    }

    return null;
  } catch (error) {
    console.error(`[GitHub API] Failed to add collaborator ${username}:`, error);
    throw error;
  }
}

/**
 * Remove a user from the repository collaborators
 * @param username - GitHub username
 * @returns true if removed, false if user wasn't a collaborator
 */
export async function removeRepoCollaborator(username: string): Promise<boolean> {
  if (!GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN is not configured');
  }

  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/collaborators/${username}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
      }
    );

    if (response.status === 204) {
      console.log(`[GitHub API] Removed ${username} from ${REPO_OWNER}/${REPO_NAME}`);
      return true;
    }

    if (response.status === 404) {
      console.log(`[GitHub API] ${username} was not a collaborator on ${REPO_OWNER}/${REPO_NAME}`);
      return false;
    }

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`GitHub API error: ${response.status} ${response.statusText} - ${errorBody}`);
    }

    return false;
  } catch (error) {
    console.error(`[GitHub API] Failed to remove collaborator ${username}:`, error);
    throw error;
  }
}

export interface ChangelogEntry {
  sha: string;
  message: string;
  details: string[];
  date: string;
  author: string;
  type: 'feature' | 'fix' | 'improvement' | 'other';
}

function parseCommitType(
  message: string
): 'feature' | 'fix' | 'improvement' | 'other' {
  const lower = message.toLowerCase();
  if (lower.startsWith('feat')) return 'feature';
  if (lower.startsWith('fix')) return 'fix';
  if (
    lower.startsWith('refactor') ||
    lower.startsWith('perf') ||
    lower.startsWith('improve') ||
    lower.startsWith('chore') ||
    lower.startsWith('style')
  )
    return 'improvement';
  return 'other';
}

function parseCommitMessage(message: string): {
  title: string;
  details: string[];
} {
  const lines = message.split('\n');
  const firstLine = lines[0];

  // Strip conventional commit prefix: "feat(scope): message" -> "message"
  const conventionalMatch = firstLine.match(
    /^(?:feat|fix|chore|refactor|perf|style|test|docs|ci|build|revert)(?:\([^)]*\))?[!]?:\s*(.+)/i
  );
  const title = conventionalMatch ? conventionalMatch[1] : firstLine;

  // Parse body lines into bullet points
  const details = lines
    .slice(1)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('Co-Authored-By'))
    .map((l) => l.replace(/^[-*]\s*/, '')); // Strip leading bullet markers

  return {
    title: title.charAt(0).toUpperCase() + title.slice(1),
    details,
  };
}

/**
 * Fetch recent commits from the repository
 * @param limit - Number of commits to fetch (max 50)
 * @returns Array of parsed changelog entries
 */
export async function getRepoCommits(limit = 15): Promise<ChangelogEntry[]> {
  if (!GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN is not configured');
  }

  const perPage = Math.min(Math.max(limit, 1), 50);

  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/commits?per_page=${perPage}`,
    {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GitHub API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  interface GitHubCommitResponse {
    sha: string;
    commit: {
      message: string;
      author: {
        name: string;
        date: string;
      };
    };
  }

  const commits: GitHubCommitResponse[] = await response.json();

  return commits
    .filter((c) => {
      const msg = c.commit.message.toLowerCase();
      return (
        !msg.startsWith('merge') &&
        !msg.includes('[skip ci]') &&
        !msg.startsWith('chore(release)')
      );
    })
    .map((commit) => {
      const { title, details } = parseCommitMessage(commit.commit.message);
      return {
        sha: commit.sha.slice(0, 7),
        message: title,
        details,
        date: commit.commit.author.date,
        author: commit.commit.author.name,
        type: parseCommitType(commit.commit.message),
      };
    });
}

/**
 * Check if a user is a collaborator on the repository
 * @param username - GitHub username
 * @returns true if user is a collaborator
 */
export async function checkCollaborator(username: string): Promise<boolean> {
  if (!GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN is not configured');
  }

  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/collaborators/${username}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
      }
    );

    return response.status === 204;
  } catch (error) {
    console.error(`[GitHub API] Failed to check collaborator ${username}:`, error);
    return false;
  }
}
