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

export type OverrideRules = {
  [P in keyof Config]?: () => Config[P];
};

export interface Options {
  filePath?: string;
  overrideRules?: OverrideRules;
}

export class PostgreSQLConfig {
  #object: Config;

  constructor(private readonly options?: Options) {
    if (this.options && this.options.filePath) {
      dotenv.config({ path: this.options.filePath });
    }
    if (this.options && this.options.overrideRules) {
      Object.assign(rules, this.options.overrideRules);
    }
    this.#object = {
      host: rules.host(),
      port: rules.port(),
      user: rules.user(),
      password: rules.password(),
      database: rules.database(),
    };
    Object.keys(this.#object).forEach((value) => {
      if (typeof this.#object[value as keyof Config] == 'undefined') {
        throw new Error(`PostgreSQL config property "${value}" is missing`);
      }
    });
  }

  get object() {
    return this.#object;
  }

  get redactedObject(): Config {
    return Object.assign({}, this.#object, { password: '<redacted>' });
  }
}
