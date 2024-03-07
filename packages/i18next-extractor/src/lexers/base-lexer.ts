import EventEmitter from 'events'

export interface BaseLexerOptions {
	functions?: string[]
}

export default class BaseLexer extends EventEmitter {
	functions: string[]
	keys: string[]
	constructor(options: BaseLexerOptions = {}){
		super()
		this.keys      = []
		this.functions = options.functions || ['t']
	}

	validateString(string: string){
		const regex = new RegExp('^' + BaseLexer.stringPattern + '$', 'i')
		return regex.test(string)
	}

	functionPattern(){
		return '(?:' + this.functions.join('|').replace('.', '\\.') + ')'
	}

	static get singleQuotePattern(){
		return "'(?:[^'].*?[^\\\\])?'"
	}

	static get doubleQuotePattern(){
		return '"(?:[^"].*?[^\\\\])?"'
	}

	static get backQuotePattern(){
		return '`(?:[^`].*?[^\\\\])?`'
	}

	static get variablePattern(){
		return '(?:[A-Z0-9_.-]+)'
	}

	static get stringPattern(){
		return (
			'(?:' +
			[BaseLexer.singleQuotePattern, BaseLexer.doubleQuotePattern].join('|') +
			')'
		)
	}

	static get stringOrVariablePattern(){
		return (
			'(?:' +
			[
				BaseLexer.singleQuotePattern,
				BaseLexer.doubleQuotePattern,
				BaseLexer.variablePattern,
			].join('|') +
			')'
		)
	}
}
