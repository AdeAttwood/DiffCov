import yargs from "yargs";
import fs from "fs";
import type { Options, Arguments } from "yargs";
import { hideBin } from "yargs/helpers";
import exec from "./exec";

import report from "./report";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const parseDiff = require("./diff-parser");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const parseLcov = require("./lcov-parser");

export const error = (message: string) => {
  console.error("[ERROR] " + message);
};

const options: { [key: string]: Options } = {
  coverageFile: {
    default: "./lcov.info",
    description: "The path to the lcov report file",
    type: "string",
  },
};

type Argv = Arguments<
  Partial<{
    coverageFile: string;
  }>
>;

export const validate = async (argv: Argv) => {
  if (!fs.existsSync(argv.coverageFile || "")) {
    return new Error(
      `Lcov file must be a valid file '${argv.coverageFile}' provided. ` +
        `Please ensure you have run tests with coverage enabled.`
    );
  }
};

export const run = async (argv = process.argv) => {
  const parsed: Argv = await yargs(hideBin(argv)).options(options).argv;
  const validationError = await validate(parsed);
  if (validationError instanceof Error) {
    return error(validationError.message);
  }

  const diffText = await exec(`git diff origin/HEAD...HEAD`);
  if (diffText.code > 0) {
    return error("Error loading the diff\n\n" + diffText.stderr);
  }

  const diff = parseDiff.default(diffText.stdout);
  const coverage = await parseLcov.default(parsed.coverageFile);

  report(diff, coverage);
};
