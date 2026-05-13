/**
 * Lightweight API client for frontend apps.
 * Works with the Yapper Express API.
 */

const DEFAULT_API_URL = "https://yapper-mc7e.onrender.com";

function baseUrl(): string {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  return DEFAULT_API_URL;
}

export function apiUrl(path: string): string {
  return `${baseUrl()}${path}`;
}

export async function apiFetch<T>(
  path: string,
  options?: RequestInit & { token?: string }
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string>)
  };

  if (options?.token) {
    headers["Authorization"] = `Bearer ${options.token}`;
  }

  const response = await fetch(apiUrl(path), {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ error: { message: response.statusText } }));
    throw new ApiError(response.status, errorBody.error?.message ?? "API request failed", errorBody);
  }

  return response.json() as Promise<T>;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}
