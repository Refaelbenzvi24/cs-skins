import { describe, expect, it } from 'vitest'
import { extract } from '../extract'


describe('extract.ts', () => {
	describe('function -> extract', () => {
		it('should return correct value for stub file text1.tsx', async () => {
			const results = await extract({ searchPattern: "./src/__tests__/stubs/test1.tsx", ignore: ['node_modules'] })
			console.log({ results })
		})
	})
})
