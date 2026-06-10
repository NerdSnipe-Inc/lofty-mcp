import { loftyRequest, formatError, stripMeta, type ToolDef, type LoftyConfig } from '../client.js';

export const members: ToolDef[] = [
  {
    name: 'getMe',
    description: 'Get the current authenticated user profile.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    handler: async (args: Record<string, unknown>, config: LoftyConfig): Promise<string> => {
      try {
        const data = await loftyRequest('GET', '/v1.0/me', { config });
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'listMembers',
    description: 'List all members in the team.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    handler: async (args: Record<string, unknown>, config: LoftyConfig): Promise<string> => {
      try {
        const params = stripMeta(args);
        const data = await loftyRequest('GET', '/v1.0/members', { config, params });
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'getMemberByAccount',
    description: 'Get a member by their account (email address).',
    inputSchema: {
      type: 'object',
      properties: {
        account: { type: 'string', description: 'The member email address.' },
      },
      required: ['account'],
    },
    handler: async (args: Record<string, unknown>, config: LoftyConfig): Promise<string> => {
      try {
        const { account } = stripMeta(args);
        const data = await loftyRequest('GET', `/v1.0/members/${account}`, { config });
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'getMemberById',
    description: 'Get a member/user by their numeric user ID.',
    inputSchema: {
      type: 'object',
      properties: {
        userId: { type: 'integer', description: 'The user ID.' },
      },
      required: ['userId'],
    },
    handler: async (args: Record<string, unknown>, config: LoftyConfig): Promise<string> => {
      try {
        const { userId } = stripMeta(args);
        const data = await loftyRequest('GET', `/v1.0/users/${userId}`, { config });
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return formatError(e);
      }
    },
  },
];
