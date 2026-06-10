import { type ToolDef, loftyRequest, formatError, stripMeta } from '../client.js';

export const tasksV2Tools: ToolDef[] = [
  {
    name: 'listTasksV2',
    description: 'List tasks for a lead (v2 API). Requires leadId.',
    inputSchema: {
      type: 'object',
      properties: {
        leadId: { type: 'integer', description: 'Lead ID to fetch tasks for' },
      },
      required: ['leadId'],
    },
    handler: async (args, config) => {
      try {
        const clean = stripMeta(args);
        const data = await loftyRequest('GET', '/v2.0/tasks', { config, params: clean });
        return JSON.stringify(data, null, 2);
      } catch (e) { return formatError(e); }
    },
  },

  {
    name: 'getTaskV2',
    description: 'Get a single task by ID (v2 API).',
    inputSchema: {
      type: 'object',
      properties: {
        taskId: { type: 'integer', description: 'Task ID' },
      },
      required: ['taskId'],
    },
    handler: async (args, config) => {
      try {
        const { taskId } = stripMeta(args);
        const data = await loftyRequest('GET', `/v2.0/tasks/${taskId}`, { config });
        return JSON.stringify(data, null, 2);
      } catch (e) { return formatError(e); }
    },
  },

  {
    name: 'createTaskV2',
    description: 'Create a task or appointment (v2 API). Type: Other | Call | Email | Text | Appointment. For Appointment type, provide address.',
    inputSchema: {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['Other', 'Call', 'Email', 'Text', 'Appointment'], description: 'Task type' },
        content: { type: 'string', description: 'Task description' },
        leadId: { type: 'integer', description: 'Lead ID' },
        assignedRole: { type: 'string', enum: ['Agent', 'Assistant'], description: 'Assigned role' },
        startAt: { type: 'string', description: 'Start time (ISO 8601)' },
        endAt: { type: 'string', description: 'End time (ISO 8601)' },
        timeZoneCode: { type: 'string', description: 'IANA time zone code, e.g. America/Chicago' },
        address: { type: 'string', description: 'Address (for Appointment type)' },
      },
      required: ['type'],
    },
    handler: async (args, config) => {
      try {
        const clean = stripMeta(args);
        const data = await loftyRequest('POST', '/v2.0/tasks', { config, body: clean });
        return JSON.stringify(data, null, 2);
      } catch (e) { return formatError(e); }
    },
  },

  {
    name: 'updateTaskV2',
    description: 'Update a task by ID (v2 API). Updatable fields: content, startAt, endAt, timeZoneCode, address.',
    inputSchema: {
      type: 'object',
      properties: {
        taskId: { type: 'integer', description: 'Task ID to update' },
        content: { type: 'string', description: 'Task description' },
        startAt: { type: 'string', description: 'Start time (ISO 8601)' },
        endAt: { type: 'string', description: 'End time (ISO 8601)' },
        timeZoneCode: { type: 'string', description: 'IANA time zone code' },
        address: { type: 'string', description: 'Address (for Appointment type)' },
      },
      required: ['taskId'],
    },
    handler: async (args, config) => {
      try {
        const { taskId, ...body } = stripMeta(args);
        const data = await loftyRequest('PUT', `/v2.0/tasks/${taskId}`, { config, body });
        return JSON.stringify(data, null, 2);
      } catch (e) { return formatError(e); }
    },
  },

  {
    name: 'deleteTaskV2',
    description: 'Delete a task by ID (v2 API).',
    inputSchema: {
      type: 'object',
      properties: {
        taskId: { type: 'integer', description: 'Task ID to delete' },
      },
      required: ['taskId'],
    },
    handler: async (args, config) => {
      try {
        const { taskId } = stripMeta(args);
        const data = await loftyRequest('DELETE', `/v2.0/tasks/${taskId}`, { config });
        return JSON.stringify(data, null, 2);
      } catch (e) { return formatError(e); }
    },
  },

  {
    name: 'finishTaskV2',
    description: 'Mark a task as finished (v2 API).',
    inputSchema: {
      type: 'object',
      properties: {
        taskId: { type: 'integer', description: 'Task ID to finish' },
      },
      required: ['taskId'],
    },
    handler: async (args, config) => {
      try {
        const { taskId } = stripMeta(args);
        const data = await loftyRequest('POST', `/v2.0/tasks/${taskId}/finish`, { config });
        return JSON.stringify(data, null, 2);
      } catch (e) { return formatError(e); }
    },
  },

  {
    name: 'unfinishTaskV2',
    description: 'Mark a finished task as unfinished / reopen it (v2 API).',
    inputSchema: {
      type: 'object',
      properties: {
        taskId: { type: 'integer', description: 'Task ID to reopen' },
      },
      required: ['taskId'],
    },
    handler: async (args, config) => {
      try {
        const { taskId } = stripMeta(args);
        const data = await loftyRequest('POST', `/v2.0/tasks/${taskId}/unfinish`, { config });
        return JSON.stringify(data, null, 2);
      } catch (e) { return formatError(e); }
    },
  },

  {
    name: 'listMyTasksV2',
    description: 'List tasks assigned to the authenticated user (v2 API). No required params.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    handler: async (args, config) => {
      try {
        const clean = stripMeta(args);
        const data = await loftyRequest('GET', '/v2.0/tasks/my-tasks', { config, params: clean });
        return JSON.stringify(data, null, 2);
      } catch (e) { return formatError(e); }
    },
  },
];
