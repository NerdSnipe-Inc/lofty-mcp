import { describe, it, expect, beforeEach } from 'vitest';
import {
  TEST_CONFIG,
  mockFetchSuccess,
  mockFetchError,
  parseLastFetchCall,
  expectError,
} from '../helpers.js';
import { webhooks } from '../../src/tools/webhooks.js';

function tool(name: string) {
  const t = webhooks.find((t) => t.name === name);
  if (!t) throw new Error(`Tool "${name}" not found`);
  return t;
}

describe('webhooks tools', () => {
  beforeEach(() => {
    mockFetchSuccess({ items: [] });
  });

  // ── listWebhooks ──────────────────────────────────────────────────────────
  describe('listWebhooks', () => {
    it('GET /v1.0/webhooks', async () => {
      const mock = mockFetchSuccess({ items: [] });
      await tool('listWebhooks').handler({}, TEST_CONFIG);
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('GET');
      expect(call.pathname).toBe('/v1.0/webhooks');
    });

    it('returns error on 401', async () => {
      mockFetchError(401);
      const result = await tool('listWebhooks').handler({}, TEST_CONFIG);
      expectError(result, 401);
    });
  });

  // ── createWebhook ─────────────────────────────────────────────────────────
  describe('createWebhook', () => {
    it('POST /v1.0/webhook with required fields', async () => {
      const mock = mockFetchSuccess({ subscribeId: 55 });
      await tool('createWebhook').handler(
        { listId: 2, callbackUrl: 'https://example.com/hook' },
        TEST_CONFIG,
      );
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('POST');
      expect(call.pathname).toBe('/v1.0/webhook');
      expect(call.body?.listId).toBe(2);
      expect(call.body?.callbackUrl).toBe('https://example.com/hook');
    });

    it('forwards optional limit field', async () => {
      const mock = mockFetchSuccess({ subscribeId: 56 });
      await tool('createWebhook').handler(
        { listId: 3, callbackUrl: 'https://example.com/hook2', limit: 50 },
        TEST_CONFIG,
      );
      const call = parseLastFetchCall(mock);
      expect(call.body?.limit).toBe(50);
    });

    it('returns error on 422', async () => {
      mockFetchError(422);
      const result = await tool('createWebhook').handler(
        { listId: 1, callbackUrl: 'https://example.com/hook' },
        TEST_CONFIG,
      );
      expectError(result, 422);
    });
  });

  // ── deleteWebhook ─────────────────────────────────────────────────────────
  describe('deleteWebhook', () => {
    it('DELETE /v1.0/webhook/{subscribeId}', async () => {
      const mock = mockFetchSuccess({});
      await tool('deleteWebhook').handler({ subscribeId: 77 }, TEST_CONFIG);
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('DELETE');
      expect(call.pathname).toBe('/v1.0/webhook/77');
    });

    it('returns error on 404', async () => {
      mockFetchError(404);
      const result = await tool('deleteWebhook').handler(
        { subscribeId: 999 },
        TEST_CONFIG,
      );
      expectError(result, 404);
    });
  });

  // ── auth header ───────────────────────────────────────────────────────────
  it('sends Bearer auth header', async () => {
    const mock = mockFetchSuccess({});
    await tool('listWebhooks').handler({}, TEST_CONFIG);
    const call = parseLastFetchCall(mock);
    expect(call.headers['Authorization']).toBe('Bearer test-bearer-token-abc123');
  });
});
