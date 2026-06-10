import { describe, it, expect, afterEach, vi } from 'vitest';
import { system_logs } from '../../src/tools/system_logs.js';
import {
  TEST_CONFIG,
  MOCK_DATA,
  mockFetchSuccess,
  mockFetchError,
  parseLastFetchCall,
  expectError,
} from '../helpers.js';

function getTool(name: string) {
  const tool = system_logs.find(t => t.name === name);
  if (!tool) throw new Error(`Tool not found: ${name}`);
  return tool;
}

describe('system_logs tools', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('exports 1 tool', () => {
    expect(system_logs).toHaveLength(1);
  });

  describe('getSystemLogs', () => {
    it('calls GET /v1.0/systemLogs', async () => {
      const fetchMock = mockFetchSuccess(MOCK_DATA);
      const tool = getTool('getSystemLogs');
      const result = await tool.handler({ leadId: 101 }, TEST_CONFIG);
      const call = parseLastFetchCall(fetchMock);
      expect(call.method).toBe('GET');
      expect(call.pathname).toBe('/v1.0/systemLogs');
      expect(JSON.parse(result)).toEqual(MOCK_DATA);
    });

    it('passes leadId as query param', async () => {
      const fetchMock = mockFetchSuccess(MOCK_DATA);
      const tool = getTool('getSystemLogs');
      await tool.handler({ leadId: 55 }, TEST_CONFIG);
      const call = parseLastFetchCall(fetchMock);
      expect(call.params.leadId).toBe('55');
    });

    it('passes optional offset and limit as query params', async () => {
      const fetchMock = mockFetchSuccess(MOCK_DATA);
      const tool = getTool('getSystemLogs');
      await tool.handler({ leadId: 55, offset: 20, limit: 10 }, TEST_CONFIG);
      const call = parseLastFetchCall(fetchMock);
      expect(call.params.leadId).toBe('55');
      expect(call.params.offset).toBe('20');
      expect(call.params.limit).toBe('10');
    });

    it('returns formatted error on 404', async () => {
      mockFetchError(404);
      const tool = getTool('getSystemLogs');
      const result = await tool.handler({ leadId: 999 }, TEST_CONFIG);
      expectError(result, 404);
    });

    it('returns formatted error on 401', async () => {
      mockFetchError(401);
      const tool = getTool('getSystemLogs');
      const result = await tool.handler({ leadId: 1 }, TEST_CONFIG);
      expectError(result, 401);
    });
  });
});
