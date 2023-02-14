import { Test, run } from "beater";
import { fixture } from "beater-helpers/fixture.js";

const test = (name: string, fn: Test): Test => {
  Object.defineProperty(fn, "name", { value: name });
  return fn;
};

export { Test, fixture, run, test };
