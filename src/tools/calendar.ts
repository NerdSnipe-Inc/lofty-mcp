import { type ToolDef, loftyRequest, formatError, stripMeta } from '../client.js';

export const calendarTools: ToolDef[] = [
  {
    name: 'queryCalendars',
    description: 'Query calendar items for a lead (v2 API). Requires leadId.',
    inputSchema: {
      type: 'object',
      properties: {
        leadId: { type: 'integer', description: 'Lead ID' },
        offset: { type: 'integer', description: 'Pagination offset' },
        limit: { type: 'integer', description: 'Page size' },
        timeZoneCode: { type: 'string', description: 'IANA time zone code, e.g. America/New_York' },
      },
      required: ['leadId'],
    },
    handler: async (args, config) => {
      try {
        const clean = stripMeta(args);
        const data = await loftyRequest('GET', '/v2.0/calendar', { config, params: clean });
        return JSON.stringify(data, null, 2);
      } catch (e) { return formatError(e); }
    },
  },

  {
    name: 'createCalendar',
    description: 'Create a calendar item (v2 API). type: TASK | APPOINTMENT. For TASK provide taskWay and assignedRole; for APPOINTMENT provide address.',
    inputSchema: {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['TASK', 'APPOINTMENT'], description: 'Calendar item type' },
        content: { type: 'string', description: 'Description' },
        leadId: { type: 'integer', description: 'Lead ID' },
        timeZoneCode: { type: 'string', description: 'IANA time zone code' },
        startAt: { type: 'string', description: 'Start time (ISO 8601)' },
        endAt: { type: 'string', description: 'End time (ISO 8601)' },
        startAtMs: { type: 'integer', description: 'Start time as ms epoch' },
        endAtMs: { type: 'integer', description: 'End time as ms epoch' },
        taskWay: { type: 'string', enum: ['Call', 'Email', 'Text', 'Other'], description: 'Task method (TASK only)' },
        assignedRole: { type: 'string', enum: ['Agent', 'Assistant'], description: 'Assigned role (TASK only)' },
        address: { type: 'string', description: 'Location address (APPOINTMENT only)' },
      },
      required: ['type', 'content', 'leadId', 'timeZoneCode'],
    },
    handler: async (args, config) => {
      try {
        const clean = stripMeta(args);
        const data = await loftyRequest('POST', '/v2.0/calendar', { config, body: clean });
        return JSON.stringify(data, null, 2);
      } catch (e) { return formatError(e); }
    },
  },

  {
    name: 'updateCalendar',
    description: 'Update a calendar item by ID (v2 API). Calendar IDs are composite strings like "563172-task" or "563172-appointment".',
    inputSchema: {
      type: 'object',
      properties: {
        calendarId: { type: 'string', description: 'Composite calendar ID, e.g. "563172-task" or "563172-appointment"' },
        content: { type: 'string', description: 'Description' },
        startAt: { type: 'string', description: 'Start time (ISO 8601)' },
        endAt: { type: 'string', description: 'End time (ISO 8601)' },
        startAtMs: { type: 'integer', description: 'Start time as ms epoch' },
        endAtMs: { type: 'integer', description: 'End time as ms epoch' },
        timeZoneCode: { type: 'string', description: 'IANA time zone code' },
        reminderType: { type: 'string', description: 'Reminder type' },
        reminderTime: { type: 'integer', description: 'Reminder time offset in minutes' },
        leadId: { type: 'integer', description: 'Lead ID' },
        address: { type: 'string', description: 'Location address' },
      },
      required: ['calendarId'],
    },
    handler: async (args, config) => {
      try {
        const { calendarId, ...body } = stripMeta(args);
        const data = await loftyRequest('PUT', `/v2.0/calendar/${calendarId}`, { config, body });
        return JSON.stringify(data, null, 2);
      } catch (e) { return formatError(e); }
    },
  },

  {
    name: 'deleteCalendar',
    description: 'Delete a calendar item by ID (v2 API). Calendar IDs are composite strings like "563172-task" or "563172-appointment".',
    inputSchema: {
      type: 'object',
      properties: {
        calendarId: { type: 'string', description: 'Composite calendar ID, e.g. "563172-task" or "563172-appointment"' },
      },
      required: ['calendarId'],
    },
    handler: async (args, config) => {
      try {
        const { calendarId } = stripMeta(args);
        const data = await loftyRequest('DELETE', `/v2.0/calendar/${calendarId}`, { config });
        return JSON.stringify(data, null, 2);
      } catch (e) { return formatError(e); }
    },
  },

  {
    name: 'finishCalendar',
    description: 'Mark a calendar item as finished (v2 API). Calendar IDs are composite strings like "563172-task" or "563172-appointment".',
    inputSchema: {
      type: 'object',
      properties: {
        calendarId: { type: 'string', description: 'Composite calendar ID, e.g. "563172-task" or "563172-appointment"' },
      },
      required: ['calendarId'],
    },
    handler: async (args, config) => {
      try {
        const { calendarId } = stripMeta(args);
        const data = await loftyRequest('POST', `/v2.0/calendar/${calendarId}/finish`, { config });
        return JSON.stringify(data, null, 2);
      } catch (e) { return formatError(e); }
    },
  },

  {
    name: 'unfinishCalendar',
    description: 'Reopen a finished calendar item (v2 API). Calendar IDs are composite strings like "563172-task" or "563172-appointment".',
    inputSchema: {
      type: 'object',
      properties: {
        calendarId: { type: 'string', description: 'Composite calendar ID, e.g. "563172-task" or "563172-appointment"' },
      },
      required: ['calendarId'],
    },
    handler: async (args, config) => {
      try {
        const { calendarId } = stripMeta(args);
        const data = await loftyRequest('POST', `/v2.0/calendar/${calendarId}/unfinish`, { config });
        return JSON.stringify(data, null, 2);
      } catch (e) { return formatError(e); }
    },
  },

  {
    name: 'getAvailableMeetings',
    description: 'Get available meeting slots for a lead (v2 API). Requires leadId.',
    inputSchema: {
      type: 'object',
      properties: {
        leadId: { type: 'integer', description: 'Lead ID' },
        startAt: { type: 'string', description: 'Range start (ISO 8601)' },
        endAt: { type: 'string', description: 'Range end (ISO 8601)' },
        timeZoneCode: { type: 'string', description: 'IANA time zone code' },
      },
      required: ['leadId'],
    },
    handler: async (args, config) => {
      try {
        const clean = stripMeta(args);
        const data = await loftyRequest('GET', '/v2.0/calendar/meetings/available', { config, params: clean });
        return JSON.stringify(data, null, 2);
      } catch (e) { return formatError(e); }
    },
  },
];
