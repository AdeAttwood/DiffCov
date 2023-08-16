const buildCoverageSet = (report: any) => {
  const set = new Set<string>();
  for (const coverage of report) {
    for (const detail of coverage.lines.details) {
      if (detail.hit > 0) {
        set.add(`${coverage.file}:${detail.line}`);
      }
    }
  }

  return set;
};

function setDiff<T>(a: Set<T>, b: Set<T>) {
  return new Set([...a].filter((x) => !b.has(x)));
}

export const lcovDiff = async (baseCoverage: any, compareCoverage: any) => {
  const baseSet = buildCoverageSet(baseCoverage);
  const compareSet = buildCoverageSet(compareCoverage);

  const map = new Map<string, number>();

  const added = setDiff(baseSet, compareSet);
  for (const key of added) {
    map.set(key, 1);
  }

  const removed = setDiff(compareSet, baseSet);
  for (const key of removed) {
    map.set(key, 0);
  }

  for (const [key, value] of [...map.entries()].sort()) {
    const color = value > 0 ? "\x1b[32m" : "\x1b[31m";
    console.log(color, key, "\x1b[0m");
  }
};

export default lcovDiff;
