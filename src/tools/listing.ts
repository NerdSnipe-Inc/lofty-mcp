import { type ToolDef, loftyRequest, formatError, stripMeta } from '../client.js';

export const listing: ToolDef[] = [
  {
    name: 'getPublishedListings',
    description: 'Get published listings for a site, with optional pagination.',
    inputSchema: {
      type: 'object',
      properties: {
        siteId: { type: 'string', description: 'Site ID to filter listings by' },
        page: { type: 'integer', description: 'Page number for pagination' },
        pageSize: { type: 'integer', description: 'Number of results per page' },
      },
    },
    handler: async (args, config) => {
      try {
        const params = stripMeta(args);
        const data = await loftyRequest('GET', '/v1.0/getPublishedListings', { config, params });
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'getListingsByAgent',
    description: 'Get listings associated with a specific agent by agent ID.',
    inputSchema: {
      type: 'object',
      properties: {
        agentId: { type: 'integer', description: 'Agent ID to filter listings by' },
      },
    },
    handler: async (args, config) => {
      try {
        const params = stripMeta(args);
        const data = await loftyRequest('GET', '/v1.0/listing', { config, params });
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return formatError(e);
      }
    },
  },

  {
    name: 'searchListingsV2',
    description: 'Search listings using advanced filters such as price range, bedrooms, bathrooms, property type, and location (v2).',
    inputSchema: {
      type: 'object',
      properties: {
        keyword: { type: 'string', description: 'Keyword search term' },
        priceMin: { type: 'number', description: 'Minimum listing price' },
        priceMax: { type: 'number', description: 'Maximum listing price' },
        bedroomsMin: { type: 'number', description: 'Minimum number of bedrooms' },
        bathroomsMin: { type: 'number', description: 'Minimum number of bathrooms' },
        propertyType: { type: 'string', description: 'Property type (e.g. single_family, condo)' },
        city: { type: 'string', description: 'City to search within' },
        state: { type: 'string', description: 'State to search within (2-letter code)' },
        zipCode: { type: 'string', description: 'ZIP code to search within' },
        offset: { type: 'integer', description: 'Pagination offset' },
        limit: { type: 'integer', description: 'Number of results per page' },
      },
    },
    handler: async (args, config) => {
      try {
        const body = stripMeta(args);
        const data = await loftyRequest('POST', '/v2.0/listings/search', { config, body });
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return formatError(e);
      }
    },
  },
];
