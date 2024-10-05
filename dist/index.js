"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redacted = exports.generate = void 0;
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
const generate = (options) => {
    if (options && options.filePath) {
        dotenv_1.default.config({ path: options.filePath });
    }
    if (options && options.ruleOverrides) {
        Object.assign(rules, options.ruleOverrides);
    }
    const config = {
        host: rules.host(),
        port: rules.port(),
        user: rules.user(),
        password: rules.password(),
        database: rules.database(),
    };
    Object.keys(config).forEach((value) => {
        if (typeof config[value] == 'undefined') {
            throw new Error(`PostgreSQL config property "${value}" is missing`);
        }
    });
    return config;
};
exports.generate = generate;
/**
 * Return a copy of the config object with the password
 * redacted (i.e., replaced with '<redacted>'). This is
 * useful for logging the config object without
 * accidentally leaking the password.
 */
const redacted = (config) => Object.assign({}, config, { password: '<redacted>' });
exports.redacted = redacted;
