import { describe, it, expect, beforeEach } from 'vitest';
import {
  TEST_CONFIG,
  mockFetchSuccess,
  mockFetchError,
  parseLastFetchCall,
  expectError,
  MOCK_DATA,
} from '../helpers.js';
import { agentUserTools } from '../../src/tools/agent_user.js';

function tool(name: string) {
  const t = agentUserTools.find((t) => t.name === name);
  if (!t) throw new Error(`Tool "${name}" not found`);
  return t;
}

describe('agent_user tools', () => {
  beforeEach(() => {
    mockFetchSuccess(MOCK_DATA);
  });

  // ── addAgent ──────────────────────────────────────────────────────────────
  describe('addAgent', () => {
    it('POST /v1.0/agent/profile/add with required fields', async () => {
      const mock = mockFetchSuccess(MOCK_DATA);
      await tool('addAgent').handler(
        { email: 'agent@example.com', firstName: 'Jane' },
        TEST_CONFIG,
      );
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('POST');
      expect(call.pathname).toBe('/v1.0/agent/profile/add');
      expect(call.body?.email).toBe('agent@example.com');
      expect(call.body?.firstName).toBe('Jane');
    });

    it('includes optional lastName and role in body', async () => {
      const mock = mockFetchSuccess(MOCK_DATA);
      await tool('addAgent').handler(
        { email: 'agent@example.com', firstName: 'Jane', lastName: 'Doe', role: 'agent' },
        TEST_CONFIG,
      );
      const call = parseLastFetchCall(mock);
      expect(call.body?.lastName).toBe('Doe');
      expect(call.body?.role).toBe('agent');
    });

    it('returns error on 422', async () => {
      mockFetchError(422);
      const result = await tool('addAgent').handler(
        { email: 'bad', firstName: 'x' },
        TEST_CONFIG,
      );
      expectError(result, 422);
    });

    it('returns error on 400', async () => {
      mockFetchError(400);
      const result = await tool('addAgent').handler(
        { email: 'agent@example.com', firstName: 'Jane' },
        TEST_CONFIG,
      );
      expectError(result, 400);
    });
  });

  // ── addAgentTag ───────────────────────────────────────────────────────────
  describe('addAgentTag', () => {
    it('POST /v1.0/agent/{agentId}/tag/add with tags body', async () => {
      const mock = mockFetchSuccess(MOCK_DATA);
      await tool('addAgentTag').handler(
        { agentId: 42, tags: ['vip', 'buyer-specialist'] },
        TEST_CONFIG,
      );
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('POST');
      expect(call.pathname).toBe('/v1.0/agent/42/tag/add');
      expect(call.body?.tags).toEqual(['vip', 'buyer-specialist']);
      expect(call.body?.agentId).toBeUndefined();
    });

    it('agentId not in query params', async () => {
      const mock = mockFetchSuccess(MOCK_DATA);
      await tool('addAgentTag').handler({ agentId: 42, tags: ['vip'] }, TEST_CONFIG);
      const call = parseLastFetchCall(mock);
      expect(call.params.agentId).toBeUndefined();
    });

    it('returns error on 404', async () => {
      mockFetchError(404);
      const result = await tool('addAgentTag').handler(
        { agentId: 999, tags: ['vip'] },
        TEST_CONFIG,
      );
      expectError(result, 404);
    });
  });

  // ── auth & meta ───────────────────────────────────────────────────────────
  it('sends Bearer auth header', async () => {
    const mock = mockFetchSuccess({});
    await tool('addAgent').handler({ email: 'a@b.com', firstName: 'A' }, TEST_CONFIG);
    const call = parseLastFetchCall(mock);
    expect(call.headers['Authorization']).toBe('Bearer test-bearer-token-abc123');
  });

  it('exports exactly 2 tools', () => {
    expect(agentUserTools).toHaveLength(2);
  });
});
