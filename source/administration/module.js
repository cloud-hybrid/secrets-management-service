const { SecretsManager } = require("@aws-sdk/client-secrets-manager");
const Client = SecretsManager;
const Service = new Client({
    apiVersion: "latest",
    logger: console
});

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

module.exports.default = {
    Client, Service, Response
};
