import { Config } from 'node-postgresql';
type Rules = {
    [P in keyof Config]: () => Config[P];
};
interface Options {
    filePath?: string;
    overrides?: Rules;
}
export default class {
    #private;
    private readonly options;
    constructor(options: Options);
    get object(): Config;
    get redactedObject(): Config;
}
export {};
