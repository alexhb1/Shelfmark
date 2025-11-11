import { Book, StatusData, AppConfig, LoginCredentials, AuthResponse } from '../types';

const API_BASE = '/request/api';

// API endpoints
const API = {
  search: `${API_BASE}/search`,
  info: `${API_BASE}/info`,
  download: `${API_BASE}/download`,
  status: `${API_BASE}/status`,
  cancelDownload: `${API_BASE}/download`,
  setPriority: `${API_BASE}/queue`,
  clearCompleted: `${API_BASE}/queue/clear`,
  config: `${API_BASE}/config`,
  login: `${API_BASE}/auth/login`,
  logout: `${API_BASE}/auth/logout`,
  authCheck: `${API_BASE}/auth/check`
};

// Custom error class for authentication failures
export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

// Utility function for JSON fetch with credentials
async function fetchJSON<T>(url: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    ...opts,
    credentials: 'include',  // Enable cookies for session
    headers: {
      'Content-Type': 'application/json',
      ...opts.headers,
    },
  });
  
  if (res.status === 401) {
    throw new AuthenticationError('Unauthorized');
  }
  
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

// API functions
export const searchBooks = async (query: string): Promise<Book[]> => {
  if (!query) return [];
  return fetchJSON<Book[]>(`${API.search}?${query}`);
};

export const getBookInfo = async (id: string): Promise<Book> => {
  return fetchJSON<Book>(`${API.info}?id=${encodeURIComponent(id)}`);
};

export const downloadBook = async (id: string): Promise<void> => {
  await fetchJSON(`${API.download}?id=${encodeURIComponent(id)}`);
};

export const getStatus = async (): Promise<StatusData> => {
  return fetchJSON<StatusData>(API.status);
};

export const cancelDownload = async (id: string): Promise<void> => {
  await fetch(`${API.cancelDownload}/${encodeURIComponent(id)}/cancel`, { method: 'DELETE' });
};

export const clearCompleted = async (): Promise<void> => {
  const response = await fetch(`${API_BASE}/queue/clear`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to clear completed');
};

export const getConfig = async (): Promise<AppConfig> => {
  return fetchJSON<AppConfig>(API.config);
};

// Authentication functions
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  return fetchJSON<AuthResponse>(API.login, {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

export const logout = async (): Promise<AuthResponse> => {
  return fetchJSON<AuthResponse>(API.logout, {
    method: 'POST',
  });
};

export const checkAuth = async (): Promise<AuthResponse> => {
  return fetchJSON<AuthResponse>(API.authCheck);
};
