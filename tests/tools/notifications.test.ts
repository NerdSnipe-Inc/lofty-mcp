import { describe, it, expect, beforeEach } from 'vitest';
import {
  TEST_CONFIG,
  mockFetchSuccess,
  mockFetchError,
  parseLastFetchCall,
  expectError,
  MOCK_DATA,
} from '../helpers.js';
import { notificationsTools } from '../../src/tools/notifications.js';

function tool(name: string) {
  const t = notificationsTools.find((t) => t.name === name);
  if (!t) throw new Error(`Tool "${name}" not found`);
  return t;
}

describe('notifications tools', () => {
  beforeEach(() => {
    mockFetchSuccess(MOCK_DATA);
  });

  // ── sendOpportunityNotification ───────────────────────────────────────────
  describe('sendOpportunityNotification', () => {
    it('POST /v1.0/agent/send-notification with required fields', async () => {
      const mock = mockFetchSuccess(MOCK_DATA);
      await tool('sendOpportunityNotification').handler(
        { agentId: 1, message: 'New lead assigned' },
        TEST_CONFIG,
      );
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('POST');
      expect(call.pathname).toBe('/v1.0/agent/send-notification');
      expect(call.body?.agentId).toBe(1);
      expect(call.body?.message).toBe('New lead assigned');
    });

    it('includes optional type in body', async () => {
      const mock = mockFetchSuccess(MOCK_DATA);
      await tool('sendOpportunityNotification').handler(
        { agentId: 1, message: 'Hello', type: 'opportunity' },
        TEST_CONFIG,
      );
      const call = parseLastFetchCall(mock);
      expect(call.body?.type).toBe('opportunity');
    });

    it('returns error on 400', async () => {
      mockFetchError(400);
      const result = await tool('sendOpportunityNotification').handler(
        { agentId: 1, message: 'x' },
        TEST_CONFIG,
      );
      expectError(result, 400);
    });
  });

  // ── sendAppPushTaskReminder ───────────────────────────────────────────────
  describe('sendAppPushTaskReminder', () => {
    it('POST /v2.0/sales-agent/notification/app-push/send-task-reminder', async () => {
      const mock = mockFetchSuccess(MOCK_DATA);
      await tool('sendAppPushTaskReminder').handler(
        { leadId: 10, taskId: 20 },
        TEST_CONFIG,
      );
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('POST');
      expect(call.pathname).toBe('/v2.0/sales-agent/notification/app-push/send-task-reminder');
      expect(call.body?.leadId).toBe(10);
      expect(call.body?.taskId).toBe(20);
    });

    it('returns error on 404', async () => {
      mockFetchError(404);
      const result = await tool('sendAppPushTaskReminder').handler(
        { leadId: 1, taskId: 1 },
        TEST_CONFIG,
      );
      expectError(result, 404);
    });
  });

  // ── sendSystemSmsToAgent ──────────────────────────────────────────────────
  describe('sendSystemSmsToAgent', () => {
    it('POST /v2.0/sales-agent/message/sms/send-to-agent', async () => {
      const mock = mockFetchSuccess(MOCK_DATA);
      await tool('sendSystemSmsToAgent').handler(
        { agentId: 5, content: 'You have a new lead' },
        TEST_CONFIG,
      );
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('POST');
      expect(call.pathname).toBe('/v2.0/sales-agent/message/sms/send-to-agent');
      expect(call.body?.agentId).toBe(5);
      expect(call.body?.content).toBe('You have a new lead');
    });

    it('returns error on 422', async () => {
      mockFetchError(422);
      const result = await tool('sendSystemSmsToAgent').handler(
        { agentId: 1, content: 'x' },
        TEST_CONFIG,
      );
      expectError(result, 422);
    });
  });

  // ── sendSystemEmailToAgent ────────────────────────────────────────────────
  describe('sendSystemEmailToAgent', () => {
    it('POST /v2.0/sales-agent/message/email/send-to-agent', async () => {
      const mock = mockFetchSuccess(MOCK_DATA);
      await tool('sendSystemEmailToAgent').handler(
        { agentId: 7, subject: 'Lead alert', content: 'A new lead arrived' },
        TEST_CONFIG,
      );
      const call = parseLastFetchCall(mock);
      expect(call.method).toBe('POST');
      expect(call.pathname).toBe('/v2.0/sales-agent/message/email/send-to-agent');
      expect(call.body?.agentId).toBe(7);
      expect(call.body?.subject).toBe('Lead alert');
      expect(call.body?.content).toBe('A new lead arrived');
    });

    it('returns error on 500', async () => {
      mockFetchError(500);
      const result = await tool('sendSystemEmailToAgent').handler(
        { agentId: 1, subject: 'x', content: 'y' },
        TEST_CONFIG,
      );
      expectError(result, 500);
    });
  });

  // ── auth & meta ───────────────────────────────────────────────────────────
  it('sends Bearer auth header', async () => {
    const mock = mockFetchSuccess({});
    await tool('sendOpportunityNotification').handler(
      { agentId: 1, message: 'test' },
      TEST_CONFIG,
    );
    const call = parseLastFetchCall(mock);
    expect(call.headers['Authorization']).toBe('Bearer test-bearer-token-abc123');
  });

  it('strips MCP meta keys', async () => {
    const mock = mockFetchSuccess(MOCK_DATA);
    await tool('sendSystemSmsToAgent').handler(
      { agentId: 1, content: 'hi', _meta: 'x', __mcp: 'y' },
      TEST_CONFIG,
    );
    const call = parseLastFetchCall(mock);
    expect(call.body?._meta).toBeUndefined();
    expect(call.body?.__mcp).toBeUndefined();
  });

  it('exports exactly 4 tools', () => {
    expect(notificationsTools).toHaveLength(4);
  });
});
