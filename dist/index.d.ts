import { Config as ConfigObject } from 'node-postgresql';
type Rules = {
    [P in keyof ConfigObject]: () => ConfigObject[P];
};
type Overrides = {
    [P in keyof Rules]?: () => Rules[P];
};
interface Options {
    filePath?: string;
    overrides?: Overrides;
}
export default class Config {
    #private;
    private readonly options;
    constructor(options: Options);
    get object(): ConfigObject;
    get redactedObject(): ConfigObject;
}
export {};
