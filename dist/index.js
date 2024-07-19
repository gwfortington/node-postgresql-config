"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _Config_object;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
class Config {
    constructor(options) {
        this.options = options;
        _Config_object.set(this, void 0);
        if (this.options && this.options.filePath) {
            dotenv_1.default.config({ path: this.options.filePath });
        }
        const rules = {
            host: () => process.env.POSTGRESQL_HOST || 'localhost',
            port: () => {
                const port = Number(process.env.POSTGRESQL_PORT || 'default');
                return isNaN(port) ? 5432 : port;
            },
            user: () => process.env.POSTGRESQL_USER,
            password: () => process.env.POSTGRESQL_PASSWORD,
            database: () => process.env.POSTGRESQL_DATABASE,
        };
        if (this.options && this.options.overrides) {
            Object.assign(rules, this.options.overrides);
        }
        __classPrivateFieldSet(this, _Config_object, {
            host: rules.host(),
            port: rules.port(),
            user: rules.user(),
            password: rules.password(),
            database: rules.database(),
        }, "f");
        Object.keys(__classPrivateFieldGet(this, _Config_object, "f")).forEach((value) => {
            if (typeof __classPrivateFieldGet(this, _Config_object, "f")[value] == 'undefined') {
                throw new Error(`Error: PostgreSQL config property "${value}" is missing`);
            }
        });
    }
    get object() {
        return __classPrivateFieldGet(this, _Config_object, "f");
    }
    get redactedObject() {
        return Object.assign({}, __classPrivateFieldGet(this, _Config_object, "f"), __classPrivateFieldGet(this, _Config_object, "f") ? { password: '<redacted>' } : null);
    }
}
_Config_object = new WeakMap();
exports.default = Config;
