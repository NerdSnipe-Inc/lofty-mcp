import type { ToolDef } from '../client.js';
import { loftyRequest, formatError, stripMeta } from '../client.js';

export const agentOrgTools: ToolDef[] = [
  {
    name: 'getOrgInfo',
    description: 'Get organization info.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
    handler: async (_args, config) => {
      try {
        const result = await loftyRequest('GET', '/v1.0/org', { config });
        return JSON.stringify(result);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'updateCompany',
    description: 'Update company information.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Company name' },
        address: { type: 'string', description: 'Company address' },
        phone: { type: 'string', description: 'Company phone' },
      },
      required: [],
    },
    handler: async (args, config) => {
      try {
        const clean = stripMeta(args);
        const result = await loftyRequest('POST', '/v1.0/org/company', { config, body: clean });
        return JSON.stringify(result);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'addOffice',
    description: 'Add a new office to the organization.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Office name' },
        address: { type: 'string', description: 'Office address' },
        phone: { type: 'string', description: 'Office phone' },
      },
      required: [],
    },
    handler: async (args, config) => {
      try {
        const clean = stripMeta(args);
        const result = await loftyRequest('PUT', '/v1.0/org/office', { config, body: clean });
        return JSON.stringify(result);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'updateOffice',
    description: 'Update an existing office.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'integer', description: 'Office ID' },
        name: { type: 'string', description: 'Office name' },
        address: { type: 'string', description: 'Office address' },
        phone: { type: 'string', description: 'Office phone' },
      },
      required: [],
    },
    handler: async (args, config) => {
      try {
        const clean = stripMeta(args);
        const result = await loftyRequest('POST', '/v1.0/org/office', { config, body: clean });
        return JSON.stringify(result);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'getPermissionProfiles',
    description: 'Get permission profiles for the organization.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
    handler: async (_args, config) => {
      try {
        const result = await loftyRequest('GET', '/v1.0/org/permission/profiles', { config });
        return JSON.stringify(result);
      } catch (e) {
        return formatError(e);
      }
    },
  },
];
