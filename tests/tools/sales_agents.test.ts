import { describe, it, expect, beforeEach } from 'vitest';
import {
  TEST_CONFIG,
  mockFetchSuccess,
  mockFetchError,
  parseLastFetchCall,
  expectError,
} from '../helpers.js';
import { salesAgents } from '../../src/tools/sales_agents.js';

function tool(name: string) {
  const t = salesAgents.find((t) => t.name === name);
  if (!t) throw new Error(`Tool "${name}" not found`);
  return t;
}

describe('salesAgents tools', () => {
  beforeEach(() => {
    mockFetchSuccess({ id: 1 });
  });

  // ── getCurrentSalesAgent ──────────────────────────────────────────────────
  describe('getCurrentSalesAgent', () => {
    it('GET /v2.0/sales-agents/current', async () => {
      const mock = mockFetchSuccess({ id: 1 });
      await tool('getCurrentSalesAgent').handler({}, TEST_CONFIG);
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('GET');
      expect(call.pathname).toBe('/v2.0/sales-agents/current');
    });

    it('returns error on 401', async () => {
      mockFetchError(401);
      const result = await tool('getCurrentSalesAgent').handler({}, TEST_CONFIG);
      expectError(result, 401);
    });
  });

  // ── getSalesAgentByLead ───────────────────────────────────────────────────
  describe('getSalesAgentByLead', () => {
    it('GET /v2.0/sales-agents/by-lead with leadId query param', async () => {
      const mock = mockFetchSuccess({ id: 2 });
      await tool('getSalesAgentByLead').handler({ leadId: 99 }, TEST_CONFIG);
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('GET');
      expect(call.pathname).toBe('/v2.0/sales-agents/by-lead');
      expect(call.params.leadId).toBe('99');
    });

    it('returns error on 404', async () => {
      mockFetchError(404);
      const result = await tool('getSalesAgentByLead').handler({ leadId: 0 }, TEST_CONFIG);
      expectError(result, 404);
    });
  });

  // ── getSalesAgentQuota ────────────────────────────────────────────────────
  describe('getSalesAgentQuota', () => {
    it('GET /v2.0/sales-agents/quota', async () => {
      const mock = mockFetchSuccess({ quota: 10 });
      await tool('getSalesAgentQuota').handler({}, TEST_CONFIG);
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('GET');
      expect(call.pathname).toBe('/v2.0/sales-agents/quota');
    });
  });

  // ── getSalesAgentSettings ─────────────────────────────────────────────────
  describe('getSalesAgentSettings', () => {
    it('GET /v2.0/sales-agent/settings', async () => {
      const mock = mockFetchSuccess({ settings: {} });
      await tool('getSalesAgentSettings').handler({}, TEST_CONFIG);
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('GET');
      expect(call.pathname).toBe('/v2.0/sales-agent/settings');
    });
  });

  // ── saveSalesAgentSettings ────────────────────────────────────────────────
  describe('saveSalesAgentSettings', () => {
    it('PUT /v2.0/sales-agent/settings with body', async () => {
      const mock = mockFetchSuccess({});
      await tool('saveSalesAgentSettings').handler(
        { autoAssign: true, maxLeads: 20 },
        TEST_CONFIG,
      );
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('PUT');
      expect(call.pathname).toBe('/v2.0/sales-agent/settings');
      expect(call.body?.autoAssign).toBe(true);
      expect(call.body?.maxLeads).toBe(20);
    });

    it('returns error on 422', async () => {
      mockFetchError(422);
      const result = await tool('saveSalesAgentSettings').handler({}, TEST_CONFIG);
      expectError(result, 422);
    });
  });

  // ── getWorkingLeads ───────────────────────────────────────────────────────
  describe('getWorkingLeads', () => {
    it('GET /v2.0/working-leads', async () => {
      const mock = mockFetchSuccess({ items: [] });
      await tool('getWorkingLeads').handler({}, TEST_CONFIG);
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('GET');
      expect(call.pathname).toBe('/v2.0/working-leads');
    });

    it('forwards offset and limit', async () => {
      const mock = mockFetchSuccess({ items: [] });
      await tool('getWorkingLeads').handler({ offset: 10, limit: 25 }, TEST_CONFIG);
      const call = parseLastFetchCall(mock);
      expect(call.params.offset).toBe('10');
      expect(call.params.limit).toBe('25');
    });
  });

  // ── addWorkingLeads ───────────────────────────────────────────────────────
  describe('addWorkingLeads', () => {
    it('POST /v2.0/working-leads/add with leadIds body', async () => {
      const mock = mockFetchSuccess({});
      await tool('addWorkingLeads').handler({ leadIds: [1, 2, 3] }, TEST_CONFIG);
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('POST');
      expect(call.pathname).toBe('/v2.0/working-leads/add');
      expect(call.body?.leadIds).toEqual([1, 2, 3]);
    });

    it('returns error on 400', async () => {
      mockFetchError(400);
      const result = await tool('addWorkingLeads').handler({ leadIds: [] }, TEST_CONFIG);
      expectError(result, 400);
    });
  });

  // ── checkWorkingLead ──────────────────────────────────────────────────────
  describe('checkWorkingLead', () => {
    it('GET /v2.0/sales-agents/working-lead/{leadId}', async () => {
      const mock = mockFetchSuccess({ isWorking: true });
      await tool('checkWorkingLead').handler({ leadId: 55 }, TEST_CONFIG);
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('GET');
      expect(call.pathname).toBe('/v2.0/sales-agents/working-lead/55');
    });

    it('leadId not in query params', async () => {
      const mock = mockFetchSuccess({});
      await tool('checkWorkingLead').handler({ leadId: 55 }, TEST_CONFIG);
      const call = parseLastFetchCall(mock);
      expect(call.params.leadId).toBeUndefined();
    });
  });

  // ── muteLead ──────────────────────────────────────────────────────────────
  describe('muteLead', () => {
    it('PUT /v2.0/sales-agents/working-lead/{leadId}/mute', async () => {
      const mock = mockFetchSuccess({});
      await tool('muteLead').handler({ leadId: 77, muted: true }, TEST_CONFIG);
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('PUT');
      expect(call.pathname).toBe('/v2.0/sales-agents/working-lead/77/mute');
      expect(call.body?.muted).toBe(true);
      expect(call.body?.leadId).toBeUndefined();
    });

    it('returns error on 404', async () => {
      mockFetchError(404);
      const result = await tool('muteLead').handler({ leadId: 0 }, TEST_CONFIG);
      expectError(result, 404);
    });
  });

  // ── getMuteStatus ─────────────────────────────────────────────────────────
  describe('getMuteStatus', () => {
    it('GET /v2.0/sales-agent/lead/mute-status with leadId query param', async () => {
      const mock = mockFetchSuccess({ muted: false });
      await tool('getMuteStatus').handler({ leadId: 88 }, TEST_CONFIG);
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('GET');
      expect(call.pathname).toBe('/v2.0/sales-agent/lead/mute-status');
      expect(call.params.leadId).toBe('88');
    });
  });

  // ── sendSmsViaAiNumber ────────────────────────────────────────────────────
  describe('sendSmsViaAiNumber', () => {
    it('POST /v2.0/sales-agent/ai-number/send-sms-to-agent', async () => {
      const mock = mockFetchSuccess({ sent: true });
      await tool('sendSmsViaAiNumber').handler(
        { content: 'Hello agent', leadId: 42 },
        TEST_CONFIG,
      );
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('POST');
      expect(call.pathname).toBe('/v2.0/sales-agent/ai-number/send-sms-to-agent');
      expect(call.body?.content).toBe('Hello agent');
      expect(call.body?.leadId).toBe(42);
    });

    it('returns error on 500', async () => {
      mockFetchError(500);
      const result = await tool('sendSmsViaAiNumber').handler(
        { content: 'x', leadId: 1 },
        TEST_CONFIG,
      );
      expectError(result, 500);
    });
  });

  // ── batchCreatePlanTasks ──────────────────────────────────────────────────
  describe('batchCreatePlanTasks', () => {
    it('POST /v2.0/plan-tasks/create with body', async () => {
      const mock = mockFetchSuccess({ created: 2 });
      const planTasks = [{ type: 'call', dueDate: '2024-01-01' }];
      await tool('batchCreatePlanTasks').handler(
        { leadId: 10, planTasks },
        TEST_CONFIG,
      );
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('POST');
      expect(call.pathname).toBe('/v2.0/plan-tasks/create');
      expect(call.body?.leadId).toBe(10);
      expect(call.body?.planTasks).toEqual(planTasks);
    });
  });

  // ── getPlanTasksByLead ────────────────────────────────────────────────────
  describe('getPlanTasksByLead', () => {
    it('GET /v2.0/plan-tasks/lead/{leadId}', async () => {
      const mock = mockFetchSuccess({ items: [] });
      await tool('getPlanTasksByLead').handler({ leadId: 33 }, TEST_CONFIG);
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('GET');
      expect(call.pathname).toBe('/v2.0/plan-tasks/lead/33');
    });

    it('leadId not in query params', async () => {
      const mock = mockFetchSuccess({});
      await tool('getPlanTasksByLead').handler({ leadId: 33 }, TEST_CONFIG);
      const call = parseLastFetchCall(mock);
      expect(call.params.leadId).toBeUndefined();
    });

    it('returns error on 404', async () => {
      mockFetchError(404);
      const result = await tool('getPlanTasksByLead').handler({ leadId: 0 }, TEST_CONFIG);
      expectError(result, 404);
    });
  });

  // ── auth header ───────────────────────────────────────────────────────────
  it('sends Bearer auth header on every request', async () => {
    const mock = mockFetchSuccess({});
    await tool('getCurrentSalesAgent').handler({}, TEST_CONFIG);
    const call = parseLastFetchCall(mock);
    expect(call.headers['Authorization']).toBe('Bearer test-bearer-token-abc123');
  });

  // ── stripMeta ─────────────────────────────────────────────────────────────
  it('strips MCP meta keys before forwarding', async () => {
    const mock = mockFetchSuccess({ items: [] });
    await tool('getWorkingLeads').handler(
      { limit: 10, _meta: 'x', __mcp: 'y' },
      TEST_CONFIG,
    );
    const call = parseLastFetchCall(mock);
    expect(call.params._meta).toBeUndefined();
    expect(call.params.__mcp).toBeUndefined();
    expect(call.params.limit).toBe('10');
  });
});
