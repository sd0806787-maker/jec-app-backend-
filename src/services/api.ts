/**
 * Central API configuration and HTTP client.
 *
 * All base URLs can be overridden with EXPO_PUBLIC_* environment variables
 * (see `.env.example`). Expo inlines these at build time, so they must be
 * referenced statically as `process.env.EXPO_PUBLIC_*`.
 */

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

const HOSTED_API_URL = 'https://jec-backend.onrender.com';

/** ngrok-style tunnel URLs only exist while the developer's machine is online. */
const isTunnelUrl = (url: string) =>
  /ngrok(?:-app|-free)?\.(?:dev|io|app)/i.test(url);

/**
 * Backend used for campus issues, lost & found and auth.
 *
 * The default is the hosted Render service (see `render.yaml`). Override it
 * with EXPO_PUBLIC_API_URL for local development / ngrok tunnels. Tunnel URLs
 * are ignored in release builds and OTA updates *unless* EXPO_PUBLIC_ALLOW_TUNNEL
 * is explicitly "true". That opt-in keeps a tunnel URL from ever being shipped
 * by accident (the "campus server is currently offline" failure) while still
 * allowing a deliberate tunnel-backed build when no hosted backend is owned.
 * Such a build only works while the developer's machine and ngrok stay online.
 */
const configuredApiUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
const tunnelOptIn = process.env.EXPO_PUBLIC_ALLOW_TUNNEL === 'true';
const useConfiguredUrl =
  configuredApiUrl && (__DEV__ || tunnelOptIn || !isTunnelUrl(configuredApiUrl));

export const API_BASE_URL = trimTrailingSlash(
  useConfiguredUrl ? configuredApiUrl : HOSTED_API_URL,
);

/** Official JEC attendance portal (read-only student reports). */
export const ATTENDANCE_API_URL = trimTrailingSlash(
  process.env.EXPO_PUBLIC_ATTENDANCE_API_URL ??
    'https://attendance.jecassam.ac.in',
);

/** GitHub raw bucket that hosts timetable/syllabus/criteria/... JSON files. */
export const CONTENT_BASE_URL = trimTrailingSlash(
  process.env.EXPO_PUBLIC_CONTENT_BASE_URL ??
    'https://raw.githubusercontent.com/souvikdas1757/jec-app-data/refs/heads/main',
);

const DEFAULT_TIMEOUT_MS = 15000;

export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(message: string, status = 0, body?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

type Json = Record<string, unknown>;

const joinUrl = (base: string, path: string) =>
  `${base}/${path.replace(/^\/+/, '')}`;

export interface ApiRequestOptions extends Omit<RequestInit, 'signal'> {
  /** Override the default request timeout (milliseconds). */
  timeoutMs?: number;
}

/**
 * Perform a JSON request against the campus backend.
 *
 * Adds the `ngrok-skip-browser-warning` header (harmless for non-ngrok hosts),
 * parses JSON safely and throws a typed {@link ApiError} for non-2xx responses.
 */
export async function apiRequest<T = Json>(
  path: string,
  { timeoutMs = DEFAULT_TIMEOUT_MS, headers, ...init }: ApiRequestOptions = {},
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(joinUrl(API_BASE_URL, path), {
      ...init,
      headers: {
        Accept: 'application/json',
        ...(init.body ? { 'Content-Type': 'application/json' } : null),
        'ngrok-skip-browser-warning': 'true',
        ...(headers as Record<string, string> | undefined),
      },
      signal: controller.signal,
    });

    const text = await response.text();
    let data: unknown = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }

    if (!response.ok) {
      // ngrok (and some proxies) answer with an HTML error page when the tunnel
      // is down. Treat that as a connectivity problem rather than a real 404.
      const contentType = response.headers.get('content-type') ?? '';
      const isHtmlPage =
        contentType.includes('text/html') ||
        (typeof data === 'string' && data.trimStart().startsWith('<'));
      if (isHtmlPage || response.headers.get('ngrok-error-code')) {
        throw new ApiError(
          'The campus server is currently offline. Please try again in a moment.',
          0,
          data,
        );
      }

      const message =
        (data as Json | null)?.message ??
        (data as Json | null)?.error ??
        `Request failed (${response.status})`;
      throw new ApiError(String(message), response.status, data);
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('Request timed out. Check your connection.', 0);
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Network request failed',
      0,
    );
  } finally {
    clearTimeout(timeout);
  }
}

