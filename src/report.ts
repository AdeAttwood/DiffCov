const getCoverageForFile = (file: any, coverage: any) => {
  for (const cov of coverage) {
    const report: { [k: number]: number } = {};
    if (cov.file === file.to) {
      for (const detail of cov.lines.details) {
        report[detail.line] = detail.hit;
      }

      for (const detail of cov.functions.details) {
        if (!report[detail.line]) {
          report[detail.line] = detail.hit;
        }
      }

      return report;
    }
  }
};

interface Change {
  type: string;
  ln: number;
  ln2: number;
  content: string;
}

interface Chunk {
  content: string;
  changes: Change[];
}

interface Diff {
  to: string;
  chunks: Chunk[];
}

export const printReport = (diff: Diff[], coverage: any) => {
  const report = { total: 0, covered: 0 };

  for (const file of diff) {
    const fileCoverage = getCoverageForFile(file, coverage);
    if (typeof fileCoverage === "undefined") {
      continue;
    }

    console.log();
    console.log(file.to);

    for (const chunk of file.chunks) {
      console.log();
      console.log(chunk.content);
      console.log();
      for (const change of chunk.changes) {
        if (change.type === "del") {
          continue;
        }
        const line = change.ln || change.ln2;
        let color = "\x1b[0m";
        if (typeof fileCoverage[line] !== "undefined") {
          color = fileCoverage[line] > 0 ? "\x1b[32m" : "\x1b[31m";

          report.total++;
          if (fileCoverage[line] > 0) {
            report.covered++;
          }
        }

        console.log(line.toString().padStart(4, " "), color, change.content.substring(1), "\x1b[0m");
      }
    }
  }

  const percentage = (report.covered / report.total) * 100;
  const color = percentage > 90 ? "\x1b[32m" : "\x1b[31m";

  console.log("");
  console.log("Total Lines:        ", report.total.toString());
  console.log("Lines Covered:      ", report.covered.toString());
  console.log("Coverage Percentage", color, percentage.toString() + "%", "\x1b[0m");

  return report;
};

export default printReport;
