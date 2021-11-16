/*** Company/Development/Google/Operations/Notifications/K8s/Credentials     */
/***    ^         ^        ^       ^            ^         ^      ^           */
/***    0         1        2       3            4         5      6           */

/*** ---> Mapping (Type-A)
 * 0: Organization
 * 1: Environment
 * 2: Context
 * 3: Business-Unit
 * 4: Common-Name or Prefix
 * 5: Service or Distributed System
 * 6: Type
 *
 * Length ::= 7
 *
 */

/// -----

/*** Company/Development/Operations/Notifications/K8s/Credentials   */
/***    ^        ^           ^           ^         ^      ^         */
/***    0        1           2           3         4      5         */

/*** ---> Mapping (Type-B)
 * 0: Organization
 * 1: Environment
 * 2: Business-Unit
 * 3: Common-Name or Prefix
 * 4: Service or Distributed System
 * 5: Type
 *
 * Length ::= 6
 *
 */

/// -----

/*** Company/Development/Operations/Notifications/Credentials   */
/***    ^        ^           ^           ^            ^         */
/***    0        1           2           3            4         */

/*** ---> Mapping (Type-C)
 * 0: Organization
 * 1: Environment
 * 2: Business-Unit
 * 3: Common-Name or Prefix
 * 4: Type
 *
 * Length ::= 5
 *
 */

/// -----

/*** Company/Global/Operations/Unique-Name/Credentials      */
/***    ^      ^        ^           ^          ^            */
/***    0      1        2           3          4            */

/*** ---> Mapping (Type-C)
 * 0: Organization
 * 1: Constant (GLOBAL)
 * 2: Business-Unit
 * 3: Unique-Name
 * 4: Type
 *
 * Length ::= 5
 *
 */

/// --> Enumerations

const Organization = Object.create({});
const Environment = Object.create({});
const Context = Object.create({});

const Unit = Object.create({});
const Prefix = Object.create({});
const Service = Object.create({});
const Type = Object.create({});

/***
 * @param name {String}
 */

module.exports.default = (name) => {
    name = (name.startsWith("/", 0)) ? name.substr(1, name.length) : name;
    name = (name.endsWith("/")) ? name.substr(0, name.length - 1) : name;

    const $ = name.split("/");

    console.debug("[Debug]", "Splitter Length", $.length);

    switch ($.length) {
        case 7: { /// --> Type-A
            return {
                Organization: $[0],
                Environment: $[1],
                Context: $[2],
                Unit: $[3],
                Prefix: $[4],
                Service: $[5],
                Type: $[6]
            }
        }

        case 6: { /// --> Type-B
            return {
                Organization: $[0],
                Environment: $[1],
                Unit: $[2],
                Prefix: $[3],
                Service: $[4],
                Type: $[5]
            }
        }

        case 5: { /// --> Type-[C|D]
            if ($[1] === null) throw Error("Error - Prefix or GLOBAL cannot be nil");
            else if (String($[1]).toUpperCase() === "GLOBAL") return {
                Organization: $[0],
                Environment: "Global",
                Unit: $[2],
                Prefix: $[3],
                Type: $[4],

                Global: true
            }

            return {
                Organization: $[0],
                Environment: $[1],
                Unit: $[2],
                Prefix: $[3],
                Type: $[4]
            }
        }
    }
}

module.exports.Type = {
    Standard: { // ? Multi-Cloud (A)
        "Organization": true,
        "Environment": true,
        "Context": true,
        "Unit": true,
        "Prefix": true,
        "Service": true,
        "Type": true
    },

    Default: { // ? Single-Cloud (B)
        "Organization": true,
        "Environment": true,
        "Unit": true,
        "Prefix": true,
        "Service": true,
        "Type": true
    },

    Common: { // ? Common-Name Specific || Unique (C)
        "Organization": true,
        "Environment": true,
        "Unit": true,
        "Prefix": true,
        "Type": true
    },

    Global: { // ? Global Namespace (D)
        "Organization": true,
        "Environment": true,
        "Unit": true,
        "Prefix": true,
        "Type": true,

        "Global": true
    }
};
