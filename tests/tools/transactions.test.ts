import { describe, it, expect, beforeEach } from 'vitest';
import {
  TEST_CONFIG,
  mockFetchSuccess,
  mockFetchError,
  parseLastFetchCall,
  expectError,
  MOCK_DATA,
} from '../helpers.js';
import { transactionsTools } from '../../src/tools/transactions.js';

function getTool(name: string) {
  const tool = transactionsTools.find((t) => t.name === name);
  if (!tool) throw new Error(`Tool "${name}" not found`);
  return tool;
}

describe('transactions tools', () => {
  beforeEach(() => {
    mockFetchSuccess(MOCK_DATA);
  });

  // ── listLeadTransactions ───────────────────────────────────────────────────
  describe('listLeadTransactions', () => {
    it('GET /v1.0/leads/{leadId}/transactions', async () => {
      const fetch = mockFetchSuccess({ items: [] });
      await getTool('listLeadTransactions').handler({ leadId: 10 }, TEST_CONFIG);
      const call = parseLastFetchCall(fetch);
      expect(call.method).toBe('GET');
      expect(call.pathname).toBe('/v1.0/leads/10/transactions');
      expect(call.body).toBeUndefined();
    });

    it('does not forward leadId as query param', async () => {
      const fetch = mockFetchSuccess({ items: [] });
      await getTool('listLeadTransactions').handler({ leadId: 10 }, TEST_CONFIG);
      const call = parseLastFetchCall(fetch);
      expect(call.params.leadId).toBeUndefined();
    });

    it('returns error on 404', async () => {
      mockFetchError(404);
      const result = await getTool('listLeadTransactions').handler({ leadId: 99 }, TEST_CONFIG);
      expectError(result, 404);
    });
  });

  // ── addTransaction ─────────────────────────────────────────────────────────
  describe('addTransaction', () => {
    it('POST /v1.0/leads/{leadId}/transaction with body', async () => {
      const fetch = mockFetchSuccess(MOCK_DATA);
      await getTool('addTransaction').handler(
        { leadId: 5, transactionName: 'Buy 123 Main St', transactionType: 'Buy', homePrice: 450000 },
        TEST_CONFIG,
      );
      const call = parseLastFetchCall(fetch);
      expect(call.method).toBe('POST');
      expect(call.pathname).toBe('/v1.0/leads/5/transaction');
      expect(call.body?.transactionName).toBe('Buy 123 Main St');
      expect(call.body?.homePrice).toBe(450000);
      expect(call.body?.leadId).toBeUndefined();
    });

    it('forwards all LeadTransaction fields', async () => {
      const fetch = mockFetchSuccess(MOCK_DATA);
      await getTool('addTransaction').handler(
        {
          leadId: 6,
          transactionName: 'Sell 456 Oak Ave',
          transactionType: 'Sell',
          transactionStatus: 'Active',
          expectedCloseDate: 1700000000000,
          closeDate: 1701000000000,
          commissionRate: 2.5,
          gci: 11250,
          teamRevenue: 8000,
          agentRevenue: 3250,
          assignedAgent: 99,
        },
        TEST_CONFIG,
      );
      const call = parseLastFetchCall(fetch);
      expect(call.body?.commissionRate).toBe(2.5);
      expect(call.body?.assignedAgent).toBe(99);
      expect(call.body?.leadId).toBeUndefined();
    });

    it('returns error on 422', async () => {
      mockFetchError(422);
      const result = await getTool('addTransaction').handler({ leadId: 1, transactionName: '' }, TEST_CONFIG);
      expectError(result, 422);
    });
  });

  // ── getTransaction ─────────────────────────────────────────────────────────
  describe('getTransaction', () => {
    it('GET /v1.0/leads/{leadId}/transaction/{transactionId}', async () => {
      const fetch = mockFetchSuccess(MOCK_DATA);
      await getTool('getTransaction').handler({ leadId: 5, transactionId: 99 }, TEST_CONFIG);
      const call = parseLastFetchCall(fetch);
      expect(call.method).toBe('GET');
      expect(call.pathname).toBe('/v1.0/leads/5/transaction/99');
      expect(call.body).toBeUndefined();
    });

    it('does not forward path params as query params', async () => {
      const fetch = mockFetchSuccess(MOCK_DATA);
      await getTool('getTransaction').handler({ leadId: 5, transactionId: 99 }, TEST_CONFIG);
      const call = parseLastFetchCall(fetch);
      expect(call.params.leadId).toBeUndefined();
      expect(call.params.transactionId).toBeUndefined();
    });

    it('returns error on 404', async () => {
      mockFetchError(404);
      const result = await getTool('getTransaction').handler({ leadId: 1, transactionId: 999 }, TEST_CONFIG);
      expectError(result, 404);
    });
  });

  // ── updateTransaction ──────────────────────────────────────────────────────
  describe('updateTransaction', () => {
    it('PUT /v1.0/leads/{leadId}/transaction/{transactionId}', async () => {
      const fetch = mockFetchSuccess(MOCK_DATA);
      await getTool('updateTransaction').handler(
        { leadId: 5, transactionId: 99, transactionName: 'Updated Name', homePrice: 500000 },
        TEST_CONFIG,
      );
      const call = parseLastFetchCall(fetch);
      expect(call.method).toBe('PUT');
      expect(call.pathname).toBe('/v1.0/leads/5/transaction/99');
      expect(call.body?.transactionName).toBe('Updated Name');
      expect(call.body?.homePrice).toBe(500000);
      expect(call.body?.leadId).toBeUndefined();
      expect(call.body?.transactionId).toBeUndefined();
    });

    it('returns error on 404', async () => {
      mockFetchError(404);
      const result = await getTool('updateTransaction').handler({ leadId: 1, transactionId: 999 }, TEST_CONFIG);
      expectError(result, 404);
    });
  });

  // ── getTransactionPropertyAddress ─────────────────────────────────────────
  describe('getTransactionPropertyAddress', () => {
    it('GET /v1.0/leads/{leadId}/transaction/{transactionId}/property/address', async () => {
      const fetch = mockFetchSuccess({ address: '123 Main St' });
      await getTool('getTransactionPropertyAddress').handler({ leadId: 5, transactionId: 99 }, TEST_CONFIG);
      const call = parseLastFetchCall(fetch);
      expect(call.method).toBe('GET');
      expect(call.pathname).toBe('/v1.0/leads/5/transaction/99/property/address');
      expect(call.body).toBeUndefined();
    });

    it('returns error on 404', async () => {
      mockFetchError(404);
      const result = await getTool('getTransactionPropertyAddress').handler({ leadId: 1, transactionId: 999 }, TEST_CONFIG);
      expectError(result, 404);
    });
  });

  // ── updateTransactionPropertyAddress ──────────────────────────────────────
  describe('updateTransactionPropertyAddress', () => {
    it('POST /v1.0/leads/{leadId}/transaction/property/address', async () => {
      const fetch = mockFetchSuccess({});
      await getTool('updateTransactionPropertyAddress').handler(
        { leadId: 5, street: '456 Oak Ave', city: 'Austin', state: 'TX', zip: '78701' },
        TEST_CONFIG,
      );
      const call = parseLastFetchCall(fetch);
      expect(call.method).toBe('POST');
      expect(call.pathname).toBe('/v1.0/leads/5/transaction/property/address');
      expect(call.body?.street).toBe('456 Oak Ave');
      expect(call.body?.city).toBe('Austin');
      expect(call.body?.leadId).toBeUndefined();
    });

    it('returns error on 400', async () => {
      mockFetchError(400);
      const result = await getTool('updateTransactionPropertyAddress').handler({ leadId: 1 }, TEST_CONFIG);
      expectError(result, 400);
    });
  });

  // ── getTransactionCustomFields ─────────────────────────────────────────────
  describe('getTransactionCustomFields', () => {
    it('GET /v1.0/transaction/customfields', async () => {
      const fetch = mockFetchSuccess({ fields: [] });
      await getTool('getTransactionCustomFields').handler({}, TEST_CONFIG);
      const call = parseLastFetchCall(fetch);
      expect(call.method).toBe('GET');
      expect(call.pathname).toBe('/v1.0/transaction/customfields');
      expect(call.body).toBeUndefined();
    });

    it('returns error on 401', async () => {
      mockFetchError(401);
      const result = await getTool('getTransactionCustomFields').handler({}, TEST_CONFIG);
      expectError(result, 401);
    });
  });

  // ── searchTransactionsV2 ───────────────────────────────────────────────────
  describe('searchTransactionsV2', () => {
    it('GET /v2.0/transactions with query params', async () => {
      const fetch = mockFetchSuccess({ items: [] });
      await getTool('searchTransactionsV2').handler(
        { leadId: 10, agentId: 5, transactionType: 'Buy', status: 'Active', offset: 0, limit: 20 },
        TEST_CONFIG,
      );
      const call = parseLastFetchCall(fetch);
      expect(call.method).toBe('GET');
      expect(call.pathname).toBe('/v2.0/transactions');
      expect(call.params.leadId).toBe('10');
      expect(call.params.agentId).toBe('5');
      expect(call.params.transactionType).toBe('Buy');
      expect(call.params.status).toBe('Active');
      expect(call.body).toBeUndefined();
    });

    it('works with no query params', async () => {
      const fetch = mockFetchSuccess({ items: [] });
      await getTool('searchTransactionsV2').handler({}, TEST_CONFIG);
      const call = parseLastFetchCall(fetch);
      expect(call.method).toBe('GET');
      expect(call.pathname).toBe('/v2.0/transactions');
    });

    it('returns error on 500', async () => {
      mockFetchError(500);
      const result = await getTool('searchTransactionsV2').handler({}, TEST_CONFIG);
      expectError(result, 500);
    });
  });

  // ── updateBrokermintTransaction ────────────────────────────────────────────
  describe('updateBrokermintTransaction', () => {
    it('PUT /v1.0/brokermint/transaction with body pass-through', async () => {
      const fetch = mockFetchSuccess({});
      const payload = { transactionId: 'bm-999', status: 'closed', commissionAmount: 12000 };
      await getTool('updateBrokermintTransaction').handler(payload, TEST_CONFIG);
      const call = parseLastFetchCall(fetch);
      expect(call.method).toBe('PUT');
      expect(call.pathname).toBe('/v1.0/brokermint/transaction');
      expect(call.body?.transactionId).toBe('bm-999');
      expect(call.body?.status).toBe('closed');
      expect(call.body?.commissionAmount).toBe(12000);
    });

    it('returns error on 400', async () => {
      mockFetchError(400);
      const result = await getTool('updateBrokermintTransaction').handler({}, TEST_CONFIG);
      expectError(result, 400);
    });
  });

  // ── auth & meta ────────────────────────────────────────────────────────────
  it('sends Bearer auth header', async () => {
    const fetch = mockFetchSuccess({ fields: [] });
    await getTool('getTransactionCustomFields').handler({}, TEST_CONFIG);
    const call = parseLastFetchCall(fetch);
    expect(call.headers['Authorization']).toBe('Bearer test-bearer-token-abc123');
  });

  it('strips MCP meta keys', async () => {
    const fetch = mockFetchSuccess({ items: [] });
    await getTool('searchTransactionsV2').handler({ _meta: 'x', __mcp: 'y' }, TEST_CONFIG);
    const call = parseLastFetchCall(fetch);
    expect(call.params._meta).toBeUndefined();
    expect(call.params.__mcp).toBeUndefined();
  });

  it('exports exactly 9 tools', () => {
    expect(transactionsTools).toHaveLength(9);
  });
});
