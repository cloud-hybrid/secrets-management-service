const { Service, Response } = require("./../module.js");

const Debug = (process.env.NODE_ENV !== "production");

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

const Malformation = () => {
    return Response(JSON.stringify({
        Status: 422,
        Error: "Malformed Request, nil Parameter Assignment(s)",
        Message: "Expected Query Parameter (ID) as Input, with String as Assignment",
    }, null, 4), 422)
};

const Query = async (identifier) => {
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

console.log("Loading Function ...");
exports.handler = async (event, context) => {
    console.trace("[Trace] Invocation Context" + ":", JSON.stringify(context));

    const Data = event["queryStringParameters"];
    console.log("[Log] Query-String Parameters" + ":", Data);

    if (!Data) return Nil();

    const Keys = Object.keys(Data);
    console.debug("[Debug] Parameter Key(s)" + ":", Keys);

    if (Keys.length === 0) return Empty();

    const Index = (Keys.indexOf("ID") !== -1) ? Keys.indexOf("ID"): Keys.indexOf("id");
    console.debug("[Debug] Parameter ID Index" + ":", Index);

    if (Index === -1) return Malformation();

    const ID = Data[Keys[Index]];
    console.debug("[Debug] Parameter ID Assignment" + ":", ID);

    if (ID === "") return Malformation();

    return await Query(ID);
}