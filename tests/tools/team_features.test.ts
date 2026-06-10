import { describe, it, expect, beforeEach } from 'vitest';
import {
  TEST_CONFIG,
  mockFetchSuccess,
  mockFetchError,
  parseLastFetchCall,
  expectError,
} from '../helpers.js';
import { teamFeatures } from '../../src/tools/team_features.js';

function tool(name: string) {
  const t = teamFeatures.find((t) => t.name === name);
  if (!t) throw new Error(`Tool "${name}" not found`);
  return t;
}

describe('teamFeatures tools', () => {
  beforeEach(() => {
    mockFetchSuccess({ items: [] });
  });

  // ── listTags ──────────────────────────────────────────────────────────────
  describe('listTags', () => {
    it('GET /v1.0/teamFeatures/listTag', async () => {
      const mock = mockFetchSuccess({ items: [] });
      await tool('listTags').handler({}, TEST_CONFIG);
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('GET');
      expect(call.pathname).toBe('/v1.0/teamFeatures/listTag');
    });

    it('returns error on 401', async () => {
      mockFetchError(401);
      const result = await tool('listTags').handler({}, TEST_CONFIG);
      expectError(result, 401);
    });
  });

  // ── listCustomFields ──────────────────────────────────────────────────────
  describe('listCustomFields', () => {
    it('GET /v1.0/teamFeatures/listCustomField', async () => {
      const mock = mockFetchSuccess({ items: [] });
      await tool('listCustomFields').handler({}, TEST_CONFIG);
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('GET');
      expect(call.pathname).toBe('/v1.0/teamFeatures/listCustomField');
    });

    it('returns error on 403', async () => {
      mockFetchError(403);
      const result = await tool('listCustomFields').handler({}, TEST_CONFIG);
      expectError(result, 403);
    });
  });

  // ── addCustomField ────────────────────────────────────────────────────────
  describe('addCustomField', () => {
    it('POST /v1.0/teamFeatures/custom-field with id and value', async () => {
      const mock = mockFetchSuccess({ id: 7 });
      await tool('addCustomField').handler({ id: 7, value: 'Gold' }, TEST_CONFIG);
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('POST');
      expect(call.pathname).toBe('/v1.0/teamFeatures/custom-field');
      expect(call.body?.id).toBe(7);
      expect(call.body?.value).toBe('Gold');
    });

    it('returns error on 422', async () => {
      mockFetchError(422);
      const result = await tool('addCustomField').handler(
        { id: 0, value: '' },
        TEST_CONFIG,
      );
      expectError(result, 422);
    });
  });

  // ── listPipelines ─────────────────────────────────────────────────────────
  describe('listPipelines', () => {
    it('GET /v1.0/teamFeatures/lead-pipelines', async () => {
      const mock = mockFetchSuccess({ items: [] });
      await tool('listPipelines').handler({}, TEST_CONFIG);
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('GET');
      expect(call.pathname).toBe('/v1.0/teamFeatures/lead-pipelines');
    });
  });

  // ── listLeadPonds ─────────────────────────────────────────────────────────
  describe('listLeadPonds', () => {
    it('GET /v1.0/team-features/lead-ponds', async () => {
      const mock = mockFetchSuccess({ items: [] });
      await tool('listLeadPonds').handler({}, TEST_CONFIG);
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('GET');
      expect(call.pathname).toBe('/v1.0/team-features/lead-ponds');
    });

    it('returns error on 403', async () => {
      mockFetchError(403);
      const result = await tool('listLeadPonds').handler({}, TEST_CONFIG);
      expectError(result, 403);
    });
  });

  // ── getLeadPond ───────────────────────────────────────────────────────────
  describe('getLeadPond', () => {
    it('GET /v1.0/team-features/lead-pond/{id}', async () => {
      const mock = mockFetchSuccess({ id: 3 });
      await tool('getLeadPond').handler({ id: 3 }, TEST_CONFIG);
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('GET');
      expect(call.pathname).toBe('/v1.0/team-features/lead-pond/3');
    });

    it('id not in query params', async () => {
      const mock = mockFetchSuccess({});
      await tool('getLeadPond').handler({ id: 3 }, TEST_CONFIG);
      const call = parseLastFetchCall(mock);
      expect(call.params.id).toBeUndefined();
    });

    it('returns error on 404', async () => {
      mockFetchError(404);
      const result = await tool('getLeadPond').handler({ id: 9999 }, TEST_CONFIG);
      expectError(result, 404);
    });
  });

  // ── auth header ───────────────────────────────────────────────────────────
  it('sends Bearer auth header on every request', async () => {
    const mock = mockFetchSuccess({});
    await tool('listTags').handler({}, TEST_CONFIG);
    const call = parseLastFetchCall(mock);
    expect(call.headers['Authorization']).toBe('Bearer test-bearer-token-abc123');
  });

  // ── stripMeta ─────────────────────────────────────────────────────────────
  it('strips MCP meta keys before forwarding', async () => {
    const mock = mockFetchSuccess({ items: [] });
    await tool('listPipelines').handler({ _meta: 'x', __mcp: 'y' }, TEST_CONFIG);
    const call = parseLastFetchCall(mock);
    expect(call.params._meta).toBeUndefined();
    expect(call.params.__mcp).toBeUndefined();
  });
});
