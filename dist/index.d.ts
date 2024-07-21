import { Config } from 'node-postgresql';
export type RuleOverrides = {
    [P in keyof Config]?: () => Config[P];
};
export interface Options {
    filePath?: string;
    ruleOverrides?: RuleOverrides;
}
export declare const generate: (options?: Options) => Config;
export declare const redacted: (config: Config) => Config;
