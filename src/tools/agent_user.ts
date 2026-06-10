import type { ToolDef } from '../client.js';
import { loftyRequest, formatError, stripMeta } from '../client.js';

export const agentUserTools: ToolDef[] = [
  {
    name: 'addAgent',
    description: 'Add a new agent profile.',
    inputSchema: {
      type: 'object',
      properties: {
        email: { type: 'string', description: 'Agent email address' },
        firstName: { type: 'string', description: 'Agent first name' },
        lastName: { type: 'string', description: 'Agent last name (optional)' },
        role: { type: 'string', description: 'Agent role (optional)' },
      },
      required: ['email', 'firstName'],
    },
    handler: async (args, config) => {
      try {
        const clean = stripMeta(args);
        const result = await loftyRequest('POST', '/v1.0/agent/profile/add', {
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
    name: 'addAgentTag',
    description: 'Add tags to an agent.',
    inputSchema: {
      type: 'object',
      properties: {
        agentId: { type: 'integer', description: 'Agent ID' },
        tags: { type: 'array', items: { type: 'string' }, description: 'Tags to add' },
      },
      required: ['agentId', 'tags'],
    },
    handler: async (args, config) => {
      try {
        const { agentId, ...rest } = stripMeta(args);
        const result = await loftyRequest('POST', `/v1.0/agent/${agentId}/tag/add`, {
          config,
          body: rest,
        });
        return JSON.stringify(result);
      } catch (e) {
        return formatError(e);
      }
    },
  },
];
