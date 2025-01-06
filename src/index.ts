import dotenv from 'dotenv';
import { Config } from 'node-postgresql';

type Rules = {
  [P in keyof Config]: () => Config[P];
};

const rules: Rules = {
  host: () => process.env.POSTGRESQL_HOST || 'localhost',
  port: () => {
    const port = Number(process.env.POSTGRESQL_PORT || 'default');
    return isNaN(port) ? 5432 : port;
  },
  user: () => process.env.POSTGRESQL_USER!,
  password: () => process.env.POSTGRESQL_PASSWORD!,
  database: () => process.env.POSTGRESQL_DATABASE!,
};

export type RuleOverrides = Partial<Rules>;

export interface Options {
  filePath?: string;
  ruleOverrides?: RuleOverrides;
}

/**
 * Generates a `Config` object for PostgreSQL connection.
 *
 * - If `options.filePath` is provided, loads environment variables from
 *   the specified file path using `dotenv`.
 * - If `options.ruleOverrides` is provided, applies these overrides
 *   to the default configuration rules.
 * - Constructs a `Config` object using the resolved rules.
 * - Validates that all required configuration properties are present
 *   and throws an error if any are missing.
 *
 * @param {Options} [options] - Configuration options, including an optional
 *   `filePath` for loading environment variables and optional `ruleOverrides`
 *   for customizing configuration rules.
 * @returns {Config} - The complete and validated configuration object.
 * @throws {Error} - Throws an error if any required configuration property is missing.
 */
export const generateConfig = (options: Options = {}): Config => {
  const { filePath, ruleOverrides = {} } = options;

  if (filePath) {
    dotenv.config({ path: filePath });
  }

  const configRules = { ...rules, ...ruleOverrides };

  const config: Config = {
    host: configRules.host(),
    port: configRules.port(),
    user: configRules.user(),
    password: configRules.password(),
    database: configRules.database(),
  };

  for (const key of Object.keys(config) as Array<keyof Config>) {
    if (typeof config[key] == 'undefined') {
      throw new Error(`PostgreSQL config property "${key}" is missing`);
    }
  }

  return config;
};

/**
 * Return a copy of the config object with the password
 * redacted (i.e., replaced with '********'). This is
 * useful for logging the config object without
 * accidentally leaking the password.
 */
export const redactedConfig = (config: Config): Config =>
  Object.assign({}, config, { password: '********' });
