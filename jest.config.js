module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/test/**/*.test.ts"],
  setupFilesAfterEnv: ["./test/setup.ts"],
  verbose: true,
};
