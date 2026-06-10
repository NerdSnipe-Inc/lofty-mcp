import { loftyRequest, formatError, stripMeta } from '../client.js';
import type { LoftyConfig, ToolDef } from '../client.js';

export const callsTools: ToolDef[] = [
  {
    name: 'listCalls',
    description: 'List call records for a lead.',
    inputSchema: {
      type: 'object',
      properties: {
        leadId: { type: 'integer', description: 'ID of the lead (required)' },
        offset: { type: 'integer', description: 'Pagination offset' },
        limit: { type: 'integer', description: 'Max number of results to return' },
      },
      required: ['leadId'],
    },
    handler: async (args: Record<string, unknown>, config: LoftyConfig): Promise<string> => {
      try {
        const { leadId, ...rest } = stripMeta(args);
        const data = await loftyRequest('GET', '/v1.0/calls', {
          config,
          params: { leadId, ...rest },
        });
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'getCallRecord',
    description: 'Get a single call record by call ID.',
    inputSchema: {
      type: 'object',
      properties: {
        callId: { type: 'integer', description: 'ID of the call record' },
      },
      required: ['callId'],
    },
    handler: async (args: Record<string, unknown>, config: LoftyConfig): Promise<string> => {
      try {
        const { callId, ...rest } = stripMeta(args);
        const data = await loftyRequest('GET', `/v1.0/calls/${callId}`, {
          config,
          params: Object.keys(rest).length ? rest : undefined,
        });
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'getCallRecordUrl',
    description: 'Get the recording URL for a call by call ID.',
    inputSchema: {
      type: 'object',
      properties: {
        callId: { type: 'integer', description: 'ID of the call' },
      },
      required: ['callId'],
    },
    handler: async (args: Record<string, unknown>, config: LoftyConfig): Promise<string> => {
      try {
        const { callId, ...rest } = stripMeta(args);
        const data = await loftyRequest('GET', `/v1.0/call/url/${callId}`, {
          config,
          params: Object.keys(rest).length ? rest : undefined,
        });
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return formatError(e);
      }
    },
  },
];
