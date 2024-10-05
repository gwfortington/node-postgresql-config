"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redactedConfig = exports.generateConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
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
const generateConfig = (options = {}) => {
    const { filePath, ruleOverrides = {} } = options;
    if (filePath) {
        dotenv_1.default.config({ path: filePath });
    }
    const configRules = Object.assign(Object.assign({}, rules), ruleOverrides);
    const config = {
        host: configRules.host(),
        port: configRules.port(),
        user: configRules.user(),
        password: configRules.password(),
        database: configRules.database(),
    };
    for (const key of Object.keys(config)) {
        if (typeof config[key] === 'undefined') {
            throw new Error(`PostgreSQL config property "${key}" is missing`);
        }
    }
    return config;
};
exports.generateConfig = generateConfig;
/**
 * Return a copy of the config object with the password
 * redacted (i.e., replaced with '********'). This is
 * useful for logging the config object without
 * accidentally leaking the password.
 */
const redactedConfig = (config) => Object.assign({}, config, { password: '********' });
exports.redactedConfig = redactedConfig;
