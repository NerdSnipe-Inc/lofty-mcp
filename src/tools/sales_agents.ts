import { loftyRequest, formatError, stripMeta, type ToolDef, type LoftyConfig } from '../client.js';

export const salesAgents: ToolDef[] = [
  {
    name: 'getCurrentSalesAgent',
    description: 'Get the current authenticated sales agent profile.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    handler: async (args: Record<string, unknown>, config: LoftyConfig): Promise<string> => {
      try {
        const data = await loftyRequest('GET', '/v2.0/sales-agents/current', { config });
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'getSalesAgentByLead',
    description: 'Get the sales agent assigned to a specific lead.',
    inputSchema: {
      type: 'object',
      properties: {
        leadId: { type: 'integer', description: 'The lead ID.' },
      },
      required: ['leadId'],
    },
    handler: async (args: Record<string, unknown>, config: LoftyConfig): Promise<string> => {
      try {
        const clean = stripMeta(args);
        const data = await loftyRequest('GET', '/v2.0/sales-agents/by-lead', {
          config,
          params: clean,
        });
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'getSalesAgentQuota',
    description: 'Get the current sales agent quota.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    handler: async (args: Record<string, unknown>, config: LoftyConfig): Promise<string> => {
      try {
        const data = await loftyRequest('GET', '/v2.0/sales-agents/quota', { config });
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'getSalesAgentSettings',
    description: 'Get sales agent settings.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    handler: async (args: Record<string, unknown>, config: LoftyConfig): Promise<string> => {
      try {
        const data = await loftyRequest('GET', '/v2.0/sales-agent/settings', { config });
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'saveSalesAgentSettings',
    description: 'Save/update sales agent settings.',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: true,
    },
    handler: async (args: Record<string, unknown>, config: LoftyConfig): Promise<string> => {
      try {
        const body = stripMeta(args);
        const data = await loftyRequest('PUT', '/v2.0/sales-agent/settings', { config, body });
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'getWorkingLeads',
    description: 'List working leads for the current sales agent.',
    inputSchema: {
      type: 'object',
      properties: {
        offset: { type: 'integer', description: 'Pagination offset.' },
        limit: { type: 'integer', description: 'Maximum number of results.' },
      },
    },
    handler: async (args: Record<string, unknown>, config: LoftyConfig): Promise<string> => {
      try {
        const params = stripMeta(args);
        const data = await loftyRequest('GET', '/v2.0/working-leads', { config, params });
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'addWorkingLeads',
    description: 'Add leads to the working leads list.',
    inputSchema: {
      type: 'object',
      properties: {
        leadIds: {
          type: 'array',
          items: { type: 'integer' },
          description: 'Array of lead IDs to add.',
        },
      },
      required: ['leadIds'],
    },
    handler: async (args: Record<string, unknown>, config: LoftyConfig): Promise<string> => {
      try {
        const body = stripMeta(args);
        const data = await loftyRequest('POST', '/v2.0/working-leads/add', { config, body });
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'checkWorkingLead',
    description: 'Check if a specific lead is in the working leads list.',
    inputSchema: {
      type: 'object',
      properties: {
        leadId: { type: 'integer', description: 'The lead ID.' },
      },
      required: ['leadId'],
    },
    handler: async (args: Record<string, unknown>, config: LoftyConfig): Promise<string> => {
      try {
        const { leadId } = stripMeta(args);
        const data = await loftyRequest(
          'GET',
          `/v2.0/sales-agents/working-lead/${leadId}`,
          { config },
        );
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'muteLead',
    description: 'Mute or unmute a working lead.',
    inputSchema: {
      type: 'object',
      properties: {
        leadId: { type: 'integer', description: 'The lead ID.' },
        muted: { type: 'boolean', description: 'Whether to mute the lead.' },
      },
      required: ['leadId'],
    },
    handler: async (args: Record<string, unknown>, config: LoftyConfig): Promise<string> => {
      try {
        const clean = stripMeta(args);
        const { leadId, ...body } = clean;
        const data = await loftyRequest(
          'PUT',
          `/v2.0/sales-agents/working-lead/${leadId}/mute`,
          { config, body },
        );
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'getMuteStatus',
    description: 'Get the mute status for a lead.',
    inputSchema: {
      type: 'object',
      properties: {
        leadId: { type: 'integer', description: 'The lead ID.' },
      },
      required: ['leadId'],
    },
    handler: async (args: Record<string, unknown>, config: LoftyConfig): Promise<string> => {
      try {
        const params = stripMeta(args);
        const data = await loftyRequest('GET', '/v2.0/sales-agent/lead/mute-status', {
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
    name: 'sendSmsViaAiNumber',
    description: 'Send an SMS to the agent via the AI number.',
    inputSchema: {
      type: 'object',
      properties: {
        content: { type: 'string', description: 'SMS message content.' },
        leadId: { type: 'integer', description: 'The lead ID.' },
      },
      required: ['content', 'leadId'],
    },
    handler: async (args: Record<string, unknown>, config: LoftyConfig): Promise<string> => {
      try {
        const body = stripMeta(args);
        const data = await loftyRequest(
          'POST',
          '/v2.0/sales-agent/ai-number/send-sms-to-agent',
          { config, body },
        );
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'batchCreatePlanTasks',
    description: 'Batch create plan tasks for a lead.',
    inputSchema: {
      type: 'object',
      properties: {
        leadId: { type: 'integer', description: 'The lead ID.' },
        planTasks: {
          type: 'array',
          description: 'Array of plan task objects to create.',
        },
      },
      required: ['leadId', 'planTasks'],
    },
    handler: async (args: Record<string, unknown>, config: LoftyConfig): Promise<string> => {
      try {
        const body = stripMeta(args);
        const data = await loftyRequest('POST', '/v2.0/plan-tasks/create', { config, body });
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'getPlanTasksByLead',
    description: 'Get plan tasks for a specific lead.',
    inputSchema: {
      type: 'object',
      properties: {
        leadId: { type: 'integer', description: 'The lead ID.' },
      },
      required: ['leadId'],
    },
    handler: async (args: Record<string, unknown>, config: LoftyConfig): Promise<string> => {
      try {
        const { leadId } = stripMeta(args);
        const data = await loftyRequest(
          'GET',
          `/v2.0/plan-tasks/lead/${leadId}`,
          { config },
        );
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return formatError(e);
      }
    },
  },
];
