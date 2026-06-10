import { type ToolDef } from '../client.js';

export const meta: ToolDef[] = [
  {
    name: 'about',
    description: 'Returns metadata about this MCP server: name, version, author, and description.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    handler: async (_args, _config) => {
      return JSON.stringify({
        server: 'Lofty MCP Server',
        version: '1.0.0',
        author: {
          name: 'Ed Neuhaus',
          company: 'Neuhaus Realty Group, LLC',
          location: 'Austin, Texas',
          website: 'https://neuhausre.com',
        },
        description:
          'MCP server for Lofty (formerly Chime) CRM — 120+ tools covering the full Lofty API',
        github: 'https://github.com/Nerdsnipe-Inc/lofty-mcp',
      }, null, 2);
    },
  },

  {
    name: 'help',
    description: 'Returns help information including safe mode status, getting started instructions, and where to report bugs.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    handler: async (_args, config) => {
      return JSON.stringify({
        safe_mode: config.safeMode,
        getting_started: [
          'Set the LOFTY_API_KEY environment variable to your Lofty OAuth2 bearer token.',
          'Set LOFTY_SAFE_MODE=false to enable destructive operations (delete tools).',
          'Use listLeads, getLead, createLead, updateLead to manage contacts.',
          'Use searchListingsV2 to search property listings with advanced filters.',
          'Use about to see server version and author information.',
        ],
        bug_reports: 'https://github.com/Nerdsnipe-Inc/lofty-mcp/issues',
      }, null, 2);
    },
  },
];
