// src/api/apiClient.ts
// Base URL from environment variable, fallback to production URL
const API_URL = import.meta.env.VITE_API_URL || 'https://mydomain.com/api';

// Interface for User (adjust based on your backend's response)
interface User {
  id: number;
  name: string;
  email: string;
}

// Error handling class
class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Fetches a list of users from the backend
 * @returns Promise<User[]>
 * @throws ApiError if the request fails
 */
export async function getUsers(): Promise<User[]> {
  const response = await fetch(`${API_URL}/users`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // Add Authorization header if Authelia provides a token
      // 'Authorization': `Bearer ${yourToken}`,
    },
    credentials: 'include', // Include cookies for Authelia authentication
  });

  if (!response.ok) {
    throw new ApiError(`Failed to fetch users: ${response.statusText}`, response.status);
  }

  return response.json();
}

/**
 * Creates a new user on the backend
 * @param userData - Partial user data to create
 * @returns Promise<User>
 * @throws ApiError if the request fails
 */
export async function createUser(userData: { name: string; email: string }): Promise<User> {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
    credentials: 'include', // Include cookies for Authelia
  });

  if (!response.ok) {
    throw new ApiError(`Failed to create user: ${response.statusText}`, response.status);
  }

  return response.json();
}

/**
 * Updates an existing user
 * @param id - User ID
 * @param userData - Partial user data to update
 * @returns Promise<User>
 * @throws ApiError if the request fails
 */
export async function updateUser(id: number, userData: Partial<User>): Promise<User> {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new ApiError(`Failed to update user: ${response.statusText}`, response.status);
  }

  return response.json();
}

/**
 * Deletes a user
 * @param id - User ID
 * @returns Promise<void>
 * @throws ApiError if the request fails
 */
export async function deleteUser(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new ApiError(`Failed to delete user: ${response.statusText}`, response.status);
  }
}
