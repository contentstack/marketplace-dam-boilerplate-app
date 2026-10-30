module.exports = {
  testEnvironment: "node",
  collectCoverageFrom: ["src/**/*.js"],
  // ratchet target 90 — MKT-20047 (measured floor: lines 20.7, branches 26.8). The ops/ scripts
  // and the zip/upload steps need real accounts or a build and are not unit tested here.
  coverageThreshold: { global: { lines: 20, branches: 26 } },
};
