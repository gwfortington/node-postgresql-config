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
 * Generate a `Config` object with the following behavior:
 *
 * - If `options.filePath` is provided, load environment variables from
 *   the file at that path using `dotenv`.
 * - If `options.ruleOverrides` is provided, use those overridden values
 *   in place of the default values.
 * - Then, generate a `Config` object using the overridden values.
 * - Finally, check that all required values are present in the `Config`
 *   object, and throw an error if any are missing.
 *
 * @param {Options} [options]
 * @returns {Config}
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
    if (typeof config[key] === 'undefined') {
      throw new Error(`PostgreSQL config property "${key}" is missing`);
    }
  }

  return config;
};

/**
 * Return a copy of the config object with the password
 * redacted (i.e., replaced with '<redacted>'). This is
 * useful for logging the config object without
 * accidentally leaking the password.
 */
export const redactedConfig = (config: Config): Config =>
  Object.assign({}, config, { password: '<redacted>' });
