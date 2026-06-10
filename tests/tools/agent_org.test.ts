import { describe, it, expect, beforeEach } from 'vitest';
import {
  TEST_CONFIG,
  mockFetchSuccess,
  mockFetchError,
  parseLastFetchCall,
  expectError,
  MOCK_DATA,
} from '../helpers.js';
import { agentOrgTools } from '../../src/tools/agent_org.js';

function tool(name: string) {
  const t = agentOrgTools.find((t) => t.name === name);
  if (!t) throw new Error(`Tool "${name}" not found`);
  return t;
}

describe('agent_org tools', () => {
  beforeEach(() => {
    mockFetchSuccess(MOCK_DATA);
  });

  // ── getOrgInfo ────────────────────────────────────────────────────────────
  describe('getOrgInfo', () => {
    it('GET /v1.0/org with no params', async () => {
      const mock = mockFetchSuccess(MOCK_DATA);
      await tool('getOrgInfo').handler({}, TEST_CONFIG);
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('GET');
      expect(call.pathname).toBe('/v1.0/org');
      expect(call.body).toBeUndefined();
    });

    it('returns error on 401', async () => {
      mockFetchError(401);
      const result = await tool('getOrgInfo').handler({}, TEST_CONFIG);
      expectError(result, 401);
    });
  });

  // ── updateCompany ─────────────────────────────────────────────────────────
  describe('updateCompany', () => {
    it('POST /v1.0/org/company with body pass-through', async () => {
      const mock = mockFetchSuccess(MOCK_DATA);
      await tool('updateCompany').handler(
        { name: 'Acme Realty', phone: '555-1234' },
        TEST_CONFIG,
      );
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('POST');
      expect(call.pathname).toBe('/v1.0/org/company');
      expect(call.body?.name).toBe('Acme Realty');
      expect(call.body?.phone).toBe('555-1234');
    });

    it('returns error on 400', async () => {
      mockFetchError(400);
      const result = await tool('updateCompany').handler({ name: 'x' }, TEST_CONFIG);
      expectError(result, 400);
    });
  });

  // ── addOffice ─────────────────────────────────────────────────────────────
  describe('addOffice', () => {
    it('PUT /v1.0/org/office with body pass-through', async () => {
      const mock = mockFetchSuccess(MOCK_DATA);
      await tool('addOffice').handler(
        { name: 'Downtown Office', address: '123 Main St' },
        TEST_CONFIG,
      );
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('PUT');
      expect(call.pathname).toBe('/v1.0/org/office');
      expect(call.body?.name).toBe('Downtown Office');
      expect(call.body?.address).toBe('123 Main St');
    });
  });

  // ── updateOffice ──────────────────────────────────────────────────────────
  describe('updateOffice', () => {
    it('POST /v1.0/org/office with body pass-through', async () => {
      const mock = mockFetchSuccess(MOCK_DATA);
      await tool('updateOffice').handler(
        { id: 2, name: 'Uptown Office' },
        TEST_CONFIG,
      );
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('POST');
      expect(call.pathname).toBe('/v1.0/org/office');
      expect(call.body?.id).toBe(2);
      expect(call.body?.name).toBe('Uptown Office');
    });

    it('returns error on 422', async () => {
      mockFetchError(422);
      const result = await tool('updateOffice').handler({ id: 1 }, TEST_CONFIG);
      expectError(result, 422);
    });
  });

  // ── getPermissionProfiles ─────────────────────────────────────────────────
  describe('getPermissionProfiles', () => {
    it('GET /v1.0/org/permission/profiles with no params', async () => {
      const mock = mockFetchSuccess({ items: [] });
      await tool('getPermissionProfiles').handler({}, TEST_CONFIG);
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('GET');
      expect(call.pathname).toBe('/v1.0/org/permission/profiles');
      expect(call.body).toBeUndefined();
    });

    it('returns error on 403', async () => {
      mockFetchError(403);
      const result = await tool('getPermissionProfiles').handler({}, TEST_CONFIG);
      expectError(result, 403);
    });
  });

  // ── auth & meta ───────────────────────────────────────────────────────────
  it('sends Bearer auth header', async () => {
    const mock = mockFetchSuccess({});
    await tool('getOrgInfo').handler({}, TEST_CONFIG);
    const call = parseLastFetchCall(mock);
    expect(call.headers['Authorization']).toBe('Bearer test-bearer-token-abc123');
  });

  it('exports exactly 5 tools', () => {
    expect(agentOrgTools).toHaveLength(5);
  });
});
