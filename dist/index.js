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
 * Generates a `Config` object for PostgreSQL connection.
 *
 * - If `options.filePath` is provided, loads environment variables from
 *   the specified file path using `dotenv`.
 * - If `options.ruleOverrides` is provided, applies these overrides
 *   to the default configuration rules.
 * - Constructs a `Config` object using the resolved rules.
 * - Validates that all required configuration properties are present
 *   and throws an error if any are missing.
 *
 * @param {Options} [options] - Configuration options, including an optional
 *   `filePath` for loading environment variables and optional `ruleOverrides`
 *   for customizing configuration rules.
 * @returns {Config} - The complete and validated configuration object.
 * @throws {Error} - Throws an error if any required configuration property is missing.
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
        if (typeof config[key] == 'undefined') {
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
