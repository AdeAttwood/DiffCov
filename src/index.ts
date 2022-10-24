import yargs from "yargs";
import type { Options } from "yargs";
import { hideBin } from "yargs/helpers";
import exec from "./exec";

import report from "./report";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const parseDiff = require("./diff-parser");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const parseLcov = require("./lcov-parser");

export const error = (message: string) => {
  console.error(message);
};

const options: { [key: string]: Options } = {
  coverageFile: {
    default: "./lcov.info",
    description: "The path to the lcov report file",
    type: "string",
  },
};

export const run = async (argv = process.argv) => {
  const parsed: any = yargs(hideBin(argv)).options(options).argv;

  const diffText = await exec(`git diff origin/HEAD...HEAD`);
  if (diffText.code > 0) {
    return error("Error loading the diff\n\n" + diffText.stderr);
  }

  const diff = parseDiff.default(diffText.stdout);
  const coverage = await parseLcov.default(parsed.coverageFile);

  report(diff, coverage);
};
