import { beforeEach, describe, expect, it } from 'vitest'
import Parser from '../parser'
import { TestContextWithStubs } from "./_types"


interface ParserStub {
	parser: Parser
}

type ParserContext = TestContextWithStubs<ParserStub>

describe('parser.ts', () => {
	beforeEach<ParserContext>((ctx) => {
		ctx.stubs = {
			parser: new Parser()
		}
	})

	describe('class -> Parser', () => {
		it<ParserContext>('should create instance of Parser', async (ctx) => {
			expect(ctx.stubs.parser).toBeInstanceOf(Parser)
		})

		describe('method -> getLexerName', () => {
			it<ParserContext>('should return the lexer name', async (ctx) => {
				const lexer  = ctx.stubs.parser['getLexerName']('JavascriptLexer')
				expect(lexer).toBe('JavascriptLexer')
			})
		})

		describe('method -> getLexerConfig', () => {
			it<ParserContext>('should return empty lexer config', async (ctx) => {
				const lexer  = ctx.stubs.parser['getLexerConfig']('JavascriptLexer')
				expect(lexer).toEqual({})
			})
		})
	})
})
