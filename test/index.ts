import { tests as emarsysTests } from "./emarsys.js";
import { Test, run } from "./helper.js";
import { tests as standardTests } from "./standard.js";

const tests = ([] as Test[]).concat(emarsysTests).concat(standardTests);

run(tests).catch(() => process.exit(1));
