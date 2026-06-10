import { describe, it, expect } from 'vitest';
import {
  TEST_CONFIG,
  mockFetchSuccess,
  mockFetchError,
  parseLastFetchCall,
  expectError,
  MOCK_DATA,
} from '../helpers.js';
import { tasksV2Tools } from '../../src/tools/tasks_v2.js';

function getTool(name: string) {
  const tool = tasksV2Tools.find((t) => t.name === name);
  if (!tool) throw new Error(`Tool "${name}" not found`);
  return tool;
}

describe('tasks_v2 tools', () => {
  describe('listTasksV2', () => {
    it('GET /v2.0/tasks with leadId query param', async () => {
      const fetch = mockFetchSuccess([MOCK_DATA]);
      const tool = getTool('listTasksV2');
      const result = await tool.handler({ leadId: 42 }, TEST_CONFIG);
      const call = parseLastFetchCall(fetch);
      expect(call.method).toBe('GET');
      expect(call.pathname).toBe('/v2.0/tasks');
      expect(call.params.leadId).toBe('42');
      expect(call.body).toBeUndefined();
      expect(JSON.parse(result)).toEqual([MOCK_DATA]);
    });

    it('returns error on 404', async () => {
      mockFetchError(404);
      const tool = getTool('listTasksV2');
      const result = await tool.handler({ leadId: 99 }, TEST_CONFIG);
      expectError(result, 404);
    });
  });

  describe('getTaskV2', () => {
    it('GET /v2.0/tasks/{taskId}', async () => {
      const fetch = mockFetchSuccess(MOCK_DATA);
      const tool = getTool('getTaskV2');
      const result = await tool.handler({ taskId: 7 }, TEST_CONFIG);
      const call = parseLastFetchCall(fetch);
      expect(call.method).toBe('GET');
      expect(call.pathname).toBe('/v2.0/tasks/7');
      expect(call.body).toBeUndefined();
      expect(JSON.parse(result)).toEqual(MOCK_DATA);
    });

    it('returns error on 404', async () => {
      mockFetchError(404);
      const tool = getTool('getTaskV2');
      const result = await tool.handler({ taskId: 999 }, TEST_CONFIG);
      expectError(result, 404);
    });
  });

  describe('createTaskV2', () => {
    it('POST /v2.0/tasks with body', async () => {
      const fetch = mockFetchSuccess(MOCK_DATA);
      const tool = getTool('createTaskV2');
      const payload = {
        type: 'Call',
        content: 'Follow up',
        leadId: 5,
        assignedRole: 'Agent',
        startAt: '2024-01-01T10:00:00Z',
        endAt: '2024-01-01T11:00:00Z',
      };
      const result = await tool.handler(payload, TEST_CONFIG);
      const call = parseLastFetchCall(fetch);
      expect(call.method).toBe('POST');
      expect(call.pathname).toBe('/v2.0/tasks');
      expect(call.body).toMatchObject(payload);
      expect(JSON.parse(result)).toEqual(MOCK_DATA);
    });

    it('sends address for Appointment type', async () => {
      const fetch = mockFetchSuccess(MOCK_DATA);
      const tool = getTool('createTaskV2');
      await tool.handler(
        { type: 'Appointment', content: 'Meeting', leadId: 1, address: '123 Main St' },
        TEST_CONFIG,
      );
      const call = parseLastFetchCall(fetch);
      expect(call.body?.address).toBe('123 Main St');
    });

    it('returns error on 400', async () => {
      mockFetchError(400);
      const tool = getTool('createTaskV2');
      const result = await tool.handler({ type: 'Other' }, TEST_CONFIG);
      expectError(result, 400);
    });
  });

  describe('updateTaskV2', () => {
    it('PUT /v2.0/tasks/{taskId} with body, taskId excluded from body', async () => {
      const fetch = mockFetchSuccess(MOCK_DATA);
      const tool = getTool('updateTaskV2');
      const result = await tool.handler(
        { taskId: 12, content: 'Updated content', startAt: '2024-02-01T09:00:00Z' },
        TEST_CONFIG,
      );
      const call = parseLastFetchCall(fetch);
      expect(call.method).toBe('PUT');
      expect(call.pathname).toBe('/v2.0/tasks/12');
      expect(call.body?.content).toBe('Updated content');
      expect(call.body?.taskId).toBeUndefined();
      expect(JSON.parse(result)).toEqual(MOCK_DATA);
    });

    it('returns error on 404', async () => {
      mockFetchError(404);
      const tool = getTool('updateTaskV2');
      const result = await tool.handler({ taskId: 999, content: 'x' }, TEST_CONFIG);
      expectError(result, 404);
    });
  });

  describe('deleteTaskV2', () => {
    it('DELETE /v2.0/tasks/{taskId} with no body', async () => {
      const fetch = mockFetchSuccess({});
      const tool = getTool('deleteTaskV2');
      const result = await tool.handler({ taskId: 8 }, TEST_CONFIG);
      const call = parseLastFetchCall(fetch);
      expect(call.method).toBe('DELETE');
      expect(call.pathname).toBe('/v2.0/tasks/8');
      expect(call.body).toBeUndefined();
      expect(JSON.parse(result)).toEqual({});
    });

    it('returns error on 404', async () => {
      mockFetchError(404);
      const tool = getTool('deleteTaskV2');
      const result = await tool.handler({ taskId: 999 }, TEST_CONFIG);
      expectError(result, 404);
    });
  });

  describe('finishTaskV2', () => {
    it('POST /v2.0/tasks/{taskId}/finish with no body', async () => {
      const fetch = mockFetchSuccess(MOCK_DATA);
      const tool = getTool('finishTaskV2');
      const result = await tool.handler({ taskId: 5 }, TEST_CONFIG);
      const call = parseLastFetchCall(fetch);
      expect(call.method).toBe('POST');
      expect(call.pathname).toBe('/v2.0/tasks/5/finish');
      expect(call.body).toBeUndefined();
      expect(JSON.parse(result)).toEqual(MOCK_DATA);
    });

    it('returns error on 404', async () => {
      mockFetchError(404);
      const tool = getTool('finishTaskV2');
      const result = await tool.handler({ taskId: 999 }, TEST_CONFIG);
      expectError(result, 404);
    });
  });

  describe('unfinishTaskV2', () => {
    it('POST /v2.0/tasks/{taskId}/unfinish with no body', async () => {
      const fetch = mockFetchSuccess(MOCK_DATA);
      const tool = getTool('unfinishTaskV2');
      const result = await tool.handler({ taskId: 6 }, TEST_CONFIG);
      const call = parseLastFetchCall(fetch);
      expect(call.method).toBe('POST');
      expect(call.pathname).toBe('/v2.0/tasks/6/unfinish');
      expect(call.body).toBeUndefined();
      expect(JSON.parse(result)).toEqual(MOCK_DATA);
    });

    it('returns error on 500', async () => {
      mockFetchError(500);
      const tool = getTool('unfinishTaskV2');
      const result = await tool.handler({ taskId: 1 }, TEST_CONFIG);
      expectError(result, 500);
    });
  });

  describe('listMyTasksV2', () => {
    it('GET /v2.0/tasks/my-tasks with no required params', async () => {
      const fetch = mockFetchSuccess([MOCK_DATA]);
      const tool = getTool('listMyTasksV2');
      const result = await tool.handler({}, TEST_CONFIG);
      const call = parseLastFetchCall(fetch);
      expect(call.method).toBe('GET');
      expect(call.pathname).toBe('/v2.0/tasks/my-tasks');
      expect(call.body).toBeUndefined();
      expect(JSON.parse(result)).toEqual([MOCK_DATA]);
    });

    it('returns error on 401', async () => {
      mockFetchError(401);
      const tool = getTool('listMyTasksV2');
      const result = await tool.handler({}, TEST_CONFIG);
      expectError(result, 401);
    });
  });

  it('exports exactly 8 tools', () => {
    expect(tasksV2Tools).toHaveLength(8);
  });
});
