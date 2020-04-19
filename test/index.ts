import { tests as emarsysTests } from "./emarsys";
import { Test, run } from "./helper";
import { tests as standardTests } from "./standard";

const tests = ([] as Test[]).concat(emarsysTests).concat(standardTests);

run(tests).catch(() => process.exit(1));
