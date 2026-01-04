const API_URL = 'https://code-x-pawm-s49d.vercel.app';

/**
 * Get headers with authorization token
 */
function getHeaders(token: string): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

/**
 * Progress data structure
 */
export interface ProgressData {
  python?: boolean;
  pyIfElse?: boolean;
  pyLoops?: boolean;
  pyArrays?: boolean;
  pyFunctions?: boolean;
  pyExercise?: boolean;
  [key: string]: boolean | undefined;
}

/**
 * Get user progress from the backend
 */
export async function getProgress(token: string): Promise<ProgressData> {
  try {
    const response = await fetch(`${API_URL}/api/progress`, {
      method: 'GET',
      headers: getHeaders(token),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch progress: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching progress:', error);
    throw error;
  }
}

/**
 * Update user progress on the backend
 */
export async function updateProgress(
  token: string,
  modules: Record<string, boolean>
): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/api/progress`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ modules }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update progress: ${response.status}`);
    }
  } catch (error) {
    console.error('Error updating progress:', error);
    throw error;
  }
}

/**
 * Get Auth URL for Google OAuth
 */
export function getGoogleAuthUrl(): string {
  return `${API_URL}/auth/google`;
}
