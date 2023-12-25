import type {Config} from "@jest/types"

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
