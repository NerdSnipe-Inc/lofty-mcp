import { describe, it, expect, beforeEach } from 'vitest';
import {
  TEST_CONFIG,
  mockFetchSuccess,
  mockFetchError,
  parseLastFetchCall,
  expectError,
  MOCK_DATA,
} from '../helpers.js';
import { callsTools } from '../../src/tools/calls.js';

function getTool(name: string) {
  const tool = callsTools.find((t) => t.name === name);
  if (!tool) throw new Error(`Tool "${name}" not found`);
  return tool;
}

describe('calls tools', () => {
  beforeEach(() => {
    mockFetchSuccess(MOCK_DATA);
  });

  // ── listCalls ──────────────────────────────────────────────────────────────
  describe('listCalls', () => {
    it('GET /v1.0/calls with required leadId', async () => {
      const fetch = mockFetchSuccess({ items: [] });
      await getTool('listCalls').handler({ leadId: 42 }, TEST_CONFIG);
      const call = parseLastFetchCall(fetch);
      expect(call.method).toBe('GET');
      expect(call.pathname).toBe('/v1.0/calls');
      expect(call.params.leadId).toBe('42');
      expect(call.body).toBeUndefined();
    });

    it('forwards offset and limit', async () => {
      const fetch = mockFetchSuccess({ items: [] });
      await getTool('listCalls').handler({ leadId: 1, offset: 20, limit: 10 }, TEST_CONFIG);
      const call = parseLastFetchCall(fetch);
      expect(call.params.offset).toBe('20');
      expect(call.params.limit).toBe('10');
    });

    it('returns error on 401', async () => {
      mockFetchError(401);
      const result = await getTool('listCalls').handler({ leadId: 1 }, TEST_CONFIG);
      expectError(result, 401);
    });
  });

  // ── getCallRecord ──────────────────────────────────────────────────────────
  describe('getCallRecord', () => {
    it('GET /v1.0/calls/{callId}', async () => {
      const fetch = mockFetchSuccess(MOCK_DATA);
      await getTool('getCallRecord').handler({ callId: 7 }, TEST_CONFIG);
      const call = parseLastFetchCall(fetch);
      expect(call.method).toBe('GET');
      expect(call.pathname).toBe('/v1.0/calls/7');
      expect(call.body).toBeUndefined();
    });

    it('does not forward callId as query param', async () => {
      const fetch = mockFetchSuccess(MOCK_DATA);
      await getTool('getCallRecord').handler({ callId: 7 }, TEST_CONFIG);
      const call = parseLastFetchCall(fetch);
      expect(call.params.callId).toBeUndefined();
    });

    it('returns error on 404', async () => {
      mockFetchError(404);
      const result = await getTool('getCallRecord').handler({ callId: 999 }, TEST_CONFIG);
      expectError(result, 404);
    });
  });

  // ── getCallRecordUrl ───────────────────────────────────────────────────────
  describe('getCallRecordUrl', () => {
    it('GET /v1.0/call/url/{callId}', async () => {
      const fetch = mockFetchSuccess({ url: 'https://example.com/recording.mp3' });
      await getTool('getCallRecordUrl').handler({ callId: 55 }, TEST_CONFIG);
      const call = parseLastFetchCall(fetch);
      expect(call.method).toBe('GET');
      expect(call.pathname).toBe('/v1.0/call/url/55');
      expect(call.body).toBeUndefined();
    });

    it('does not forward callId as query param', async () => {
      const fetch = mockFetchSuccess({ url: 'https://example.com/recording.mp3' });
      await getTool('getCallRecordUrl').handler({ callId: 55 }, TEST_CONFIG);
      const call = parseLastFetchCall(fetch);
      expect(call.params.callId).toBeUndefined();
    });

    it('returns error on 404', async () => {
      mockFetchError(404);
      const result = await getTool('getCallRecordUrl').handler({ callId: 999 }, TEST_CONFIG);
      expectError(result, 404);
    });
  });

  // ── auth & meta ────────────────────────────────────────────────────────────
  it('sends Bearer auth header', async () => {
    const fetch = mockFetchSuccess({});
    await getTool('listCalls').handler({ leadId: 1 }, TEST_CONFIG);
    const call = parseLastFetchCall(fetch);
    expect(call.headers['Authorization']).toBe('Bearer test-bearer-token-abc123');
  });

  it('strips MCP meta keys', async () => {
    const fetch = mockFetchSuccess({ items: [] });
    await getTool('listCalls').handler({ leadId: 1, _meta: 'x', __mcp: 'y' }, TEST_CONFIG);
    const call = parseLastFetchCall(fetch);
    expect(call.params._meta).toBeUndefined();
    expect(call.params.__mcp).toBeUndefined();
  });

  it('exports exactly 3 tools', () => {
    expect(callsTools).toHaveLength(3);
  });
});
