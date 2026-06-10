import { describe, it, expect } from 'vitest';

import { leads } from '../src/tools/leads.js';
import { notes } from '../src/tools/notes.js';
import { tasksV1Tools } from '../src/tools/tasks_v1.js';
import { tasksV2Tools } from '../src/tools/tasks_v2.js';
import { calendarTools } from '../src/tools/calendar.js';
import { callsTools } from '../src/tools/calls.js';
import { communicationTools } from '../src/tools/communication.js';
import { webhooks } from '../src/tools/webhooks.js';
import { salesAgents } from '../src/tools/sales_agents.js';
import { intelligentTools } from '../src/tools/intelligent.js';
import { notificationsTools } from '../src/tools/notifications.js';
import { transactionsTools } from '../src/tools/transactions.js';
import { members } from '../src/tools/members.js';
import { teamFeatures } from '../src/tools/team_features.js';
import { leadRoutingTools } from '../src/tools/lead_routing.js';
import { leadManualLogTools } from '../src/tools/lead_manual_log.js';
import { agentOrgTools } from '../src/tools/agent_org.js';
import { agentUserTools } from '../src/tools/agent_user.js';
import { vendorTools } from '../src/tools/vendor.js';
import { listing } from '../src/tools/listing.js';
import { system_logs } from '../src/tools/system_logs.js';
import { meta } from '../src/tools/meta.js';
import type { ToolDef } from '../src/client.js';

const ALL_TOOLS: ToolDef[] = [
  ...leads,
  ...notes,
  ...tasksV1Tools,
  ...tasksV2Tools,
  ...calendarTools,
  ...callsTools,
  ...communicationTools,
  ...webhooks,
  ...salesAgents,
  ...intelligentTools,
  ...notificationsTools,
  ...transactionsTools,
  ...members,
  ...teamFeatures,
  ...leadRoutingTools,
  ...leadManualLogTools,
  ...agentOrgTools,
  ...agentUserTools,
  ...vendorTools,
  ...listing,
  ...system_logs,
  ...meta,
];

const DELETE_TOOLS = [
  'deleteLead',
  'deleteNote',
  'deleteTaskV1',
  'deleteWebhook',
  'deleteTaskV2',
  'deleteCalendar',
  'deleteManualLogType',
];

function isDeleteTool(name: string): boolean {
  return DELETE_TOOLS.includes(name);
}

describe('server registry', () => {
  it('ALL_TOOLS has the expected total count', () => {
    expect(ALL_TOOLS).toHaveLength(120);
  });

  it('has no duplicate tool names', () => {
    const names = ALL_TOOLS.map(t => t.name);
    const unique = new Set(names);
    const dupes = names.filter((n, i) => names.indexOf(n) !== i);
    expect(dupes).toEqual([]);
    expect(unique.size).toBe(ALL_TOOLS.length);
  });

  it('every tool has non-empty name, description >= 10 chars, valid inputSchema, and handler function', () => {
    for (const tool of ALL_TOOLS) {
      expect(tool.name.length, `tool name empty`).toBeGreaterThan(0);
      expect(tool.description.length, `${tool.name} description too short`).toBeGreaterThanOrEqual(10);
      expect(tool.inputSchema.type, `${tool.name} inputSchema.type`).toBe('object');
      expect(typeof tool.handler, `${tool.name} handler`).toBe('function');
    }
  });

  it('has exactly 7 delete tools', () => {
    const deleteToolsFound = ALL_TOOLS.filter(t => isDeleteTool(t.name));
    expect(deleteToolsFound).toHaveLength(7);
    for (const name of DELETE_TOOLS) {
      expect(ALL_TOOLS.some(t => t.name === name), `missing delete tool: ${name}`).toBe(true);
    }
  });

  it('safe mode excludes all 7 delete tools leaving 113 tools', () => {
    const safeTools = ALL_TOOLS.filter(t => !isDeleteTool(t.name));
    expect(safeTools).toHaveLength(ALL_TOOLS.length - 7);
  });

  describe('per-module tool counts', () => {
    it('leads: 12', () => expect(leads).toHaveLength(12));
    it('notes: 5', () => expect(notes).toHaveLength(5));
    it('tasks_v1: 6', () => expect(tasksV1Tools).toHaveLength(6));
    it('tasks_v2: 8', () => expect(tasksV2Tools).toHaveLength(8));
    it('calendar: 7', () => expect(calendarTools).toHaveLength(7));
    it('calls: 3', () => expect(callsTools).toHaveLength(3));
    it('communication: 10', () => expect(communicationTools).toHaveLength(10));
    it('webhooks: 3', () => expect(webhooks).toHaveLength(3));
    it('sales_agents: 13', () => expect(salesAgents).toHaveLength(13));
    it('intelligent: 6', () => expect(intelligentTools).toHaveLength(6));
    it('notifications: 4', () => expect(notificationsTools).toHaveLength(4));
    it('transactions: 9', () => expect(transactionsTools).toHaveLength(9));
    it('members: 4', () => expect(members).toHaveLength(4));
    it('team_features: 6', () => expect(teamFeatures).toHaveLength(6));
    it('lead_routing: 6', () => expect(leadRoutingTools).toHaveLength(6));
    it('lead_manual_log: 4', () => expect(leadManualLogTools).toHaveLength(4));
    it('agent_org: 5', () => expect(agentOrgTools).toHaveLength(5));
    it('agent_user: 2', () => expect(agentUserTools).toHaveLength(2));
    it('vendor: 1', () => expect(vendorTools).toHaveLength(1));
    it('listing: 3', () => expect(listing).toHaveLength(3));
    it('system_logs: 1', () => expect(system_logs).toHaveLength(1));
    it('meta: 2', () => expect(meta).toHaveLength(2));
  });

  describe('specific tool name existence (sample)', () => {
    const sampleTools = [
      // leads
      'listLeads', 'getLead', 'createLead', 'updateLead', 'deleteLead', 'assignLead',
      // notes
      'deleteNote',
      // tasks
      'deleteTaskV1', 'deleteTaskV2',
      // calendar
      'deleteCalendar',
      // webhooks
      'deleteWebhook',
      // lead_manual_log
      'deleteManualLogType', 'getManualLogType', 'createManualLogType', 'listManualLogTypes',
      // listing
      'getPublishedListings', 'getListingsByAgent', 'searchListingsV2',
      // system_logs
      'getSystemLogs',
      // meta
      'about', 'help',
      // intelligent
      'generateCallScript', 'getCallSummary', 'generateCallSummary',
      // notifications
      'sendOpportunityNotification',
      // transactions
      'listLeadTransactions', 'addTransaction',
      // agent_org
      'getOrgInfo',
      // vendor
      'getVendors',
    ];

    for (const name of sampleTools) {
      it(`tool "${name}" exists`, () => {
        expect(ALL_TOOLS.some(t => t.name === name), `missing: ${name}`).toBe(true);
      });
    }
  });
});
