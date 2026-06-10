import type { ToolDef } from '../client.js';
import { loftyRequest, formatError, stripMeta } from '../client.js';

export const leadManualLogTools: ToolDef[] = [
  {
    name: 'listManualLogTypes',
    description: 'List all manual log types.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
    handler: async (args, config) => {
      try {
        const rest = stripMeta(args);
        const result = await loftyRequest('GET', '/v1.0/logType', {
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
    name: 'createManualLogType',
    description: 'Create a new manual log type.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Log type name' },
        type: { type: 'string', enum: ['call', 'email', 'text'], description: 'Log type' },
        direction: {
          type: 'string',
          enum: ['inbound', 'outbound'],
          description: 'Direction',
        },
      },
      required: ['name', 'type', 'direction'],
    },
    handler: async (args, config) => {
      try {
        const clean = stripMeta(args);
        const result = await loftyRequest('POST', '/v1.0/logType', { config, body: clean });
        return JSON.stringify(result);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'getManualLogType',
    description: 'Get a manual log type by ID.',
    inputSchema: {
      type: 'object',
      properties: {
        logTypeId: { type: 'integer', description: 'Log type ID' },
      },
      required: ['logTypeId'],
    },
    handler: async (args, config) => {
      try {
        const { logTypeId, ...rest } = stripMeta(args);
        const result = await loftyRequest('GET', `/v1.0/logType/${logTypeId}`, {
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
    name: 'deleteManualLogType',
    description: 'Delete a manual log type by ID.',
    inputSchema: {
      type: 'object',
      properties: {
        logTypeId: { type: 'integer', description: 'Log type ID' },
      },
      required: ['logTypeId'],
    },
    handler: async (args, config) => {
      try {
        const { logTypeId } = stripMeta(args);
        const result = await loftyRequest('DELETE', `/v1.0/logType/${logTypeId}`, { config });
        return JSON.stringify(result);
      } catch (e) {
        return formatError(e);
      }
    },
  },
];
