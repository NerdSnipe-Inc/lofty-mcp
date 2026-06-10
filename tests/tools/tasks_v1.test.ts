import { describe, it, expect, beforeEach } from 'vitest';
import {
  TEST_CONFIG,
  mockFetchSuccess,
  mockFetchError,
  parseLastFetchCall,
  expectError,
  MOCK_DATA,
} from '../helpers.js';
import { tasksV1Tools } from '../../src/tools/tasks_v1.js';

function getTool(name: string) {
  const tool = tasksV1Tools.find((t) => t.name === name);
  if (!tool) throw new Error(`Tool "${name}" not found`);
  return tool;
}

describe('tasks_v1 tools', () => {
  describe('listTasksV1', () => {
    it('GET /v1.0/tasks with leadId query param', async () => {
      const fetch = mockFetchSuccess([MOCK_DATA]);
      const tool = getTool('listTasksV1');
      const result = await tool.handler({ leadId: 42 }, TEST_CONFIG);
      const call = parseLastFetchCall(fetch);
      expect(call.method).toBe('GET');
      expect(call.pathname).toBe('/v1.0/tasks');
      expect(call.params.leadId).toBe('42');
      expect(call.body).toBeUndefined();
      expect(JSON.parse(result)).toEqual([MOCK_DATA]);
    });

    it('returns error on 404', async () => {
      mockFetchError(404);
      const tool = getTool('listTasksV1');
      const result = await tool.handler({ leadId: 99 }, TEST_CONFIG);
      expectError(result, 404);
    });
  });

  describe('getTaskV1', () => {
    it('GET /v1.0/tasks/{taskId}', async () => {
      const fetch = mockFetchSuccess(MOCK_DATA);
      const tool = getTool('getTaskV1');
      const result = await tool.handler({ taskId: 7 }, TEST_CONFIG);
      const call = parseLastFetchCall(fetch);
      expect(call.method).toBe('GET');
      expect(call.pathname).toBe('/v1.0/tasks/7');
      expect(call.body).toBeUndefined();
      expect(JSON.parse(result)).toEqual(MOCK_DATA);
    });

    it('returns error on 404', async () => {
      mockFetchError(404);
      const tool = getTool('getTaskV1');
      const result = await tool.handler({ taskId: 999 }, TEST_CONFIG);
      expectError(result, 404);
    });
  });

  describe('createTaskV1', () => {
    it('POST /v1.0/tasks with body', async () => {
      const fetch = mockFetchSuccess(MOCK_DATA);
      const tool = getTool('createTaskV1');
      const payload = {
        content: 'Call client',
        leadId: 5,
        deadline: 1700000000000,
        type: 'Call',
        assignedRole: 'Agent',
      };
      const result = await tool.handler(payload, TEST_CONFIG);
      const call = parseLastFetchCall(fetch);
      expect(call.method).toBe('POST');
      expect(call.pathname).toBe('/v1.0/tasks');
      expect(call.body).toMatchObject(payload);
      expect(JSON.parse(result)).toEqual(MOCK_DATA);
    });

    it('sends optional finishFlag when provided', async () => {
      const fetch = mockFetchSuccess(MOCK_DATA);
      const tool = getTool('createTaskV1');
      await tool.handler(
        { content: 'x', leadId: 1, deadline: 1000, type: 'Other', assignedRole: 'Assistant', finishFlag: true },
        TEST_CONFIG,
      );
      const call = parseLastFetchCall(fetch);
      expect(call.body?.finishFlag).toBe(true);
    });

    it('returns error on 400', async () => {
      mockFetchError(400);
      const tool = getTool('createTaskV1');
      const result = await tool.handler({ content: '', leadId: 0, deadline: 0, type: 'Other', assignedRole: 'Agent' }, TEST_CONFIG);
      expectError(result, 400);
    });
  });

  describe('updateTaskV1', () => {
    it('PUT /v1.0/tasks/{taskId} with body', async () => {
      const fetch = mockFetchSuccess(MOCK_DATA);
      const tool = getTool('updateTaskV1');
      const result = await tool.handler(
        { taskId: 3, content: 'Updated', leadId: 5, deadline: 1700000000000, type: 'Email', assignedRole: 'Agent' },
        TEST_CONFIG,
      );
      const call = parseLastFetchCall(fetch);
      expect(call.method).toBe('PUT');
      expect(call.pathname).toBe('/v1.0/tasks/3');
      expect(call.body?.content).toBe('Updated');
      expect(call.body?.taskId).toBeUndefined();
      expect(JSON.parse(result)).toEqual(MOCK_DATA);
    });

    it('returns error on 404', async () => {
      mockFetchError(404);
      const tool = getTool('updateTaskV1');
      const result = await tool.handler({ taskId: 999, content: 'x', leadId: 1, deadline: 0, type: 'Other', assignedRole: 'Agent' }, TEST_CONFIG);
      expectError(result, 404);
    });
  });

  describe('deleteTaskV1', () => {
    it('DELETE /v1.0/tasks/{taskId}', async () => {
      const fetch = mockFetchSuccess({});
      const tool = getTool('deleteTaskV1');
      const result = await tool.handler({ taskId: 8 }, TEST_CONFIG);
      const call = parseLastFetchCall(fetch);
      expect(call.method).toBe('DELETE');
      expect(call.pathname).toBe('/v1.0/tasks/8');
      expect(call.body).toBeUndefined();
      expect(JSON.parse(result)).toEqual({});
    });

    it('returns error on 404', async () => {
      mockFetchError(404);
      const tool = getTool('deleteTaskV1');
      const result = await tool.handler({ taskId: 999 }, TEST_CONFIG);
      expectError(result, 404);
    });
  });

  describe('listAppointments', () => {
    it('GET /v1.0/appts with leadId query param', async () => {
      const fetch = mockFetchSuccess([MOCK_DATA]);
      const tool = getTool('listAppointments');
      const result = await tool.handler({ leadId: 10 }, TEST_CONFIG);
      const call = parseLastFetchCall(fetch);
      expect(call.method).toBe('GET');
      expect(call.pathname).toBe('/v1.0/appts');
      expect(call.params.leadId).toBe('10');
      expect(call.body).toBeUndefined();
      expect(JSON.parse(result)).toEqual([MOCK_DATA]);
    });

    it('returns error on 401', async () => {
      mockFetchError(401);
      const tool = getTool('listAppointments');
      const result = await tool.handler({ leadId: 1 }, TEST_CONFIG);
      expectError(result, 401);
    });
  });

  it('exports exactly 6 tools', () => {
    expect(tasksV1Tools).toHaveLength(6);
  });
});
