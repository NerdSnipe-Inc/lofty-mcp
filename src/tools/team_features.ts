import { loftyRequest, formatError, stripMeta, type ToolDef, type LoftyConfig } from '../client.js';

export const teamFeatures: ToolDef[] = [
  {
    name: 'listTags',
    description: 'List all tags defined for the team.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    handler: async (args: Record<string, unknown>, config: LoftyConfig): Promise<string> => {
      try {
        const data = await loftyRequest('GET', '/v1.0/teamFeatures/listTag', { config });
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'listCustomFields',
    description: 'List all custom fields defined for the team.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    handler: async (args: Record<string, unknown>, config: LoftyConfig): Promise<string> => {
      try {
        const data = await loftyRequest('GET', '/v1.0/teamFeatures/listCustomField', { config });
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'addCustomField',
    description: 'Add or update a custom field value.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'integer', description: 'Custom field ID.' },
        value: { type: 'string', description: 'Custom field value.' },
      },
      required: ['id', 'value'],
    },
    handler: async (args: Record<string, unknown>, config: LoftyConfig): Promise<string> => {
      try {
        const body = stripMeta(args);
        const data = await loftyRequest('POST', '/v1.0/teamFeatures/custom-field', {
          config,
          body,
        });
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'listPipelines',
    description: 'List all lead pipelines for the team.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    handler: async (args: Record<string, unknown>, config: LoftyConfig): Promise<string> => {
      try {
        const params = stripMeta(args);
        const data = await loftyRequest('GET', '/v1.0/teamFeatures/lead-pipelines', {
          config,
          params,
        });
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'listLeadPonds',
    description: 'List all lead ponds for the team.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    handler: async (args: Record<string, unknown>, config: LoftyConfig): Promise<string> => {
      try {
        const data = await loftyRequest('GET', '/v1.0/team-features/lead-ponds', { config });
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'getLeadPond',
    description: 'Get a specific lead pond by ID.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'integer', description: 'The lead pond ID.' },
      },
      required: ['id'],
    },
    handler: async (args: Record<string, unknown>, config: LoftyConfig): Promise<string> => {
      try {
        const { id } = stripMeta(args);
        const data = await loftyRequest('GET', `/v1.0/team-features/lead-pond/${id}`, { config });
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return formatError(e);
      }
    },
  },
];
