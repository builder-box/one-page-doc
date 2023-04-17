import { Config } from "@jest/types"
import { defaults as tsjPreset } from "ts-jest/presets"

export default {
  verbose: true,
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.(spec|test).[jt]s?(x)"],
  testPathIgnorePatterns: ["/node_modules/"],
  coverageDirectory: ".coverage",
  coveragePathIgnorePatterns: ["/node_modules/", "/types/"],
  coverageReporters: ["json", "text", "lcov"],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  collectCoverageFrom: ["./src/**/*.ts"],
  moduleFileExtensions: ["js", "json", "ts"],
  transform: {
    ...tsjPreset.transform,
    "^.+\\.tsx?$": [
      "ts-jest",
      { disableSourceMapSupport: true, tsconfig: "<rootDir>/tsconfig.json" },
    ],
  },
  transformIgnorePatterns: ["/node_modules/"],
  modulePathIgnorePatterns: ["fixtures"],
} as Config.InitialOptions
