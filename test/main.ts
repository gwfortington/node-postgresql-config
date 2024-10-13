import dotenv from 'dotenv';
import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';

import { Debug, MessageType } from 'node-debug';
import { generateConfig, redactedConfig } from '../dist';

describe('main', (suiteContext) => {
  Debug.initialize(true);
  let debug: Debug;
  const filePath = `${process.cwd()}/.test.env`;
  const ruleOverrides = {
    database: () => 'test',
  };
  before(async () => {});
  it('options-none', async (testContext) => {
    debug = new Debug(`${suiteContext.name}.test.${testContext.name}`);
    debug.write(MessageType.Entry);
    dotenv.config({ path: filePath });
    debug.write(MessageType.Step, `Generating config...`);
    const config = generateConfig();
    debug.write(
      MessageType.Value,
      `config=${JSON.stringify(redactedConfig(config))}`,
    );
    debug.write(MessageType.Exit);
    assert.ok(true);
  });
  it('options-filePath', async (testContext) => {
    debug = new Debug(`${suiteContext.name}.test.${testContext.name}`);
    debug.write(MessageType.Entry);
    debug.write(MessageType.Step, `Generating config...`);
    const config = generateConfig({ filePath: filePath });
    debug.write(
      MessageType.Value,
      `config=${JSON.stringify(redactedConfig(config))}`,
    );
    debug.write(MessageType.Exit);
    assert.ok(true);
  });
  it('options-ruleOverrides', async (testContext) => {
    debug = new Debug(`${suiteContext.name}.test.${testContext.name}`);
    debug.write(MessageType.Entry);
    dotenv.config({ path: filePath });
    debug.write(MessageType.Step, `Generating config...`);
    const config = generateConfig({
      ruleOverrides: ruleOverrides,
    });
    debug.write(
      MessageType.Value,
      `config=${JSON.stringify(redactedConfig(config))}`,
    );
    debug.write(MessageType.Exit);
    assert.ok(true);
  });
  it('options-both', async (testContext) => {
    debug = new Debug(`${suiteContext.name}.test.${testContext.name}`);
    debug.write(MessageType.Entry);
    debug.write(MessageType.Step, `Generating config...`);
    const config = generateConfig({
      filePath: filePath,
      ruleOverrides: ruleOverrides,
    });
    debug.write(
      MessageType.Value,
      `config=${JSON.stringify(redactedConfig(config))}`,
    );
    debug.write(MessageType.Exit);
    assert.ok(true);
  });
  after(async () => {});
});
