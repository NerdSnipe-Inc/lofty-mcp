import { describe, it, expect } from 'vitest';
import { meta } from '../../src/tools/meta.js';
import { TEST_CONFIG } from '../helpers.js';

function getTool(name: string) {
  const tool = meta.find(t => t.name === name);
  if (!tool) throw new Error(`Tool not found: ${name}`);
  return tool;
}

describe('meta tools', () => {
  it('exports 2 tools', () => {
    expect(meta).toHaveLength(2);
  });

  describe('about', () => {
    it('returns server metadata without making an API call', async () => {
      const tool = getTool('about');
      const result = await tool.handler({}, TEST_CONFIG);
      const data = JSON.parse(result);
      expect(data.server).toBe('Lofty MCP Server');
      expect(data.version).toBe('1.0.0');
      expect(data.author.name).toBe('Ed Neuhaus');
      expect(data.author.company).toBe('Neuhaus Realty Group, LLC');
      expect(data.author.location).toBe('Austin, Texas');
      expect(data.author.website).toBe('https://neuhausre.com');
      expect(data.description).toContain('Lofty');
      expect(data.github).toBe('https://github.com/Nerdsnipe-Inc/lofty-mcp');
    });

    it('has valid inputSchema with type object', () => {
      const tool = getTool('about');
      expect(tool.inputSchema.type).toBe('object');
    });
  });

  describe('help', () => {
    it('returns safe_mode status from config', async () => {
      const tool = getTool('help');
      const result = await tool.handler({}, TEST_CONFIG);
      const data = JSON.parse(result);
      expect(data.safe_mode).toBe(TEST_CONFIG.safeMode);
    });

    it('returns safe_mode=false when config has safeMode=false', async () => {
      const tool = getTool('help');
      const result = await tool.handler({}, { ...TEST_CONFIG, safeMode: false });
      const data = JSON.parse(result);
      expect(data.safe_mode).toBe(false);
    });

    it('includes getting_started array and bug_reports URL', async () => {
      const tool = getTool('help');
      const result = await tool.handler({}, TEST_CONFIG);
      const data = JSON.parse(result);
      expect(Array.isArray(data.getting_started)).toBe(true);
      expect(data.getting_started.length).toBeGreaterThan(0);
      expect(data.bug_reports).toBe('https://github.com/Nerdsnipe-Inc/lofty-mcp/issues');
    });

    it('has valid inputSchema with type object', () => {
      const tool = getTool('help');
      expect(tool.inputSchema.type).toBe('object');
    });
  });
});
