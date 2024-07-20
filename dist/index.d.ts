import { Config } from 'node-postgresql';
export type OverrideRules = {
    [P in keyof Config]?: () => Config[P];
};
export interface Options {
    filePath?: string;
    overrideRules?: OverrideRules;
}
export declare class PostgreSQLConfig {
    #private;
    private readonly options?;
    constructor(options?: Options | undefined);
    get object(): Config;
    get redactedObject(): Config;
}
