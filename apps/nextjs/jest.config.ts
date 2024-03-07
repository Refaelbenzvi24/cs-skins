import type { Config } from "@jest/types"
// import nextJest from "next/jest"

// const createJestConfig = nextJest({
// 	// Provide the path to your Next.js app to load next.config.js and .env files in your test environment
// 	dir: "./",
// })

const jestConfig = (): Config.InitialOptions => ({
	preset: 'ts-jest',

	globals: {
		'ts-jest': {
			tsconfig: 'tsconfig.test.json',
		},
	},

	// Automatically clear mock calls and instances between every test
	clearMocks: true,

	// A list of paths to modules that run some code to configure or set up the testing framework before each test
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

	moduleNameMapper: {
		'src/(.*)': '<rootDir>/src/$1',
	},
})

export default jestConfig
