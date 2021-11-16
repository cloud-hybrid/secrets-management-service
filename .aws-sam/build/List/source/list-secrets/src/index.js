/// import { Service, Response } from "./../module.js";

const { Service, Response } = require("./../module.js");

const Schema = (Properties) => {
    const Tags = Properties.Tags?.filter(($) => !(String($.Key).includes("aws")));

    return {
        "Name": Properties?.Name,
        "Description": Properties?.Description,
        "Creation-Date": Properties?.CreatedDate,
        "Modification-Date": Properties?.LastChangedDate,
        "Access-Date": Properties?.LastAccessedDate,
        "Tags": Tags || Properties?.Tags
    };
}

console.log("Loading Function .....");
/// export default async (event) => {
module.exports.handler = async (event) => {
    console.info("Received Trigger Event" + ":", JSON.stringify(event, null, 4));

    const Container = [];

    let $ = await Service.listSecrets({MaxResults: 20, SortOrder: "asc", Filters: null, NextToken: null});

    while ($.NextToken) {
        $.SecretList.forEach((Secret) => {
            const Instance = Schema(Secret);
            Container.push(Instance);
        })

        const Token = $?.NextToken;
        if (Token === undefined) break;

        $ = await Service.listSecrets({
            SortOrder: "asc",
            Filters: null,
            NextToken: Token
        });
    }

    console.info("Secrets-List" + ":", Container);

    const Body = JSON.stringify({ Secrets: Container }, null, 4);

    console.info("Data" + ":", Body);

    return Response(Body);
}
