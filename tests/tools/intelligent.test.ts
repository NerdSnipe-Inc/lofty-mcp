import { describe, it, expect, beforeEach } from 'vitest';
import {
  TEST_CONFIG,
  mockFetchSuccess,
  mockFetchError,
  parseLastFetchCall,
  expectError,
  MOCK_DATA,
} from '../helpers.js';
import { intelligentTools } from '../../src/tools/intelligent.js';

function tool(name: string) {
  const t = intelligentTools.find((t) => t.name === name);
  if (!t) throw new Error(`Tool "${name}" not found`);
  return t;
}

describe('intelligent tools', () => {
  beforeEach(() => {
    mockFetchSuccess(MOCK_DATA);
  });

  // ── generateCallScript ────────────────────────────────────────────────────
  describe('generateCallScript', () => {
    it('POST /v2.0/ai/call-script with leadId', async () => {
      const mock = mockFetchSuccess(MOCK_DATA);
      await tool('generateCallScript').handler({ leadId: 10 }, TEST_CONFIG);
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('POST');
      expect(call.pathname).toBe('/v2.0/ai/call-script');
      expect(call.body?.leadId).toBe(10);
    });

    it('includes optional agentId in body', async () => {
      const mock = mockFetchSuccess(MOCK_DATA);
      await tool('generateCallScript').handler({ leadId: 10, agentId: 5 }, TEST_CONFIG);
      const call = parseLastFetchCall(mock);
      expect(call.body?.agentId).toBe(5);
    });

    it('returns error on 400', async () => {
      mockFetchError(400);
      const result = await tool('generateCallScript').handler({ leadId: 10 }, TEST_CONFIG);
      expectError(result, 400);
    });
  });

  // ── getCallSummary ────────────────────────────────────────────────────────
  describe('getCallSummary', () => {
    it('GET /v2.0/ai/call-summary with leadId query param', async () => {
      const mock = mockFetchSuccess(MOCK_DATA);
      await tool('getCallSummary').handler({ leadId: 20 }, TEST_CONFIG);
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('GET');
      expect(call.pathname).toBe('/v2.0/ai/call-summary');
      expect(call.params.leadId).toBe('20');
      expect(call.body).toBeUndefined();
    });

    it('returns error on 404', async () => {
      mockFetchError(404);
      const result = await tool('getCallSummary').handler({ leadId: 99 }, TEST_CONFIG);
      expectError(result, 404);
    });
  });

  // ── generateCallSummary ───────────────────────────────────────────────────
  describe('generateCallSummary', () => {
    it('POST /v2.0/ai/call-summary/generate with callId', async () => {
      const mock = mockFetchSuccess(MOCK_DATA);
      await tool('generateCallSummary').handler({ callId: 30 }, TEST_CONFIG);
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('POST');
      expect(call.pathname).toBe('/v2.0/ai/call-summary/generate');
      expect(call.body?.callId).toBe(30);
    });

    it('returns error on 500', async () => {
      mockFetchError(500);
      const result = await tool('generateCallSummary').handler({ callId: 1 }, TEST_CONFIG);
      expectError(result, 500);
    });
  });

  // ── listLeadAnalysis ──────────────────────────────────────────────────────
  describe('listLeadAnalysis', () => {
    it('GET /v2.0/ai/lead-analysis with leadId query param', async () => {
      const mock = mockFetchSuccess({ items: [] });
      await tool('listLeadAnalysis').handler({ leadId: 40 }, TEST_CONFIG);
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('GET');
      expect(call.pathname).toBe('/v2.0/ai/lead-analysis');
      expect(call.params.leadId).toBe('40');
      expect(call.body).toBeUndefined();
    });
  });

  // ── createLeadAnalysis ────────────────────────────────────────────────────
  describe('createLeadAnalysis', () => {
    it('POST /v2.0/ai/lead-analysis with leadId', async () => {
      const mock = mockFetchSuccess(MOCK_DATA);
      await tool('createLeadAnalysis').handler({ leadId: 50 }, TEST_CONFIG);
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('POST');
      expect(call.pathname).toBe('/v2.0/ai/lead-analysis');
      expect(call.body?.leadId).toBe(50);
    });

    it('returns error on 422', async () => {
      mockFetchError(422);
      const result = await tool('createLeadAnalysis').handler({ leadId: 1 }, TEST_CONFIG);
      expectError(result, 422);
    });
  });

  // ── generatePrepareInsight ────────────────────────────────────────────────
  describe('generatePrepareInsight', () => {
    it('POST /v2.0/ai/prepare-insight with leadId', async () => {
      const mock = mockFetchSuccess(MOCK_DATA);
      await tool('generatePrepareInsight').handler({ leadId: 60 }, TEST_CONFIG);
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('POST');
      expect(call.pathname).toBe('/v2.0/ai/prepare-insight');
      expect(call.body?.leadId).toBe(60);
    });

    it('returns error on 401', async () => {
      mockFetchError(401);
      const result = await tool('generatePrepareInsight').handler({ leadId: 1 }, TEST_CONFIG);
      expectError(result, 401);
    });
  });

  // ── auth & meta ───────────────────────────────────────────────────────────
  it('sends Bearer auth header', async () => {
    const mock = mockFetchSuccess({});
    await tool('generateCallScript').handler({ leadId: 1 }, TEST_CONFIG);
    const call = parseLastFetchCall(mock);
    expect(call.headers['Authorization']).toBe('Bearer test-bearer-token-abc123');
  });

  it('strips MCP meta keys', async () => {
    const mock = mockFetchSuccess(MOCK_DATA);
    await tool('getCallSummary').handler({ leadId: 1, _meta: 'x', __mcp: 'y' }, TEST_CONFIG);
    const call = parseLastFetchCall(mock);
    expect(call.params._meta).toBeUndefined();
    expect(call.params.__mcp).toBeUndefined();
  });

  it('exports exactly 6 tools', () => {
    expect(intelligentTools).toHaveLength(6);
  });
});
