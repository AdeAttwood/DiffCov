import yargs from "yargs";
import fs from "fs";
import type { Options, Arguments } from "yargs";
import { hideBin } from "yargs/helpers";
import exec from "./exec";

import report from "./report";
import lcovDiff from "./lcov-diff";

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
  compare: {
    description: "The path to the lcov report you wish to compare to the `coverage-file`",
    type: "string",
  },
};

type Argv = Arguments<
  Partial<{
    coverageFile: string;
    compare?: string;
  }>
>;

export const validate = async (argv: Argv) => {
  if (!fs.existsSync(argv.coverageFile || "")) {
    return new Error(
      `Lcov file must be a valid file '${argv.coverageFile}' provided. ` +
        `Please ensure you have run tests with coverage enabled.`
    );
  }

  if (argv.compare && !fs.existsSync(argv.compare)) {
    return new Error(`Lcov compare file must be a valid file '${argv.compare}' provided.`);
  }
};

export const run = async (argv = process.argv) => {
  const parsed: Argv = await yargs(hideBin(argv)).options(options).argv;
  const validationError = await validate(parsed);
  if (validationError instanceof Error) {
    return error(validationError.message);
  }

  const baseCoverage = await parseLcov.default(parsed.coverageFile);

  if (parsed.compare) {
    const compareCoverage = await parseLcov.default(parsed.compare);
    return lcovDiff(baseCoverage, compareCoverage);
  }

  const diffText = await exec(`git diff origin/HEAD...HEAD`);
  if (diffText.code > 0) {
    return error("Error loading the diff\n\n" + diffText.stderr);
  }

  const diff = parseDiff.default(diffText.stdout);

  const { percentage } = report(diff, baseCoverage);
  process.exit(percentage > 90 ? 0 : 1);
};
