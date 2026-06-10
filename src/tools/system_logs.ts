import { type ToolDef, loftyRequest, formatError, stripMeta } from '../client.js';

export const system_logs: ToolDef[] = [
  {
    name: 'getSystemLogs',
    description: 'Get system logs for a specific lead, with optional offset and limit for pagination.',
    inputSchema: {
      type: 'object',
      required: ['leadId'],
      properties: {
        leadId: { type: 'integer', description: 'Lead ID to retrieve system logs for' },
        offset: { type: 'integer', description: 'Pagination offset' },
        limit: { type: 'integer', description: 'Number of results to return' },
      },
    },
    handler: async (args, config) => {
      try {
        const params = stripMeta(args);
        const data = await loftyRequest('GET', '/v1.0/systemLogs', { config, params });
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return formatError(e);
      }
    },
  },
];
