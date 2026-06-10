import type { ToolDef } from '../client.js';
import { loftyRequest, formatError, stripMeta } from '../client.js';

export const notificationsTools: ToolDef[] = [
  {
    name: 'sendOpportunityNotification',
    description: 'Send an opportunity notification to an agent.',
    inputSchema: {
      type: 'object',
      properties: {
        agentId: { type: 'integer', description: 'Agent ID' },
        message: { type: 'string', description: 'Notification message' },
        type: { type: 'string', description: 'Notification type (optional)' },
      },
      required: ['agentId', 'message'],
    },
    handler: async (args, config) => {
      try {
        const clean = stripMeta(args);
        const result = await loftyRequest('POST', '/v1.0/agent/send-notification', {
          config,
          body: clean,
        });
        return JSON.stringify(result);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'sendAppPushTaskReminder',
    description: 'Send an app push task reminder notification.',
    inputSchema: {
      type: 'object',
      properties: {
        leadId: { type: 'integer', description: 'Lead ID' },
        taskId: { type: 'integer', description: 'Task ID' },
      },
      required: ['leadId', 'taskId'],
    },
    handler: async (args, config) => {
      try {
        const clean = stripMeta(args);
        const result = await loftyRequest(
          'POST',
          '/v2.0/sales-agent/notification/app-push/send-task-reminder',
          { config, body: clean },
        );
        return JSON.stringify(result);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'sendSystemSmsToAgent',
    description: 'Send a system SMS message to an agent.',
    inputSchema: {
      type: 'object',
      properties: {
        agentId: { type: 'integer', description: 'Agent ID' },
        content: { type: 'string', description: 'SMS content' },
      },
      required: ['agentId', 'content'],
    },
    handler: async (args, config) => {
      try {
        const clean = stripMeta(args);
        const result = await loftyRequest(
          'POST',
          '/v2.0/sales-agent/message/sms/send-to-agent',
          { config, body: clean },
        );
        return JSON.stringify(result);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'sendSystemEmailToAgent',
    description: 'Send a system email message to an agent.',
    inputSchema: {
      type: 'object',
      properties: {
        agentId: { type: 'integer', description: 'Agent ID' },
        subject: { type: 'string', description: 'Email subject' },
        content: { type: 'string', description: 'Email content' },
      },
      required: ['agentId', 'subject', 'content'],
    },
    handler: async (args, config) => {
      try {
        const clean = stripMeta(args);
        const result = await loftyRequest(
          'POST',
          '/v2.0/sales-agent/message/email/send-to-agent',
          { config, body: clean },
        );
        return JSON.stringify(result);
      } catch (e) {
        return formatError(e);
      }
    },
  },
];
