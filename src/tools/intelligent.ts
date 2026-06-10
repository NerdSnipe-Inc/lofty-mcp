import type { ToolDef } from '../client.js';
import { loftyRequest, formatError, stripMeta } from '../client.js';

export const intelligentTools: ToolDef[] = [
  {
    name: 'generateCallScript',
    description: 'Generate an AI call script for a lead.',
    inputSchema: {
      type: 'object',
      properties: {
        leadId: { type: 'integer', description: 'Lead ID' },
        agentId: { type: 'integer', description: 'Agent ID (optional)' },
      },
      required: ['leadId'],
    },
    handler: async (args, config) => {
      try {
        const clean = stripMeta(args);
        const result = await loftyRequest('POST', '/v2.0/ai/call-script', { config, body: clean });
        return JSON.stringify(result);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'getCallSummary',
    description: 'Get AI call summary for a lead.',
    inputSchema: {
      type: 'object',
      properties: {
        leadId: { type: 'integer', description: 'Lead ID' },
      },
      required: ['leadId'],
    },
    handler: async (args, config) => {
      try {
        const { leadId, ...rest } = stripMeta(args);
        const result = await loftyRequest('GET', '/v2.0/ai/call-summary', {
          config,
          params: { leadId, ...rest },
        });
        return JSON.stringify(result);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'generateCallSummary',
    description: 'Generate an AI call summary for a call.',
    inputSchema: {
      type: 'object',
      properties: {
        callId: { type: 'integer', description: 'Call ID' },
      },
      required: ['callId'],
    },
    handler: async (args, config) => {
      try {
        const clean = stripMeta(args);
        const result = await loftyRequest('POST', '/v2.0/ai/call-summary/generate', {
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
    name: 'listLeadAnalysis',
    description: 'List AI lead analysis entries for a lead.',
    inputSchema: {
      type: 'object',
      properties: {
        leadId: { type: 'integer', description: 'Lead ID' },
      },
      required: ['leadId'],
    },
    handler: async (args, config) => {
      try {
        const { leadId, ...rest } = stripMeta(args);
        const result = await loftyRequest('GET', '/v2.0/ai/lead-analysis', {
          config,
          params: { leadId, ...rest },
        });
        return JSON.stringify(result);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'createLeadAnalysis',
    description: 'Create an AI lead analysis for a lead.',
    inputSchema: {
      type: 'object',
      properties: {
        leadId: { type: 'integer', description: 'Lead ID' },
      },
      required: ['leadId'],
    },
    handler: async (args, config) => {
      try {
        const clean = stripMeta(args);
        const result = await loftyRequest('POST', '/v2.0/ai/lead-analysis', {
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
    name: 'generatePrepareInsight',
    description: 'Generate AI prepare insight for a lead.',
    inputSchema: {
      type: 'object',
      properties: {
        leadId: { type: 'integer', description: 'Lead ID' },
      },
      required: ['leadId'],
    },
    handler: async (args, config) => {
      try {
        const clean = stripMeta(args);
        const result = await loftyRequest('POST', '/v2.0/ai/prepare-insight', {
          config,
          body: clean,
        });
        return JSON.stringify(result);
      } catch (e) {
        return formatError(e);
      }
    },
  },
];
