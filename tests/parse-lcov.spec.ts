import fs from "fs";
import path from "path";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const parseLcov = require("../src/lcov-parser");

test.each(["1.lcov.info"])("parse %s", async (lcovFile) => {
  const lcovFilePath = path.resolve(__dirname, "..", "data", lcovFile);
  const lcovContent = fs.readFileSync(lcovFilePath).toString();
  expect(await parseLcov.default(lcovContent)).toMatchSnapshot();
});
