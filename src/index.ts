import dotenv from 'dotenv';
import { Config as ConfigObject } from 'node-postgresql';

type Rules = {
  [P in keyof ConfigObject]: () => ConfigObject[P];
};

interface Options {
  filePath?: string;
  overrides?: Rules;
}

export class Config {
  #object: ConfigObject;

  constructor(private readonly options: Options) {
    if (this.options && this.options.filePath) {
      dotenv.config({ path: this.options.filePath });
    }
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
    if (this.options && this.options.overrides) {
      Object.assign(rules, this.options.overrides);
    }
    this.#object = {
      host: rules.host(),
      port: rules.port(),
      user: rules.user(),
      password: rules.password(),
      database: rules.database(),
    };
    Object.keys(this.#object).forEach((value) => {
      if (typeof this.#object[value as keyof ConfigObject] == 'undefined') {
        throw new Error(
          `Error: PostgreSQL config property "${value}" is missing`
        );
      }
    });
  }

  get object() {
    return this.#object;
  }

  get redactedObject(): ConfigObject {
    return Object.assign(
      {},
      this.#object,
      this.#object ? { password: '<redacted>' } : null
    );
  }
}
