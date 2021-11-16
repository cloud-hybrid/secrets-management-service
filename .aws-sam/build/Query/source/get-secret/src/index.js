/// https://mng.workshop.aws

const { Service, Response } = require("./../module.js");

const Debug = (process.env.NODE_ENV !== "production");

/// https://mng.workshop.aws/appconfig/lambda-validator.html
/// Service.config.paramValidation = true;

const Schema = (Properties) => {
    const $ = Properties?.ARN;
    const Tags = Properties.Tags?.filter(($) => !(String($.Key).includes("aws")));

    return {
        "Name": Properties?.Name,
        "Description": Properties?.Description,
        "Creation-Date": Properties?.CreatedDate,
        "Modification-Date": Properties?.LastChangedDate,
        "Access-Date": Properties?.LastAccessedDate,
        "Tags": Tags || Properties?.Tags,

        "ID": $
    };
}

const Empty = () => {
    return Response(JSON.stringify({
        Status: 400,
        Error: "Invalid Parameter Value Assignment",
        Message: "Expected Query Parameter (ID) Key, Value Pair as Input",
    }, null, 4), 400);
};

const Nil = () => {
    return Response(JSON.stringify({
        Status: 400,
        Error: "URL Query Parameter(s) Not Found",
        Message: "Expected Query Parameter(s) (ID) as Input",
    }, null, 4), 400);
};

/***
 *
 * @param request
 * @param validator
 *
 * @returns {{Response, validator}}
 *
 * @constructor
 *
 */

const Deconstruct = (request, validator) => {
    try {
        const Data = request["queryStringParameters"];

        if (!Data) return { validator: { Error: true }, Response: Nil() };

        const Keys = Object.keys(Data);
        const Index = (Keys.indexOf("ID") !== -1) ? Keys.indexOf("ID"): Keys.indexOf("id");

        return { validator, Response: Data[Keys[Index]] };
    } catch (e) {
        validator.Error = true;
        const $ = Response(JSON.stringify({
            Status: 422,
            Error: "Malformed Request",
            Message: "Expected Query Parameter (:id|:ID) as Input",
            Debug: (Debug) ? { Request, request }: null
        }, null, 4), 422)

        return {
            validator, Response: $
        }
    }
}

/***
 *
 * @param identifier {String}
 *
 * @returns {Promise<{Response: {headers: {"X-Deployment-Version": (string|undefined), Server: string, "Content-Type": string}, body, statusCode: number}, validator: {Error: boolean}}|{headers: {"X-Deployment-Version": (string|undefined), Server: string, "Content-Type": string}, body, statusCode: number}>}
 *
 * @constructor
 *
 */

const Query = async (identifier) => {
    if (identifier === "") return { Response: Empty(), validator: { Error: true } };

    try {
        const Secret = await Service.describeSecret({ SecretId: identifier });
        const Model = Schema(Secret);

        return Response(JSON.stringify({ Secret: Model }, null, 4))
    } catch (e) {
        return Response(JSON.stringify({
            Status: 404,
            Error: "Secret Not Found",
            Debug: (Debug) ? { ID: identifier }: null
        }, null, 4), 404);
    }
}

console.log("Loading Function .....");
exports.handler = async (event, context) => {
    let validator = { Error: false };

    console.info("Received Trigger Event" + ":", JSON.stringify(event, null, 4));

    const Data = Deconstruct(event, validator);
    if (Data.validator?.Error === true) return Data.Response;
    const ID = Data.Response;

    const Secret = await Query(ID);
    if (Secret.validator?.Error === true) return Secret.Response;
    return Secret;
}