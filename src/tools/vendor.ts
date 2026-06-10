import type { ToolDef } from '../client.js';
import { loftyRequest, formatError, stripMeta } from '../client.js';

export const vendorTools: ToolDef[] = [
  {
    name: 'getVendors',
    description: 'List vendors.',
    inputSchema: {
      type: 'object',
      properties: {
        offset: { type: 'integer', description: 'Pagination offset (optional)' },
        limit: { type: 'integer', description: 'Page size (optional)' },
      },
      required: [],
    },
    handler: async (args, config) => {
      try {
        const rest = stripMeta(args);
        const result = await loftyRequest('GET', '/v1.0/vendor/list', {
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
