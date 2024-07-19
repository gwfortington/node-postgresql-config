import { Config as ConfigObject } from 'node-postgresql';
type OverrideRules = {
    [P in keyof ConfigObject]?: () => ConfigObject[P];
};
interface Options {
    filePath?: string;
    overrideRules?: OverrideRules;
}
export default class Config {
    #private;
    private readonly options;
    constructor(options: Options);
    get object(): ConfigObject;
    get redactedObject(): ConfigObject;
}
export {};
