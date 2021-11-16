/// import { SecretsManager as Client } from "@aws-sdk/client-secrets-manager";
/// export const Service = new Client({
///     apiVersion: "latest"
/// });

const { SecretsManager } = require("@aws-sdk/client-secrets-manager");
const Client = SecretsManager;
const Service = new Client({
    apiVersion: "latest"
});

/***
 *
 * @param body {String | JSON}
 * @param status {Number}
 * @param headers {{}}
 *
 * @returns {{headers: {"X-Deployment-Version": string | undefined, Server: string, "Content-Type": string}, body, statusCode: number}}
 *
 * @constructor
 *
 */

/// export const Response = (body, status = 200, headers = {}) => {
const Response = (body, status = 200, headers = {}) => {
    return {
        statusCode: status, body, headers: {
            ... {
                "Server": "X-Secrets-Service",
                "Content-Type": "Application/JSON",
                "X-Deployment-Version": process.env.npm_init_version
            }, ... headers
        }
    }
};

module.exports.Client = Client;
module.exports.Service = Service;
module.exports.Response = Response;

/***
 *
 * @type {{Response: (function((String|JSON), Number=, {}=): {headers: {"X-Deployment-Version": string | undefined, Server: string, "Content-Type": string}, body: String|JSON, statusCode: Number}), Service: Service, Client: Client}}
 *
 */

/// export default {
///     Client, Service, Response
/// };

module.exports.default = {
    Client, Service, Response
};
