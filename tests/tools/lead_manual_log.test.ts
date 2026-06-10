import { describe, it, expect, beforeEach } from 'vitest';
import {
  TEST_CONFIG,
  mockFetchSuccess,
  mockFetchError,
  parseLastFetchCall,
  expectError,
  MOCK_DATA,
} from '../helpers.js';
import { leadManualLogTools } from '../../src/tools/lead_manual_log.js';

function tool(name: string) {
  const t = leadManualLogTools.find((t) => t.name === name);
  if (!t) throw new Error(`Tool "${name}" not found`);
  return t;
}

describe('lead_manual_log tools', () => {
  beforeEach(() => {
    mockFetchSuccess(MOCK_DATA);
  });

  // ── listManualLogTypes ────────────────────────────────────────────────────
  describe('listManualLogTypes', () => {
    it('GET /v1.0/logType with no params', async () => {
      const mock = mockFetchSuccess({ items: [] });
      await tool('listManualLogTypes').handler({}, TEST_CONFIG);
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('GET');
      expect(call.pathname).toBe('/v1.0/logType');
      expect(call.body).toBeUndefined();
    });

    it('returns error on 401', async () => {
      mockFetchError(401);
      const result = await tool('listManualLogTypes').handler({}, TEST_CONFIG);
      expectError(result, 401);
    });
  });

  // ── createManualLogType ───────────────────────────────────────────────────
  describe('createManualLogType', () => {
    it('POST /v1.0/logType with required fields', async () => {
      const mock = mockFetchSuccess(MOCK_DATA);
      await tool('createManualLogType').handler(
        { name: 'Incoming Call', type: 'call', direction: 'inbound' },
        TEST_CONFIG,
      );
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('POST');
      expect(call.pathname).toBe('/v1.0/logType');
      expect(call.body?.name).toBe('Incoming Call');
      expect(call.body?.type).toBe('call');
      expect(call.body?.direction).toBe('inbound');
    });

    it('returns error on 422', async () => {
      mockFetchError(422);
      const result = await tool('createManualLogType').handler(
        { name: 'x', type: 'email', direction: 'outbound' },
        TEST_CONFIG,
      );
      expectError(result, 422);
    });
  });

  // ── getManualLogType ──────────────────────────────────────────────────────
  describe('getManualLogType', () => {
    it('GET /v1.0/logType/{logTypeId}', async () => {
      const mock = mockFetchSuccess(MOCK_DATA);
      await tool('getManualLogType').handler({ logTypeId: 7 }, TEST_CONFIG);
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('GET');
      expect(call.pathname).toBe('/v1.0/logType/7');
      expect(call.body).toBeUndefined();
    });

    it('logTypeId not in query params', async () => {
      const mock = mockFetchSuccess(MOCK_DATA);
      await tool('getManualLogType').handler({ logTypeId: 7 }, TEST_CONFIG);
      const call = parseLastFetchCall(mock);
      expect(call.params.logTypeId).toBeUndefined();
    });

    it('returns error on 404', async () => {
      mockFetchError(404);
      const result = await tool('getManualLogType').handler({ logTypeId: 999 }, TEST_CONFIG);
      expectError(result, 404);
    });
  });

  // ── deleteManualLogType ───────────────────────────────────────────────────
  describe('deleteManualLogType', () => {
    it('DELETE /v1.0/logType/{logTypeId}', async () => {
      const mock = mockFetchSuccess({});
      await tool('deleteManualLogType').handler({ logTypeId: 3 }, TEST_CONFIG);
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('DELETE');
      expect(call.pathname).toBe('/v1.0/logType/3');
      expect(call.body).toBeUndefined();
    });

    it('returns error on 404', async () => {
      mockFetchError(404);
      const result = await tool('deleteManualLogType').handler({ logTypeId: 999 }, TEST_CONFIG);
      expectError(result, 404);
    });
  });

  // ── auth & meta ───────────────────────────────────────────────────────────
  it('sends Bearer auth header', async () => {
    const mock = mockFetchSuccess({});
    await tool('listManualLogTypes').handler({}, TEST_CONFIG);
    const call = parseLastFetchCall(mock);
    expect(call.headers['Authorization']).toBe('Bearer test-bearer-token-abc123');
  });

  it('strips MCP meta keys', async () => {
    const mock = mockFetchSuccess({ items: [] });
    await tool('listManualLogTypes').handler({ _meta: 'x', __mcp: 'y' }, TEST_CONFIG);
    const call = parseLastFetchCall(mock);
    expect(call.params._meta).toBeUndefined();
    expect(call.params.__mcp).toBeUndefined();
  });

  it('exports exactly 4 tools', () => {
    expect(leadManualLogTools).toHaveLength(4);
  });
});
