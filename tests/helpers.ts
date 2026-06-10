import { vi, expect } from 'vitest';
import type { LoftyConfig } from '../src/client.js';

export const TEST_CONFIG: LoftyConfig = {
  apiKey: 'test-bearer-token-abc123',
  safeMode: true,
};

export const MOCK_DATA = { id: 1, success: true };

export function mockFetchSuccess(data: unknown = MOCK_DATA) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    statusText: 'OK',
    headers: { get: () => null },
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

export function mockFetchError(status: number, body: unknown = { message: 'API Error' }) {
  const statusTexts: Record<number, string> = {
    400: 'Bad Request', 401: 'Unauthorized', 403: 'Forbidden',
    404: 'Not Found', 422: 'Unprocessable Entity',
    429: 'Too Many Requests', 500: 'Internal Server Error',
  };
  const fetchMock = vi.fn().mockResolvedValue({
    ok: false,
    status,
    statusText: statusTexts[status] ?? 'Error',
    headers: { get: () => null },
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(JSON.stringify(body)),
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

export interface FetchCall {
  url: URL;
  pathname: string;
  params: Record<string, string>;
  method: string;
  headers: Record<string, string>;
  body: Record<string, unknown> | undefined;
}

export function parseLastFetchCall(fetchMock: ReturnType<typeof vi.fn>): FetchCall {
  expect(fetchMock).toHaveBeenCalled();
  const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit];
  const parsedUrl = new URL(url);
  return {
    url: parsedUrl,
    pathname: parsedUrl.pathname,
    params: Object.fromEntries(parsedUrl.searchParams.entries()),
    method: options.method as string,
    headers: options.headers as Record<string, string>,
    body: options.body ? JSON.parse(options.body as string) as Record<string, unknown> : undefined,
  };
}

export function parseResult(result: string): Record<string, unknown> {
  return JSON.parse(result) as Record<string, unknown>;
}

export function expectSuccess(result: string, data: unknown = MOCK_DATA) {
  expect(JSON.parse(result)).toEqual(data);
}

export function expectError(result: string, status: number) {
  const parsed = parseResult(result);
  expect(parsed.error).toBe(true);
  expect(parsed.status).toBe(status);
}
