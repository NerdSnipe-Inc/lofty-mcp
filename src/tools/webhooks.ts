import { type ToolDef, loftyRequest, formatError, stripMeta } from '../client.js';

export const webhooks: ToolDef[] = [
  {
    name: 'listWebhooks',
    description: 'List all webhook subscriptions for the account.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    handler: async (args, config) => {
      try {
        const data = await loftyRequest('GET', '/v1.0/webhooks', { config });
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'createWebhook',
    description:
      'Subscribe to a Lofty webhook event. ' +
      'Event types (listId): 1=Agent Info, 2=Lead Info, 3=Lead Activity, ' +
      '4=Listing Alert, 5=Transaction, 6=Call, 7=Email, 8=Text, 9=Note, ' +
      '10=Task, 11=Appointment, 12=Pipeline Change. ' +
      'callbackUrl must be HTTPS.',
    inputSchema: {
      type: 'object',
      required: ['listId', 'callbackUrl'],
      properties: {
        listId: {
          type: 'integer',
          description: 'Event type ID (1-12)',
          minimum: 1,
          maximum: 12,
        },
        callbackUrl: {
          type: 'string',
          description: 'HTTPS URL to receive webhook payloads',
        },
        limit: {
          type: 'integer',
          description: 'Maximum events per batch (default 100)',
        },
      },
    },
    handler: async (args, config) => {
      try {
        const body = stripMeta(args);
        const data = await loftyRequest('POST', '/v1.0/webhook', { config, body });
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'deleteWebhook',
    description: 'Delete a webhook subscription by its subscribe ID.',
    inputSchema: {
      type: 'object',
      required: ['subscribeId'],
      properties: {
        subscribeId: { type: 'integer', description: 'Webhook subscription ID to delete' },
      },
    },
    handler: async (args, config) => {
      try {
        const { subscribeId } = stripMeta(args);
        const data = await loftyRequest('DELETE', `/v1.0/webhook/${subscribeId}`, { config });
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return formatError(e);
      }
    },
  },
];
