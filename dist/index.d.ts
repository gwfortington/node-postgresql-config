import { Config } from 'node-postgresql';
type Rules = {
    [P in keyof Config]: () => Config[P];
};
export type RuleOverrides = Partial<Rules>;
export interface Options {
    filePath?: string;
    ruleOverrides?: RuleOverrides;
}
export declare const generate: (options?: Options) => Config;
export declare const redacted: (config: Config) => Config;
export {};
