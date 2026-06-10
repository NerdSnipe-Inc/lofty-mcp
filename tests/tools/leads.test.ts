import { describe, it, expect, beforeEach } from 'vitest';
import {
  TEST_CONFIG,
  mockFetchSuccess,
  mockFetchError,
  parseLastFetchCall,
  expectError,
} from '../helpers.js';
import { leads } from '../../src/tools/leads.js';

function tool(name: string) {
  const t = leads.find((t) => t.name === name);
  if (!t) throw new Error(`Tool "${name}" not found`);
  return t;
}

describe('leads tools', () => {
  beforeEach(() => {
    mockFetchSuccess({ items: [] });
  });

  // ── listLeads ─────────────────────────────────────────────────────────────
  describe('listLeads', () => {
    it('GET /v1.0/leads', async () => {
      const mock = mockFetchSuccess({ items: [] });
      await tool('listLeads').handler({}, TEST_CONFIG);
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('GET');
      expect(call.pathname).toBe('/v1.0/leads');
    });

    it('forwards query params', async () => {
      const mock = mockFetchSuccess({ items: [] });
      await tool('listLeads').handler(
        { stage: 'Active', limit: 50, offset: 10 },
        TEST_CONFIG,
      );
      const call = parseLastFetchCall(mock);
      expect(call.params.stage).toBe('Active');
      expect(call.params.limit).toBe('50');
      expect(call.params.offset).toBe('10');
    });

    it('returns error on 401', async () => {
      mockFetchError(401);
      const result = await tool('listLeads').handler({}, TEST_CONFIG);
      expectError(result, 401);
    });
  });

  // ── getLead ───────────────────────────────────────────────────────────────
  describe('getLead', () => {
    it('GET /v1.0/leads/{leadId}', async () => {
      const mock = mockFetchSuccess({ id: 42 });
      await tool('getLead').handler({ leadId: 42 }, TEST_CONFIG);
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('GET');
      expect(call.pathname).toBe('/v1.0/leads/42');
    });

    it('forwards withTrash param', async () => {
      const mock = mockFetchSuccess({});
      await tool('getLead').handler({ leadId: 42, withTrash: true }, TEST_CONFIG);
      const call = parseLastFetchCall(mock);
      expect(call.params.withTrash).toBe('true');
    });

    it('returns error on 404', async () => {
      mockFetchError(404);
      const result = await tool('getLead').handler({ leadId: 99 }, TEST_CONFIG);
      expectError(result, 404);
    });
  });

  // ── createLead ────────────────────────────────────────────────────────────
  describe('createLead', () => {
    it('POST /v1.0/leads', async () => {
      const mock = mockFetchSuccess({ id: 1 });
      await tool('createLead').handler(
        { firstName: 'Jane', lastName: 'Doe', emails: ['jane@example.com'] },
        TEST_CONFIG,
      );
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('POST');
      expect(call.pathname).toBe('/v1.0/leads');
      expect(call.body?.firstName).toBe('Jane');
      expect(call.body?.emails).toEqual(['jane@example.com']);
    });

    it('returns error on 422', async () => {
      mockFetchError(422);
      const result = await tool('createLead').handler({}, TEST_CONFIG);
      expectError(result, 422);
    });
  });

  // ── updateLead ────────────────────────────────────────────────────────────
  describe('updateLead', () => {
    it('PUT /v1.0/leads/{leadId}', async () => {
      const mock = mockFetchSuccess({});
      await tool('updateLead').handler(
        { leadId: 5, firstName: 'Updated', tags: ['vip'] },
        TEST_CONFIG,
      );
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('PUT');
      expect(call.pathname).toBe('/v1.0/leads/5');
      expect(call.body?.firstName).toBe('Updated');
      expect(call.body?.tags).toEqual(['vip']);
      // leadId must NOT be in the body
      expect(call.body?.leadId).toBeUndefined();
    });
  });

  // ── deleteLead ────────────────────────────────────────────────────────────
  describe('deleteLead', () => {
    it('DELETE /v1.0/leads/{leadId} with reason param', async () => {
      const mock = mockFetchSuccess({});
      await tool('deleteLead').handler(
        { leadId: 7, reason: 'duplicate' },
        TEST_CONFIG,
      );
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('DELETE');
      expect(call.pathname).toBe('/v1.0/leads/7');
      expect(call.params.reason).toBe('duplicate');
    });

    it('returns error on 404', async () => {
      mockFetchError(404);
      const result = await tool('deleteLead').handler(
        { leadId: 99, reason: 'test' },
        TEST_CONFIG,
      );
      expectError(result, 404);
    });
  });

  // ── assignLead ────────────────────────────────────────────────────────────
  describe('assignLead', () => {
    it('POST /v1.0/leads/{leadId}/assignment', async () => {
      const mock = mockFetchSuccess({});
      await tool('assignLead').handler({ leadId: 10, userId: 99 }, TEST_CONFIG);
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('POST');
      expect(call.pathname).toBe('/v1.0/leads/10/assignment');
      expect(call.body?.userId).toBe(99);
      expect(call.body?.leadId).toBeUndefined();
    });
  });

  // ── updateLeadInquiry ─────────────────────────────────────────────────────
  describe('updateLeadInquiry', () => {
    it('POST /v1.0/leads/{leadId}/inquiry', async () => {
      const mock = mockFetchSuccess({});
      await tool('updateLeadInquiry').handler(
        { leadId: 11, priceMin: 200000, priceMax: 500000, propertyType: ['SFR'] },
        TEST_CONFIG,
      );
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('POST');
      expect(call.pathname).toBe('/v1.0/leads/11/inquiry');
      expect(call.body?.priceMin).toBe(200000);
      expect(call.body?.propertyType).toEqual(['SFR']);
    });
  });

  // ── updateLeadProperty ────────────────────────────────────────────────────
  describe('updateLeadProperty', () => {
    it('POST /v1.0/leads/{leadId}/property', async () => {
      const mock = mockFetchSuccess({});
      await tool('updateLeadProperty').handler(
        { leadId: 12, price: 350000, city: 'Austin', bedrooms: 3 },
        TEST_CONFIG,
      );
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('POST');
      expect(call.pathname).toBe('/v1.0/leads/12/property');
      expect(call.body?.price).toBe(350000);
      expect(call.body?.city).toBe('Austin');
    });
  });

  // ── logLeadActivity ───────────────────────────────────────────────────────
  describe('logLeadActivity', () => {
    it('POST /v1.0/leads/{leadId}/activity', async () => {
      const mock = mockFetchSuccess({});
      await tool('logLeadActivity').handler(
        { leadId: 13, activityType: 'call', note: 'Left voicemail' },
        TEST_CONFIG,
      );
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('POST');
      expect(call.pathname).toBe('/v1.0/leads/13/activity');
      expect(call.body?.activityType).toBe('call');
      expect(call.body?.note).toBe('Left voicemail');
    });
  });

  // ── getLeadActivitiesV1 ───────────────────────────────────────────────────
  describe('getLeadActivitiesV1', () => {
    it('GET /v1.0/leads/{leadId}/activities', async () => {
      const mock = mockFetchSuccess({ items: [] });
      await tool('getLeadActivitiesV1').handler(
        { leadId: 14, curPage: 2 },
        TEST_CONFIG,
      );
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('GET');
      expect(call.pathname).toBe('/v1.0/leads/14/activities');
      expect(call.params.curPage).toBe('2');
    });
  });

  // ── getLeadActivitiesV2 ───────────────────────────────────────────────────
  describe('getLeadActivitiesV2', () => {
    it('GET /v2.0/leads/{leadId}/activities', async () => {
      const mock = mockFetchSuccess({ items: [] });
      await tool('getLeadActivitiesV2').handler(
        { leadId: 15, limit: 50, offset: 0, timeZoneCode: 'America/Chicago' },
        TEST_CONFIG,
      );
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('GET');
      expect(call.pathname).toBe('/v2.0/leads/15/activities');
      expect(call.params.limit).toBe('50');
      expect(call.params.timeZoneCode).toBe('America/Chicago');
    });
  });

  // ── getAssigneeInfo ───────────────────────────────────────────────────────
  describe('getAssigneeInfo', () => {
    it('POST /v1.0/leads/assignee', async () => {
      const mock = mockFetchSuccess({ userId: 5 });
      await tool('getAssigneeInfo').handler(
        { email: 'agent@brokerage.com' },
        TEST_CONFIG,
      );
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('POST');
      expect(call.pathname).toBe('/v1.0/leads/assignee');
      expect(call.body?.email).toBe('agent@brokerage.com');
    });

    it('returns error on 500', async () => {
      mockFetchError(500);
      const result = await tool('getAssigneeInfo').handler({}, TEST_CONFIG);
      expectError(result, 500);
    });
  });

  // ── auth header ───────────────────────────────────────────────────────────
  it('sends Bearer auth header on every request', async () => {
    const mock = mockFetchSuccess({});
    await tool('listLeads').handler({}, TEST_CONFIG);
    const call = parseLastFetchCall(mock);
    expect(call.headers['Authorization']).toBe('Bearer test-bearer-token-abc123');
  });

  // ── stripMeta ─────────────────────────────────────────────────────────────
  it('strips MCP meta keys before forwarding', async () => {
    const mock = mockFetchSuccess({ items: [] });
    await tool('listLeads').handler({ stage: 'Active', _meta: 'x', __mcp: 'y' }, TEST_CONFIG);
    const call = parseLastFetchCall(mock);
    expect(call.params._meta).toBeUndefined();
    expect(call.params.__mcp).toBeUndefined();
    expect(call.params.stage).toBe('Active');
  });
});