/* -------------------------------------------------------------------------- */
/*  Domain types                                                              */
/* -------------------------------------------------------------------------- */

export interface Issue {
  _id: string;
  title: string;
  description: string;
  location: string;
  reportedBy: string;
  status: string;
  createdAt: string;
  imageBase64?: string;
}

export interface LostFoundItem {
  _id: string;
  type: 'Lost' | 'Found';
  itemName: string;
  description: string;
  location: string;
  contact: string;
  reportedBy: string;
  createdAt: string;
  imageBase64?: string;
}

interface DataResponse<T> {
  success: boolean;
  data: T;
}

interface ListResponse<T> {
  success: boolean;
  count?: number;
  data: T[];
}

/* -------------------------------------------------------------------------- */
/*  Campus issues                                                             */
/* -------------------------------------------------------------------------- */

export const issuesApi = {
  async list(): Promise<Issue[]> {
    const res = await apiRequest<ListResponse<Issue> | Issue[]>('/api/issues/all', {
      timeoutMs: 6000,
    });
    return Array.isArray(res) ? res : (res.data ?? []);
  },

  async get(id: string): Promise<Issue> {
    const res = await apiRequest<DataResponse<Issue>>(`/api/issues/${id}`);
    return res.data;
  },

  async report(payload: {
    title: string;
    description: string;
    location: string;
    reportedBy?: string;
    imageBase64?: string;
  }): Promise<Issue> {
    const res = await apiRequest<DataResponse<Issue>>('/api/issues/report', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  /**
   * Delete an issue. The backend allows the original reporter and admin rolls
   * (see `src/config/roles.ts`); the acting roll identifies the caller.
   */
  async remove(id: string, roll: string): Promise<void> {
    await apiRequest<{ success: boolean; message?: string }>(
      `/api/issues/${id}?roll=${encodeURIComponent(roll)}`,
      { method: 'DELETE' },
    );
  },
};

/* -------------------------------------------------------------------------- */
/*  Lost & found                                                              */
/* -------------------------------------------------------------------------- */

export const lostFoundApi = {
  async list(): Promise<LostFoundItem[]> {
    const res = await apiRequest<
      ListResponse<LostFoundItem> | LostFoundItem[]
    >('/api/lostfound/all', { timeoutMs: 6000 });
    return Array.isArray(res) ? res : (res.data ?? []);
  },

  async get(id: string): Promise<LostFoundItem> {
    const res = await apiRequest<DataResponse<LostFoundItem>>(
      `/api/lostfound/${id}`,
    );
    return res.data;
  },

  async report(payload: {
    type: 'Lost' | 'Found';
    itemName: string;
    description: string;
    location: string;
    contact: string;
    reportedBy?: string;
    imageBase64?: string;
  }): Promise<LostFoundItem> {
    const res = await apiRequest<DataResponse<LostFoundItem>>(
      '/api/lostfound/report',
      { method: 'POST', body: JSON.stringify(payload) },
    );
    return res.data;
  },

  /**
   * Delete a lost/found post. Allowed for the original poster and admin rolls
   * (see `src/config/roles.ts`).
   */
  async remove(id: string, roll: string): Promise<void> {
    await apiRequest<{ success: boolean; message?: string }>(
      `/api/lostfound/${id}?roll=${encodeURIComponent(roll)}`,
      { method: 'DELETE' },
    );
  },
};

