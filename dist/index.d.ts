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
export declare const generate: (options?: Options) => Config;
/**
 * Return a copy of the config object with the password
 * redacted (i.e., replaced with '<redacted>'). This is
 * useful for logging the config object without
 * accidentally leaking the password.
 */
export declare const redacted: (config: Config) => Config;
export {};
