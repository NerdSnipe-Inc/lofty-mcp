import { loftyRequest, formatError, stripMeta } from '../client.js';
import type { LoftyConfig, ToolDef } from '../client.js';

/** Shared LeadTransaction fields used by addTransaction and updateTransaction. */
const leadTransactionFields = {
  transactionName: { type: 'string', description: 'Transaction name' },
  transactionType: { type: 'string', description: 'Transaction type (e.g. Buy, Sell)' },
  homePrice: { type: 'number', description: 'Home price' },
  transactionStatus: { type: 'string', description: 'Transaction status' },
  expectedCloseDate: { type: 'integer', description: 'Expected close date in ms epoch' },
  closeDate: { type: 'integer', description: 'Actual close date in ms epoch' },
  commissionRate: { type: 'number', description: 'Commission rate (percentage)' },
  gci: { type: 'number', description: 'Gross commission income' },
  teamRevenue: { type: 'number', description: 'Team revenue share' },
  agentRevenue: { type: 'number', description: 'Agent revenue share' },
  assignedAgent: { type: 'integer', description: 'Assigned agent user ID' },
};

export const transactionsTools: ToolDef[] = [
  // ── list / CRUD on lead transactions ────────────────────────────────────────
  {
    name: 'listLeadTransactions',
    description: 'List all transactions for a lead.',
    inputSchema: {
      type: 'object',
      properties: {
        leadId: { type: 'integer', description: 'ID of the lead (required)' },
      },
      required: ['leadId'],
    },
    handler: async (args: Record<string, unknown>, config: LoftyConfig): Promise<string> => {
      try {
        const { leadId } = stripMeta(args);
        const data = await loftyRequest('GET', `/v1.0/leads/${leadId}/transactions`, { config });
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'addTransaction',
    description: 'Add a new transaction to a lead.',
    inputSchema: {
      type: 'object',
      properties: {
        leadId: { type: 'integer', description: 'ID of the lead (required)' },
        ...leadTransactionFields,
      },
      required: ['leadId', 'transactionName'],
    },
    handler: async (args: Record<string, unknown>, config: LoftyConfig): Promise<string> => {
      try {
        const { leadId, ...rest } = stripMeta(args);
        const data = await loftyRequest('POST', `/v1.0/leads/${leadId}/transaction`, {
          config,
          body: rest,
        });
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'getTransaction',
    description: 'Get a specific transaction for a lead.',
    inputSchema: {
      type: 'object',
      properties: {
        leadId: { type: 'integer', description: 'ID of the lead (required)' },
        transactionId: { type: 'integer', description: 'ID of the transaction (required)' },
      },
      required: ['leadId', 'transactionId'],
    },
    handler: async (args: Record<string, unknown>, config: LoftyConfig): Promise<string> => {
      try {
        const { leadId, transactionId } = stripMeta(args);
        const data = await loftyRequest(
          'GET',
          `/v1.0/leads/${leadId}/transaction/${transactionId}`,
          { config },
        );
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'updateTransaction',
    description: 'Update an existing transaction for a lead.',
    inputSchema: {
      type: 'object',
      properties: {
        leadId: { type: 'integer', description: 'ID of the lead (required)' },
        transactionId: { type: 'integer', description: 'ID of the transaction (required)' },
        ...leadTransactionFields,
      },
      required: ['leadId', 'transactionId'],
    },
    handler: async (args: Record<string, unknown>, config: LoftyConfig): Promise<string> => {
      try {
        const { leadId, transactionId, ...rest } = stripMeta(args);
        const data = await loftyRequest(
          'PUT',
          `/v1.0/leads/${leadId}/transaction/${transactionId}`,
          { config, body: rest },
        );
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  // ── property address ──────────────────────────────────────────────────────────
  {
    name: 'getTransactionPropertyAddress',
    description: 'Get the property address for a specific transaction.',
    inputSchema: {
      type: 'object',
      properties: {
        leadId: { type: 'integer', description: 'ID of the lead (required)' },
        transactionId: { type: 'integer', description: 'ID of the transaction (required)' },
      },
      required: ['leadId', 'transactionId'],
    },
    handler: async (args: Record<string, unknown>, config: LoftyConfig): Promise<string> => {
      try {
        const { leadId, transactionId } = stripMeta(args);
        const data = await loftyRequest(
          'GET',
          `/v1.0/leads/${leadId}/transaction/${transactionId}/property/address`,
          { config },
        );
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'updateTransactionPropertyAddress',
    description: 'Update the property address for a transaction.',
    inputSchema: {
      type: 'object',
      properties: {
        leadId: { type: 'integer', description: 'ID of the lead (required)' },
        street: { type: 'string', description: 'Street address' },
        city: { type: 'string', description: 'City' },
        state: { type: 'string', description: 'State code' },
        zip: { type: 'string', description: 'ZIP / postal code' },
      },
      required: ['leadId'],
    },
    handler: async (args: Record<string, unknown>, config: LoftyConfig): Promise<string> => {
      try {
        const { leadId, ...rest } = stripMeta(args);
        const data = await loftyRequest(
          'POST',
          `/v1.0/leads/${leadId}/transaction/property/address`,
          { config, body: rest },
        );
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  // ── custom fields ─────────────────────────────────────────────────────────────
  {
    name: 'getTransactionCustomFields',
    description: 'Get the list of custom fields defined for transactions.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    handler: async (args: Record<string, unknown>, config: LoftyConfig): Promise<string> => {
      try {
        const data = await loftyRequest('GET', '/v1.0/transaction/customfields', { config });
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  // ── v2 search ─────────────────────────────────────────────────────────────────
  {
    name: 'searchTransactionsV2',
    description: 'Search transactions with optional filters (v2 endpoint).',
    inputSchema: {
      type: 'object',
      properties: {
        leadId: { type: 'integer', description: 'Filter by lead ID' },
        agentId: { type: 'integer', description: 'Filter by agent ID' },
        transactionType: { type: 'string', description: 'Filter by transaction type' },
        status: { type: 'string', description: 'Filter by transaction status' },
        offset: { type: 'integer', description: 'Pagination offset' },
        limit: { type: 'integer', description: 'Max number of results to return' },
      },
    },
    handler: async (args: Record<string, unknown>, config: LoftyConfig): Promise<string> => {
      try {
        const params = stripMeta(args);
        const data = await loftyRequest('GET', '/v2.0/transactions', { config, params });
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  // ── brokermint ────────────────────────────────────────────────────────────────
  {
    name: 'updateBrokermintTransaction',
    description: 'Update a Brokermint transaction (callback format — body passed through as-is).',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: true,
    },
    handler: async (args: Record<string, unknown>, config: LoftyConfig): Promise<string> => {
      try {
        const body = stripMeta(args);
        const data = await loftyRequest('PUT', '/v1.0/brokermint/transaction', { config, body });
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return formatError(e);
      }
    },
  },
];
