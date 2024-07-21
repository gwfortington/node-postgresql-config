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

export type RuleOverrides = {
  [P in keyof Config]?: () => Config[P];
};

export interface Options {
  filePath?: string;
  ruleOverrides?: RuleOverrides;
}

export const generate = (options?: Options): Config => {
  if (options && options.filePath) {
    dotenv.config({ path: options.filePath });
  }
  if (options && options.ruleOverrides) {
    Object.assign(rules, options.ruleOverrides);
  }
  const config: Config = {
    host: rules.host(),
    port: rules.port(),
    user: rules.user(),
    password: rules.password(),
    database: rules.database(),
  };
  Object.keys(config).forEach((value) => {
    if (typeof config[value as keyof Config] == 'undefined') {
      throw new Error(`PostgreSQL config property "${value}" is missing`);
    }
  });
  return config;
};

export const redacted = (config: Config): Config =>
  Object.assign({}, config, { password: '<redacted>' });
