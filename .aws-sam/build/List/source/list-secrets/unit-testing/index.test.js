// Import all functions from put-item.js
const lambda = require("../../../src/index.js");

// This includes all tests for putItemHandler() 
describe("Test ...", function () {
    let $;

    // Test one-time setup and teardown, see more in https://jestjs.io/docs/en/setup-teardown 
    beforeAll(() => {
        // Mock dynamodb get and put methods 
        // https://jestjs.io/docs/en/jest-object.html#jestspyonobject-methodname 
        /// $ = jest ...
    });

    // Clean up mocks 
    afterAll(() => {
        $.mockRestore();
    });

    // This test invokes putItemHandler() and compare the result
    it("should add id to the table", async () => {
        // Compare the result with the expected result
        /// expect(result).toEqual(expectedResult);
    });
});
