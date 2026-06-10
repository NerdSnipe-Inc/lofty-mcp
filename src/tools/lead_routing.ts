import type { ToolDef } from '../client.js';
import { loftyRequest, formatError, stripMeta } from '../client.js';

export const leadRoutingTools: ToolDef[] = [
  {
    name: 'listRoutingRules',
    description: 'List routing rules for a business type.',
    inputSchema: {
      type: 'object',
      properties: {
        type: { type: 'string', description: 'Business type (e.g. buyer, seller)' },
      },
      required: ['type'],
    },
    handler: async (args, config) => {
      try {
        const { type, ...rest } = stripMeta(args);
        const result = await loftyRequest('GET', `/v1.0/routing/rule/list/${type}`, {
          config,
          params: Object.keys(rest).length ? rest : undefined,
        });
        return JSON.stringify(result);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'updateRoutingRule',
    description: 'Update a routing rule for a business type.',
    inputSchema: {
      type: 'object',
      properties: {
        type: { type: 'string', description: 'Business type (e.g. buyer, seller)' },
        id: { type: 'integer', description: 'Rule ID' },
        activeHours: { type: 'object', description: 'Active hours configuration' },
        routingStrategy: { type: 'string', description: 'Routing strategy' },
      },
      required: ['type'],
    },
    handler: async (args, config) => {
      try {
        const { type, ...rest } = stripMeta(args);
        const result = await loftyRequest('PUT', `/v1.0/routing/rule/${type}`, {
          config,
          body: rest,
        });
        return JSON.stringify(result);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'getSupplementRule',
    description: 'Get supplement routing rule for a business type.',
    inputSchema: {
      type: 'object',
      properties: {
        type: { type: 'string', description: 'Business type (e.g. buyer, seller)' },
      },
      required: ['type'],
    },
    handler: async (args, config) => {
      try {
        const { type, ...rest } = stripMeta(args);
        const result = await loftyRequest('GET', `/v1.0/routing/rule/supplement/${type}`, {
          config,
          params: Object.keys(rest).length ? rest : undefined,
        });
        return JSON.stringify(result);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'updateSupplementRule',
    description: 'Update supplement routing rule for a business type.',
    inputSchema: {
      type: 'object',
      properties: {
        type: { type: 'string', description: 'Business type (e.g. buyer, seller)' },
      },
      required: ['type'],
    },
    handler: async (args, config) => {
      try {
        const { type, ...rest } = stripMeta(args);
        const result = await loftyRequest('PUT', `/v1.0/routing/rule/supplement/${type}`, {
          config,
          body: rest,
        });
        return JSON.stringify(result);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'listRoutingRoles',
    description: 'List all routing roles.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
    handler: async (args, config) => {
      try {
        const rest = stripMeta(args);
        const result = await loftyRequest('GET', '/v1.0/routing/role/list', {
          config,
          params: Object.keys(rest).length ? rest : undefined,
        });
        return JSON.stringify(result);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'listAssignMembers',
    description: 'List assign members for a business type.',
    inputSchema: {
      type: 'object',
      properties: {
        type: { type: 'string', description: 'Business type (e.g. buyer, seller)' },
      },
      required: ['type'],
    },
    handler: async (args, config) => {
      try {
        const { type, ...rest } = stripMeta(args);
        const result = await loftyRequest('GET', `/v1.0/routing/member/list/${type}`, {
          config,
          params: Object.keys(rest).length ? rest : undefined,
        });
        return JSON.stringify(result);
      } catch (e) {
        return formatError(e);
      }
    },
  },
];
