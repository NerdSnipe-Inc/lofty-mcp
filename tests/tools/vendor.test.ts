import { describe, it, expect, beforeEach } from 'vitest';
import {
  TEST_CONFIG,
  mockFetchSuccess,
  mockFetchError,
  parseLastFetchCall,
  expectError,
  MOCK_DATA,
} from '../helpers.js';
import { vendorTools } from '../../src/tools/vendor.js';

function tool(name: string) {
  const t = vendorTools.find((t) => t.name === name);
  if (!t) throw new Error(`Tool "${name}" not found`);
  return t;
}

describe('vendor tools', () => {
  beforeEach(() => {
    mockFetchSuccess(MOCK_DATA);
  });

  // ── getVendors ────────────────────────────────────────────────────────────
  describe('getVendors', () => {
    it('GET /v1.0/vendor/list with no params', async () => {
      const mock = mockFetchSuccess({ items: [] });
      await tool('getVendors').handler({}, TEST_CONFIG);
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('GET');
      expect(call.pathname).toBe('/v1.0/vendor/list');
      expect(call.body).toBeUndefined();
    });

    it('forwards optional offset and limit', async () => {
      const mock = mockFetchSuccess({ items: [] });
      await tool('getVendors').handler({ offset: 10, limit: 25 }, TEST_CONFIG);
      const call = parseLastFetchCall(mock);
      expect(call.params.offset).toBe('10');
      expect(call.params.limit).toBe('25');
    });

    it('returns error on 401', async () => {
      mockFetchError(401);
      const result = await tool('getVendors').handler({}, TEST_CONFIG);
      expectError(result, 401);
    });

    it('returns error on 500', async () => {
      mockFetchError(500);
      const result = await tool('getVendors').handler({}, TEST_CONFIG);
      expectError(result, 500);
    });
  });

  // ── auth & meta ───────────────────────────────────────────────────────────
  it('sends Bearer auth header', async () => {
    const mock = mockFetchSuccess({});
    await tool('getVendors').handler({}, TEST_CONFIG);
    const call = parseLastFetchCall(mock);
    expect(call.headers['Authorization']).toBe('Bearer test-bearer-token-abc123');
  });

  it('strips MCP meta keys', async () => {
    const mock = mockFetchSuccess({ items: [] });
    await tool('getVendors').handler({ _meta: 'x', __mcp: 'y' }, TEST_CONFIG);
    const call = parseLastFetchCall(mock);
    expect(call.params._meta).toBeUndefined();
    expect(call.params.__mcp).toBeUndefined();
  });

  it('exports exactly 1 tool', () => {
    expect(vendorTools).toHaveLength(1);
  });
});
