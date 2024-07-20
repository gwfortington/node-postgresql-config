import { Config as ConfigObject } from 'node-postgresql';
export type OverrideRules = {
    [P in keyof ConfigObject]?: () => ConfigObject[P];
};
export interface Options {
    filePath?: string;
    overrideRules?: OverrideRules;
}
export declare class Config {
    #private;
    private readonly options?;
    constructor(options?: Options | undefined);
    get object(): ConfigObject;
    get redactedObject(): ConfigObject;
}
