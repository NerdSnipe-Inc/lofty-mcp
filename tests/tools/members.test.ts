import { describe, it, expect, beforeEach } from 'vitest';
import {
  TEST_CONFIG,
  mockFetchSuccess,
  mockFetchError,
  parseLastFetchCall,
  expectError,
} from '../helpers.js';
import { members } from '../../src/tools/members.js';

function tool(name: string) {
  const t = members.find((t) => t.name === name);
  if (!t) throw new Error(`Tool "${name}" not found`);
  return t;
}

describe('members tools', () => {
  beforeEach(() => {
    mockFetchSuccess({ id: 1 });
  });

  // ── getMe ─────────────────────────────────────────────────────────────────
  describe('getMe', () => {
    it('GET /v1.0/me', async () => {
      const mock = mockFetchSuccess({ id: 5, email: 'me@example.com' });
      await tool('getMe').handler({}, TEST_CONFIG);
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('GET');
      expect(call.pathname).toBe('/v1.0/me');
    });

    it('returns error on 401', async () => {
      mockFetchError(401);
      const result = await tool('getMe').handler({}, TEST_CONFIG);
      expectError(result, 401);
    });
  });

  // ── listMembers ───────────────────────────────────────────────────────────
  describe('listMembers', () => {
    it('GET /v1.0/members', async () => {
      const mock = mockFetchSuccess({ items: [] });
      await tool('listMembers').handler({}, TEST_CONFIG);
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('GET');
      expect(call.pathname).toBe('/v1.0/members');
    });

    it('returns error on 403', async () => {
      mockFetchError(403);
      const result = await tool('listMembers').handler({}, TEST_CONFIG);
      expectError(result, 403);
    });
  });

  // ── getMemberByAccount ────────────────────────────────────────────────────
  describe('getMemberByAccount', () => {
    it('GET /v1.0/members/{account}', async () => {
      const mock = mockFetchSuccess({ id: 10 });
      await tool('getMemberByAccount').handler(
        { account: 'agent@brokerage.com' },
        TEST_CONFIG,
      );
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('GET');
      expect(call.pathname).toBe('/v1.0/members/agent@brokerage.com');
    });

    it('account not in query params', async () => {
      const mock = mockFetchSuccess({});
      await tool('getMemberByAccount').handler(
        { account: 'agent@brokerage.com' },
        TEST_CONFIG,
      );
      const call = parseLastFetchCall(mock);
      expect(call.params.account).toBeUndefined();
    });

    it('returns error on 404', async () => {
      mockFetchError(404);
      const result = await tool('getMemberByAccount').handler(
        { account: 'nobody@example.com' },
        TEST_CONFIG,
      );
      expectError(result, 404);
    });
  });

  // ── getMemberById ─────────────────────────────────────────────────────────
  describe('getMemberById', () => {
    it('GET /v1.0/users/{userId}', async () => {
      const mock = mockFetchSuccess({ id: 42 });
      await tool('getMemberById').handler({ userId: 42 }, TEST_CONFIG);
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('GET');
      expect(call.pathname).toBe('/v1.0/users/42');
    });

    it('userId not in query params', async () => {
      const mock = mockFetchSuccess({});
      await tool('getMemberById').handler({ userId: 42 }, TEST_CONFIG);
      const call = parseLastFetchCall(mock);
      expect(call.params.userId).toBeUndefined();
    });

    it('returns error on 404', async () => {
      mockFetchError(404);
      const result = await tool('getMemberById').handler({ userId: 9999 }, TEST_CONFIG);
      expectError(result, 404);
    });
  });

  // ── auth header ───────────────────────────────────────────────────────────
  it('sends Bearer auth header on every request', async () => {
    const mock = mockFetchSuccess({});
    await tool('getMe').handler({}, TEST_CONFIG);
    const call = parseLastFetchCall(mock);
    expect(call.headers['Authorization']).toBe('Bearer test-bearer-token-abc123');
  });

  // ── stripMeta ─────────────────────────────────────────────────────────────
  it('strips MCP meta keys before forwarding', async () => {
    const mock = mockFetchSuccess({ items: [] });
    await tool('listMembers').handler({ _meta: 'x', __mcp: 'y' }, TEST_CONFIG);
    const call = parseLastFetchCall(mock);
    expect(call.params._meta).toBeUndefined();
    expect(call.params.__mcp).toBeUndefined();
  });
});
