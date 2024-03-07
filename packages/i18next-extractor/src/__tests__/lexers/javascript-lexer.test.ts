import { beforeEach, describe, expect, it } from 'vitest'
import { TestContextWithStubs } from "../_types"
import JavascriptLexer from "../../lexers/javascript-lexer"
import { glob } from "glob"
import fs from "fs"


interface JavascriptLexerStub {
	lexer: JavascriptLexer
}

type JavascriptLexerContext = TestContextWithStubs<JavascriptLexerStub>

describe('parser.ts', () => {
	beforeEach<JavascriptLexerContext>((ctx) => {
		ctx.stubs = {
			lexer: new JavascriptLexer()
		}
	})

	describe('class -> JavascriptLexer', () => {
		it<JavascriptLexerContext>('should create instance of Parser', async (ctx) => {
			expect(ctx.stubs.lexer).toBeInstanceOf(JavascriptLexer)
		})

		describe('method -> getLexerName', () => {
			it<JavascriptLexerContext>('should return the lexer name', async (ctx) => {
				const files = await glob(`src/__tests__/stubs/test1.tsx`)
				files.map((file) => {
					const content = fs.readFileSync(file, "utf-8")
					ctx.stubs.lexer.extract(content, file)
				})
			})
		})
	})
})
