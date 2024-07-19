import { Config as ConfigObject } from 'node-postgresql';
type Rules = {
    [P in keyof ConfigObject]: () => ConfigObject[P];
};
interface Options {
    filePath?: string;
    overrides?: Rules;
}
export declare class Config {
    #private;
    private readonly options;
    constructor(options: Options);
    get object(): ConfigObject;
    get redactedObject(): ConfigObject;
}
export {};
