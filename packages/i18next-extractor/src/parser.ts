import path from 'path'
import EventEmitter from 'events'
import HandlebarsLexer from './lexers/handlebars-lexer.js'
import HTMLLexer from './lexers/html-lexer.js'
import JavascriptLexer from './lexers/javascript-lexer.js'
import JsxLexer from './lexers/jsx-lexer.js'
import VueLexer from './lexers/vue-lexer.js'


type LexersKeys =
	'mjs' |
	'js' |
	'ts' |
	'default'
	// 'hbs' |
	// 'handlebars' |
	// 'htm' |
	// 'html' |
	// 'jsx' |
	// 'tsx' |
	// 'vue' |

// TODO: change the type of (typeof JavascriptLexer) to something more generic which can be used for all lexers
type LexerConfigItem = keyof typeof lexersMap | (typeof JavascriptLexer) | { lexer: keyof typeof lexersMap, [key: string]: any }

const lexersMap = {
	// HandlebarsLexer,
	// HTMLLexer,
	JavascriptLexer,
	// JsxLexer,
	// VueLexer,
} as const

type Lexers = Record<LexersKeys, LexerConfigItem[]>

const lexers = {
	// hbs:        ['HandlebarsLexer'],
	// handlebars: ['HandlebarsLexer'],
	// htm:        ['HTMLLexer'],
	// html:       ['HTMLLexer'],
	mjs: ['JavascriptLexer'],
	js:  ['JavascriptLexer'],
	ts:  ['JavascriptLexer'],
	// jsx:        ['JsxLexer'],
	// tsx:        ['JsxLexer'],
	// vue:        ['VueLexer'],
	default: ['JavascriptLexer']
} satisfies Lexers

interface EventEmitterOptions {
	captureRejections?: boolean | undefined;
}

interface ParserOptions extends EventEmitterOptions {
	lexers?: Partial<Lexers>
}

export default class Parser extends EventEmitter {
	private options: ParserOptions
	private readonly lexers: Lexers

	constructor(options: ParserOptions = {}){
		super(options)
		this.options = options
		this.lexers  = { ...lexers, ...options.lexers }
	}

	private getLexerName(lexer: LexerConfigItem){
		if(typeof lexer === 'string' || typeof lexer === 'function') return lexer
		return lexer.lexer
	}

	private getLexerConfig(lexer: LexerConfigItem){
		if(typeof lexer === 'string' || typeof lexer === 'function') return {}
		return lexer
	}

	private getLexerByName(lexerName: ReturnType<Parser['getLexerName']>){
		if(typeof lexerName === 'function'){
			return lexerName
		} else {
			if(!lexersMap[lexerName]){
				this.emit('error', new Error(`Lexer '${lexerName}' does not exist`))
			}

			return lexersMap[lexerName]
		}
	}

	parse(content: string, filename: string){
		// TODO: stop using substr - deprecated
		const extension = path.extname(filename).substr(1) as LexersKeys | undefined // should be string not undefined
		const lexers    = (extension && extension in this.lexers) ? this.lexers[extension] : this.lexers.default

		return lexers.map((lexerConfig) => {
			const lexerName    = this.getLexerName(lexerConfig)
			const lexerOptions = this.getLexerConfig(lexerConfig)
			const Lexer        = this.getLexerByName(lexerName)
			const lexer        = new Lexer(lexerOptions)
			lexer.on('warning', (warning) => this.emit('warning', warning))
			return lexer.extract(content, filename)
		})
	}
}
