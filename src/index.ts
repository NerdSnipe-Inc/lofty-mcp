#!/usr/bin/env node
import "dotenv/config";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { getConfig, stripMeta, type ToolDef } from "./client.js";

import { leads } from "./tools/leads.js";
import { notes } from "./tools/notes.js";
import { tasksV1Tools } from "./tools/tasks_v1.js";
import { tasksV2Tools } from "./tools/tasks_v2.js";
import { calendarTools } from "./tools/calendar.js";
import { callsTools } from "./tools/calls.js";
import { communicationTools } from "./tools/communication.js";
import { webhooks } from "./tools/webhooks.js";
import { salesAgents } from "./tools/sales_agents.js";
import { intelligentTools } from "./tools/intelligent.js";
import { notificationsTools } from "./tools/notifications.js";
import { transactionsTools } from "./tools/transactions.js";
import { members } from "./tools/members.js";
import { teamFeatures } from "./tools/team_features.js";
import { leadRoutingTools } from "./tools/lead_routing.js";
import { leadManualLogTools } from "./tools/lead_manual_log.js";
import { agentOrgTools } from "./tools/agent_org.js";
import { agentUserTools } from "./tools/agent_user.js";
import { vendorTools } from "./tools/vendor.js";
import { listing } from "./tools/listing.js";
import { system_logs } from "./tools/system_logs.js";
import { meta } from "./tools/meta.js";

export const ALL_TOOLS: ToolDef[] = [
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

function isDeleteTool(name: string): boolean {
  return (
    name === "deleteLead" ||
    name === "deleteNote" ||
    name === "deleteTaskV1" ||
    name === "deleteWebhook" ||
    name === "deleteTaskV2" ||
    name === "deleteCalendar" ||
    name === "deleteManualLogType"
  );
}

export function createServer() {
  const config = getConfig();
  const tools = config.safeMode
    ? ALL_TOOLS.filter((t) => !isDeleteTool(t.name))
    : ALL_TOOLS;

  const server = new Server(
    { name: "lofty-mcp", version: "1.0.0" },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: tools.map((t) => ({
      name: t.name,
      description: t.description,
      inputSchema: t.inputSchema,
    })),
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const tool = tools.find((t) => t.name === name);
    if (!tool) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ error: true, message: `Unknown tool: ${name}` }),
          },
        ],
      };
    }
    const result = await tool.handler(
      stripMeta((args ?? {}) as Record<string, unknown>),
      config
    );
    return { content: [{ type: "text", text: result }] };
  });

  return server;
}

async function main() {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
