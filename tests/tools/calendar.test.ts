import { describe, it, expect } from 'vitest';
import {
  TEST_CONFIG,
  mockFetchSuccess,
  mockFetchError,
  parseLastFetchCall,
  expectError,
  MOCK_DATA,
} from '../helpers.js';
import { calendarTools } from '../../src/tools/calendar.js';

function getTool(name: string) {
  const tool = calendarTools.find((t) => t.name === name);
  if (!tool) throw new Error(`Tool "${name}" not found`);
  return tool;
}

describe('calendar tools', () => {
  describe('queryCalendars', () => {
    it('GET /v2.0/calendar with required leadId query param', async () => {
      const fetch = mockFetchSuccess([MOCK_DATA]);
      const tool = getTool('queryCalendars');
      const result = await tool.handler({ leadId: 42 }, TEST_CONFIG);
      const call = parseLastFetchCall(fetch);
      expect(call.method).toBe('GET');
      expect(call.pathname).toBe('/v2.0/calendar');
      expect(call.params.leadId).toBe('42');
      expect(call.body).toBeUndefined();
      expect(JSON.parse(result)).toEqual([MOCK_DATA]);
    });

    it('passes optional offset, limit, timeZoneCode', async () => {
      const fetch = mockFetchSuccess([]);
      const tool = getTool('queryCalendars');
      await tool.handler({ leadId: 1, offset: 10, limit: 20, timeZoneCode: 'America/New_York' }, TEST_CONFIG);
      const call = parseLastFetchCall(fetch);
      expect(call.params.offset).toBe('10');
      expect(call.params.limit).toBe('20');
      expect(call.params.timeZoneCode).toBe('America/New_York');
    });

    it('returns error on 404', async () => {
      mockFetchError(404);
      const tool = getTool('queryCalendars');
      const result = await tool.handler({ leadId: 99 }, TEST_CONFIG);
      expectError(result, 404);
    });
  });

  describe('createCalendar', () => {
    it('POST /v2.0/calendar with body', async () => {
      const fetch = mockFetchSuccess(MOCK_DATA);
      const tool = getTool('createCalendar');
      const payload = {
        type: 'TASK',
        content: 'Follow up call',
        leadId: 5,
        timeZoneCode: 'America/Chicago',
        taskWay: 'Call',
        assignedRole: 'Agent',
      };
      const result = await tool.handler(payload, TEST_CONFIG);
      const call = parseLastFetchCall(fetch);
      expect(call.method).toBe('POST');
      expect(call.pathname).toBe('/v2.0/calendar');
      expect(call.body).toMatchObject(payload);
      expect(JSON.parse(result)).toEqual(MOCK_DATA);
    });

    it('sends address for APPOINTMENT type', async () => {
      const fetch = mockFetchSuccess(MOCK_DATA);
      const tool = getTool('createCalendar');
      await tool.handler(
        { type: 'APPOINTMENT', content: 'Meeting', leadId: 2, timeZoneCode: 'UTC', address: '456 Oak Ave' },
        TEST_CONFIG,
      );
      const call = parseLastFetchCall(fetch);
      expect(call.body?.address).toBe('456 Oak Ave');
    });

    it('returns error on 400', async () => {
      mockFetchError(400);
      const tool = getTool('createCalendar');
      const result = await tool.handler({ type: 'TASK', content: '', leadId: 0, timeZoneCode: '' }, TEST_CONFIG);
      expectError(result, 400);
    });
  });

  describe('updateCalendar', () => {
    it('PUT /v2.0/calendar/{calendarId} with body, calendarId excluded', async () => {
      const fetch = mockFetchSuccess(MOCK_DATA);
      const tool = getTool('updateCalendar');
      const result = await tool.handler(
        { calendarId: '563172-task', content: 'Updated', timeZoneCode: 'UTC' },
        TEST_CONFIG,
      );
      const call = parseLastFetchCall(fetch);
      expect(call.method).toBe('PUT');
      expect(call.pathname).toBe('/v2.0/calendar/563172-task');
      expect(call.body?.content).toBe('Updated');
      expect(call.body?.calendarId).toBeUndefined();
      expect(JSON.parse(result)).toEqual(MOCK_DATA);
    });

    it('handles composite appointment ID', async () => {
      const fetch = mockFetchSuccess(MOCK_DATA);
      const tool = getTool('updateCalendar');
      await tool.handler({ calendarId: '789-appointment', content: 'x' }, TEST_CONFIG);
      const call = parseLastFetchCall(fetch);
      expect(call.pathname).toBe('/v2.0/calendar/789-appointment');
    });

    it('returns error on 404', async () => {
      mockFetchError(404);
      const tool = getTool('updateCalendar');
      const result = await tool.handler({ calendarId: '999-task', content: 'x' }, TEST_CONFIG);
      expectError(result, 404);
    });
  });

  describe('deleteCalendar', () => {
    it('DELETE /v2.0/calendar/{calendarId}', async () => {
      const fetch = mockFetchSuccess({});
      const tool = getTool('deleteCalendar');
      const result = await tool.handler({ calendarId: '100-task' }, TEST_CONFIG);
      const call = parseLastFetchCall(fetch);
      expect(call.method).toBe('DELETE');
      expect(call.pathname).toBe('/v2.0/calendar/100-task');
      expect(call.body).toBeUndefined();
      expect(JSON.parse(result)).toEqual({});
    });

    it('returns error on 404', async () => {
      mockFetchError(404);
      const tool = getTool('deleteCalendar');
      const result = await tool.handler({ calendarId: '999-task' }, TEST_CONFIG);
      expectError(result, 404);
    });
  });

  describe('finishCalendar', () => {
    it('POST /v2.0/calendar/{calendarId}/finish with no body', async () => {
      const fetch = mockFetchSuccess(MOCK_DATA);
      const tool = getTool('finishCalendar');
      const result = await tool.handler({ calendarId: '200-appointment' }, TEST_CONFIG);
      const call = parseLastFetchCall(fetch);
      expect(call.method).toBe('POST');
      expect(call.pathname).toBe('/v2.0/calendar/200-appointment/finish');
      expect(call.body).toBeUndefined();
      expect(JSON.parse(result)).toEqual(MOCK_DATA);
    });

    it('returns error on 404', async () => {
      mockFetchError(404);
      const tool = getTool('finishCalendar');
      const result = await tool.handler({ calendarId: '999-task' }, TEST_CONFIG);
      expectError(result, 404);
    });
  });

  describe('unfinishCalendar', () => {
    it('POST /v2.0/calendar/{calendarId}/unfinish with no body', async () => {
      const fetch = mockFetchSuccess(MOCK_DATA);
      const tool = getTool('unfinishCalendar');
      const result = await tool.handler({ calendarId: '300-task' }, TEST_CONFIG);
      const call = parseLastFetchCall(fetch);
      expect(call.method).toBe('POST');
      expect(call.pathname).toBe('/v2.0/calendar/300-task/unfinish');
      expect(call.body).toBeUndefined();
      expect(JSON.parse(result)).toEqual(MOCK_DATA);
    });

    it('returns error on 500', async () => {
      mockFetchError(500);
      const tool = getTool('unfinishCalendar');
      const result = await tool.handler({ calendarId: '1-task' }, TEST_CONFIG);
      expectError(result, 500);
    });
  });

  describe('getAvailableMeetings', () => {
    it('GET /v2.0/calendar/meetings/available with required leadId', async () => {
      const fetch = mockFetchSuccess([MOCK_DATA]);
      const tool = getTool('getAvailableMeetings');
      const result = await tool.handler({ leadId: 55 }, TEST_CONFIG);
      const call = parseLastFetchCall(fetch);
      expect(call.method).toBe('GET');
      expect(call.pathname).toBe('/v2.0/calendar/meetings/available');
      expect(call.params.leadId).toBe('55');
      expect(call.body).toBeUndefined();
      expect(JSON.parse(result)).toEqual([MOCK_DATA]);
    });

    it('passes optional startAt, endAt, timeZoneCode', async () => {
      const fetch = mockFetchSuccess([]);
      const tool = getTool('getAvailableMeetings');
      await tool.handler(
        { leadId: 1, startAt: '2024-01-01T00:00:00Z', endAt: '2024-01-07T00:00:00Z', timeZoneCode: 'UTC' },
        TEST_CONFIG,
      );
      const call = parseLastFetchCall(fetch);
      expect(call.params.startAt).toBe('2024-01-01T00:00:00Z');
      expect(call.params.endAt).toBe('2024-01-07T00:00:00Z');
      expect(call.params.timeZoneCode).toBe('UTC');
    });

    it('returns error on 401', async () => {
      mockFetchError(401);
      const tool = getTool('getAvailableMeetings');
      const result = await tool.handler({ leadId: 1 }, TEST_CONFIG);
      expectError(result, 401);
    });
  });

  it('exports exactly 7 tools', () => {
    expect(calendarTools).toHaveLength(7);
  });
});
