import { type ToolDef, loftyRequest, formatError, stripMeta } from '../client.js';

export const leads: ToolDef[] = [
  {
    name: 'listLeads',
    description: 'List leads with optional filters. Returns a paginated list.',
    inputSchema: {
      type: 'object',
      properties: {
        stage: { type: 'string', description: 'Filter by lead stage' },
        source: { type: 'string', description: 'Filter by lead source' },
        phone: { type: 'string', description: 'Filter by phone number' },
        email: { type: 'string', description: 'Filter by email address' },
        assignedUserId: { type: 'integer', description: 'Filter by assigned user ID' },
        anyTags: { type: 'string', description: 'Match any of these tags (comma-separated)' },
        allTags: { type: 'string', description: 'Match all of these tags (comma-separated)' },
        segments: { type: 'string', description: 'Filter by segments' },
        key: { type: 'string', description: 'Search keyword' },
        limit: { type: 'integer', description: 'Results per page (1-100)', minimum: 1, maximum: 100 },
        offset: { type: 'integer', description: 'Pagination offset' },
        sort: { type: 'string', description: 'Sort field' },
        desc: { type: 'boolean', description: 'Sort descending' },
        scrollId: { type: 'string', description: 'Scroll cursor for deep pagination' },
      },
    },
    handler: async (args, config) => {
      try {
        const params = stripMeta(args);
        const data = await loftyRequest('GET', '/v1.0/leads', { config, params });
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'getLead',
    description: 'Get a single lead by ID.',
    inputSchema: {
      type: 'object',
      required: ['leadId'],
      properties: {
        leadId: { type: 'integer', description: 'Lead ID' },
        withTrash: { type: 'boolean', description: 'Include soft-deleted lead' },
      },
    },
    handler: async (args, config) => {
      try {
        const { leadId, ...rest } = stripMeta(args);
        const data = await loftyRequest('GET', `/v1.0/leads/${leadId}`, {
          config,
          params: rest,
        });
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'createLead',
    description: 'Create a new lead.',
    inputSchema: {
      type: 'object',
      properties: {
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        emails: { type: 'array', items: { type: 'string' } },
        phones: { type: 'array', items: { type: 'string' } },
        assignedUserId: { type: 'integer' },
        stage: { type: 'string' },
        source: { type: 'string' },
        tags: { type: 'array', items: { type: 'string' } },
        tagsAdd: { type: 'array', items: { type: 'string' } },
        leadTypes: { type: 'array', items: { type: 'string' } },
        buyingTimeFrame: { type: 'string' },
        birthday: { type: 'string' },
        language: { type: 'string' },
        customAttributeList: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              attributeName: { type: 'string' },
              attributeType: { type: 'string' },
              value: { type: 'string' },
            },
          },
        },
      },
    },
    handler: async (args, config) => {
      try {
        const body = stripMeta(args);
        const data = await loftyRequest('POST', '/v1.0/leads', { config, body });
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'updateLead',
    description: 'Update an existing lead by ID.',
    inputSchema: {
      type: 'object',
      required: ['leadId'],
      properties: {
        leadId: { type: 'integer', description: 'Lead ID to update' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        emails: { type: 'array', items: { type: 'string' } },
        phones: { type: 'array', items: { type: 'string' } },
        assignedUserId: { type: 'integer' },
        stage: { type: 'string' },
        source: { type: 'string' },
        tags: { type: 'array', items: { type: 'string' } },
        tagsAdd: { type: 'array', items: { type: 'string' } },
        leadTypes: { type: 'array', items: { type: 'string' } },
        buyingTimeFrame: { type: 'string' },
        birthday: { type: 'string' },
        language: { type: 'string' },
        customAttributeList: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              attributeName: { type: 'string' },
              attributeType: { type: 'string' },
              value: { type: 'string' },
            },
          },
        },
      },
    },
    handler: async (args, config) => {
      try {
        const { leadId, ...rest } = stripMeta(args);
        const data = await loftyRequest('PUT', `/v1.0/leads/${leadId}`, {
          config,
          body: rest,
        });
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'deleteLead',
    description: 'Delete a lead by ID. A reason is required.',
    inputSchema: {
      type: 'object',
      required: ['leadId', 'reason'],
      properties: {
        leadId: { type: 'integer', description: 'Lead ID to delete' },
        reason: { type: 'string', description: 'Reason for deletion (required by API)' },
      },
    },
    handler: async (args, config) => {
      try {
        const { leadId, ...rest } = stripMeta(args);
        const data = await loftyRequest('DELETE', `/v1.0/leads/${leadId}`, {
          config,
          params: rest,
        });
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'assignLead',
    description: 'Assign a lead to a user.',
    inputSchema: {
      type: 'object',
      required: ['leadId', 'userId'],
      properties: {
        leadId: { type: 'integer', description: 'Lead ID' },
        userId: { type: 'integer', description: 'User ID to assign the lead to' },
      },
    },
    handler: async (args, config) => {
      try {
        const { leadId, ...rest } = stripMeta(args);
        const data = await loftyRequest('POST', `/v1.0/leads/${leadId}/assignment`, {
          config,
          body: rest,
        });
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'updateLeadInquiry',
    description: "Update a lead's property inquiry preferences.",
    inputSchema: {
      type: 'object',
      required: ['leadId'],
      properties: {
        leadId: { type: 'integer', description: 'Lead ID' },
        priceMin: { type: 'number', description: 'Minimum price' },
        priceMax: { type: 'number', description: 'Maximum price' },
        propertyType: { type: 'array', items: { type: 'string' }, description: 'Property types' },
        bedroomsMin: { type: 'number', description: 'Minimum bedrooms' },
        bathroomsMin: { type: 'number', description: 'Minimum bathrooms' },
        locations: { type: 'array', items: { type: 'string' }, description: 'Desired locations' },
      },
    },
    handler: async (args, config) => {
      try {
        const { leadId, ...rest } = stripMeta(args);
        const data = await loftyRequest('POST', `/v1.0/leads/${leadId}/inquiry`, {
          config,
          body: rest,
        });
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'updateLeadProperty',
    description: "Update a lead's current property information.",
    inputSchema: {
      type: 'object',
      required: ['leadId'],
      properties: {
        leadId: { type: 'integer', description: 'Lead ID' },
        price: { type: 'number' },
        state: { type: 'string' },
        city: { type: 'string' },
        streetAddress: { type: 'string' },
        zipCode: { type: 'string' },
        propertyType: { type: 'string' },
        bedrooms: { type: 'number' },
        bathrooms: { type: 'number' },
        squareFeet: { type: 'number' },
      },
    },
    handler: async (args, config) => {
      try {
        const { leadId, ...rest } = stripMeta(args);
        const data = await loftyRequest('POST', `/v1.0/leads/${leadId}/property`, {
          config,
          body: rest,
        });
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'logLeadActivity',
    description: 'Log an activity event against a lead.',
    inputSchema: {
      type: 'object',
      required: ['leadId', 'activityType'],
      properties: {
        leadId: { type: 'integer', description: 'Lead ID' },
        activityType: { type: 'string', description: 'Type of activity (e.g. call, email, sms)' },
        note: { type: 'string', description: 'Optional note about the activity' },
      },
    },
    handler: async (args, config) => {
      try {
        const { leadId, ...rest } = stripMeta(args);
        const data = await loftyRequest('POST', `/v1.0/leads/${leadId}/activity`, {
          config,
          body: rest,
        });
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'getLeadActivitiesV1',
    description: 'Get activity history for a lead (v1, page-based).',
    inputSchema: {
      type: 'object',
      required: ['leadId'],
      properties: {
        leadId: { type: 'integer', description: 'Lead ID (also sent as query param per v1 spec)' },
        curPage: { type: 'integer', description: 'Page number' },
      },
    },
    handler: async (args, config) => {
      try {
        const { leadId, ...rest } = stripMeta(args);
        const data = await loftyRequest('GET', `/v1.0/leads/${leadId}/activities`, {
          config,
          params: rest,
        });
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'getLeadActivitiesV2',
    description: 'Get activity history for a lead (v2, cursor/offset-based with timezone support).',
    inputSchema: {
      type: 'object',
      required: ['leadId'],
      properties: {
        leadId: { type: 'integer', description: 'Lead ID' },
        currentId: { type: 'integer', description: 'Cursor ID for pagination' },
        offset: { type: 'integer', description: 'Offset for pagination' },
        limit: { type: 'integer', description: 'Number of results (1-1000)', minimum: 1, maximum: 1000 },
        timeZoneCode: { type: 'string', description: 'IANA timezone code (e.g. America/New_York)' },
      },
    },
    handler: async (args, config) => {
      try {
        const { leadId, ...rest } = stripMeta(args);
        const data = await loftyRequest('GET', `/v2.0/leads/${leadId}/activities`, {
          config,
          params: rest,
        });
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'getAssigneeInfo',
    description: 'Look up the assignee agent for a lead by phone, email, or external ID.',
    inputSchema: {
      type: 'object',
      properties: {
        phone: { type: 'string', description: 'Lead phone number' },
        email: { type: 'string', description: 'Lead email address' },
        externalId: { type: 'string', description: 'External CRM ID' },
      },
    },
    handler: async (args, config) => {
      try {
        const body = stripMeta(args);
        const data = await loftyRequest('POST', '/v1.0/leads/assignee', { config, body });
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return formatError(e);
      }
    },
  },
];
