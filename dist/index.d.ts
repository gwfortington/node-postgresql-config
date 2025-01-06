import { Config } from 'node-postgresql';
type Rules = {
    [P in keyof Config]: () => Config[P];
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
export declare const generateConfig: (options?: Options) => Config;
/**
 * Return a copy of the config object with the password
 * redacted (i.e., replaced with '********'). This is
 * useful for logging the config object without
 * accidentally leaking the password.
 */
export declare const redactedConfig: (config: Config) => Config;
export {};
