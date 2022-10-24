import fs from "fs";
import path from "path";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const parseDiff = require("../src/diff-parser");

test.each(["1.diff"])("parse %s", async (diffFile) => {
  const diffFilePath = path.resolve(__dirname, "..", "data", diffFile);
  const diffContent = fs.readFileSync(diffFilePath).toString();
  expect(parseDiff.default(diffContent)).toMatchSnapshot();
});
