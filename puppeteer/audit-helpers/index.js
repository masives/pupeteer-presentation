const parseCoverage = coverage => {
  const usedBytes = coverage.ranges.map(range => range.end - range.start).reduce((a, b) => a + b, 0);
  const totalBytes = coverage.text.length;

  return {
    url: coverage.url,
    usedBytes,
    totalBytes,
    unusedBytes: totalBytes - usedBytes,
    unusedBytesPercentage: (totalBytes - usedBytes) / totalBytes,
  };
};
const sortCoverage = (a, b) => a.unusedBytes < b.unusedBytes;

const sumTotals = (acc, curr) => {
  return {
    unusedBytes: acc.unusedBytes + curr.unusedBytes,
    totalBytes: acc.totalBytes + curr.totalBytes,
  };
};

module.exports = {
  parseCoverage,
  sortCoverage,
  sumTotals,
};
