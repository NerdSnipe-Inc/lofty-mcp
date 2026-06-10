import { describe, it, expect, beforeEach } from 'vitest';
import {
  TEST_CONFIG,
  mockFetchSuccess,
  mockFetchError,
  parseLastFetchCall,
  expectError,
  MOCK_DATA,
} from '../helpers.js';
import { leadRoutingTools } from '../../src/tools/lead_routing.js';

function tool(name: string) {
  const t = leadRoutingTools.find((t) => t.name === name);
  if (!t) throw new Error(`Tool "${name}" not found`);
  return t;
}

describe('lead_routing tools', () => {
  beforeEach(() => {
    mockFetchSuccess(MOCK_DATA);
  });

  // ── listRoutingRules ──────────────────────────────────────────────────────
  describe('listRoutingRules', () => {
    it('GET /v1.0/routing/rule/list/{type}', async () => {
      const mock = mockFetchSuccess({ items: [] });
      await tool('listRoutingRules').handler({ type: 'buyer' }, TEST_CONFIG);
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('GET');
      expect(call.pathname).toBe('/v1.0/routing/rule/list/buyer');
      expect(call.body).toBeUndefined();
    });

    it('type does not appear in query params', async () => {
      const mock = mockFetchSuccess({ items: [] });
      await tool('listRoutingRules').handler({ type: 'seller' }, TEST_CONFIG);
      const call = parseLastFetchCall(mock);
      expect(call.params.type).toBeUndefined();
    });

    it('returns error on 401', async () => {
      mockFetchError(401);
      const result = await tool('listRoutingRules').handler({ type: 'buyer' }, TEST_CONFIG);
      expectError(result, 401);
    });
  });

  // ── updateRoutingRule ─────────────────────────────────────────────────────
  describe('updateRoutingRule', () => {
    it('PUT /v1.0/routing/rule/{type} with body', async () => {
      const mock = mockFetchSuccess(MOCK_DATA);
      await tool('updateRoutingRule').handler(
        { type: 'buyer', id: 1, routingStrategy: 'round-robin' },
        TEST_CONFIG,
      );
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('PUT');
      expect(call.pathname).toBe('/v1.0/routing/rule/buyer');
      expect(call.body?.id).toBe(1);
      expect(call.body?.routingStrategy).toBe('round-robin');
      expect(call.body?.type).toBeUndefined();
    });

    it('returns error on 400', async () => {
      mockFetchError(400);
      const result = await tool('updateRoutingRule').handler(
        { type: 'buyer', id: 1 },
        TEST_CONFIG,
      );
      expectError(result, 400);
    });
  });

  // ── getSupplementRule ─────────────────────────────────────────────────────
  describe('getSupplementRule', () => {
    it('GET /v1.0/routing/rule/supplement/{type}', async () => {
      const mock = mockFetchSuccess(MOCK_DATA);
      await tool('getSupplementRule').handler({ type: 'seller' }, TEST_CONFIG);
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('GET');
      expect(call.pathname).toBe('/v1.0/routing/rule/supplement/seller');
      expect(call.body).toBeUndefined();
    });
  });

  // ── updateSupplementRule ──────────────────────────────────────────────────
  describe('updateSupplementRule', () => {
    it('PUT /v1.0/routing/rule/supplement/{type} with body', async () => {
      const mock = mockFetchSuccess(MOCK_DATA);
      await tool('updateSupplementRule').handler(
        { type: 'buyer', supplementField: 'value' },
        TEST_CONFIG,
      );
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('PUT');
      expect(call.pathname).toBe('/v1.0/routing/rule/supplement/buyer');
      expect(call.body?.supplementField).toBe('value');
      expect(call.body?.type).toBeUndefined();
    });
  });

  // ── listRoutingRoles ──────────────────────────────────────────────────────
  describe('listRoutingRoles', () => {
    it('GET /v1.0/routing/role/list', async () => {
      const mock = mockFetchSuccess({ items: [] });
      await tool('listRoutingRoles').handler({}, TEST_CONFIG);
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('GET');
      expect(call.pathname).toBe('/v1.0/routing/role/list');
      expect(call.body).toBeUndefined();
    });

    it('returns error on 500', async () => {
      mockFetchError(500);
      const result = await tool('listRoutingRoles').handler({}, TEST_CONFIG);
      expectError(result, 500);
    });
  });

  // ── listAssignMembers ─────────────────────────────────────────────────────
  describe('listAssignMembers', () => {
    it('GET /v1.0/routing/member/list/{type}', async () => {
      const mock = mockFetchSuccess({ items: [] });
      await tool('listAssignMembers').handler({ type: 'buyer' }, TEST_CONFIG);
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('GET');
      expect(call.pathname).toBe('/v1.0/routing/member/list/buyer');
      expect(call.body).toBeUndefined();
    });

    it('type does not appear in query params', async () => {
      const mock = mockFetchSuccess({ items: [] });
      await tool('listAssignMembers').handler({ type: 'seller' }, TEST_CONFIG);
      const call = parseLastFetchCall(mock);
      expect(call.params.type).toBeUndefined();
    });
  });

  // ── auth & meta ───────────────────────────────────────────────────────────
  it('sends Bearer auth header', async () => {
    const mock = mockFetchSuccess({});
    await tool('listRoutingRoles').handler({}, TEST_CONFIG);
    const call = parseLastFetchCall(mock);
    expect(call.headers['Authorization']).toBe('Bearer test-bearer-token-abc123');
  });

  it('exports exactly 6 tools', () => {
    expect(leadRoutingTools).toHaveLength(6);
  });
});
