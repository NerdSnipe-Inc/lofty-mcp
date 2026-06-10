import { type ToolDef, loftyRequest, formatError, stripMeta } from '../client.js';

export const tasksV1Tools: ToolDef[] = [
  {
    name: 'listTasksV1',
    description: 'List tasks for a lead (v1 API). Requires leadId.',
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
        const data = await loftyRequest('GET', '/v1.0/tasks', { config, params: clean });
        return JSON.stringify(data, null, 2);
      } catch (e) { return formatError(e); }
    },
  },

  {
    name: 'getTaskV1',
    description: 'Get a single task by ID (v1 API).',
    inputSchema: {
      type: 'object',
      properties: {
        taskId: { type: 'integer', description: 'Task ID' },
      },
      required: ['taskId'],
    },
    handler: async (args, config) => {
      try {
        const { taskId, ...rest } = stripMeta(args);
        const data = await loftyRequest('GET', `/v1.0/tasks/${taskId}`, { config });
        void rest;
        return JSON.stringify(data, null, 2);
      } catch (e) { return formatError(e); }
    },
  },

  {
    name: 'createTaskV1',
    description: 'Create a task (v1 API). Type: Other | Call | Email | Text. AssignedRole: Agent | Assistant.',
    inputSchema: {
      type: 'object',
      properties: {
        content: { type: 'string', description: 'Task description' },
        leadId: { type: 'integer', description: 'Lead ID' },
        deadline: { type: 'integer', description: 'Deadline as ms epoch timestamp' },
        type: { type: 'string', enum: ['Other', 'Call', 'Email', 'Text'], description: 'Task type' },
        assignedRole: { type: 'string', enum: ['Agent', 'Assistant'], description: 'Assigned role' },
        finishFlag: { type: 'boolean', description: 'Mark task as finished on create' },
      },
      required: ['content', 'leadId', 'deadline', 'type', 'assignedRole'],
    },
    handler: async (args, config) => {
      try {
        const clean = stripMeta(args);
        const data = await loftyRequest('POST', '/v1.0/tasks', { config, body: clean });
        return JSON.stringify(data, null, 2);
      } catch (e) { return formatError(e); }
    },
  },

  {
    name: 'updateTaskV1',
    description: 'Update a task by ID (v1 API). Type: Other | Call | Email | Text. AssignedRole: Agent | Assistant.',
    inputSchema: {
      type: 'object',
      properties: {
        taskId: { type: 'integer', description: 'Task ID to update' },
        content: { type: 'string', description: 'Task description' },
        leadId: { type: 'integer', description: 'Lead ID' },
        deadline: { type: 'integer', description: 'Deadline as ms epoch timestamp' },
        type: { type: 'string', enum: ['Other', 'Call', 'Email', 'Text'], description: 'Task type' },
        assignedRole: { type: 'string', enum: ['Agent', 'Assistant'], description: 'Assigned role' },
        finishFlag: { type: 'boolean', description: 'Mark task as finished' },
      },
      required: ['taskId', 'content', 'leadId', 'deadline', 'type', 'assignedRole'],
    },
    handler: async (args, config) => {
      try {
        const { taskId, ...body } = stripMeta(args);
        const data = await loftyRequest('PUT', `/v1.0/tasks/${taskId}`, { config, body });
        return JSON.stringify(data, null, 2);
      } catch (e) { return formatError(e); }
    },
  },

  {
    name: 'deleteTaskV1',
    description: 'Delete a task by ID (v1 API).',
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
        const data = await loftyRequest('DELETE', `/v1.0/tasks/${taskId}`, { config });
        return JSON.stringify(data, null, 2);
      } catch (e) { return formatError(e); }
    },
  },

  {
    name: 'listAppointments',
    description: 'List appointments for a lead (v1 API). Requires leadId.',
    inputSchema: {
      type: 'object',
      properties: {
        leadId: { type: 'integer', description: 'Lead ID to fetch appointments for' },
      },
      required: ['leadId'],
    },
    handler: async (args, config) => {
      try {
        const clean = stripMeta(args);
        const data = await loftyRequest('GET', '/v1.0/appts', { config, params: clean });
        return JSON.stringify(data, null, 2);
      } catch (e) { return formatError(e); }
    },
  },
];
