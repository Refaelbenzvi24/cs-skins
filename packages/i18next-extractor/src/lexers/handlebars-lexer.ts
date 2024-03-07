import BaseLexer, { BaseLexerOptions } from './base-lexer.js'


export interface HandlebarsLexerOptions extends BaseLexerOptions {
}

export default class HandlebarsLexer extends BaseLexer {
	functionRegex: RegExp
	argumentsRegex: RegExp

	constructor(options: HandlebarsLexerOptions = {}){
		super(options)
		this.functions = options.functions || ['t']

		this.functionRegex  = this.getFunctionRegex()
		this.argumentsRegex = this.getArgumentsRegex()
	}

	extract(content: string){
		let matches

		while ((matches = this.functionRegex.exec(content))) {
			const args = this.parseArguments(matches[1] || matches[2])
			this.populateKeysFromArguments(args)
		}

		return this.keys
	}

	// TODO: check usage and add types accordingly
	parseArguments(args){
		let matches
		const result = {
			arguments: [],
			options:   {},
		}
		while ((matches = this.argumentsRegex.exec(args))) {
			const arg   = matches[1]!
			const parts = arg.split('=')
			result.arguments.push(arg)
			if(parts.length === 2 && this.validateString(parts[1])){
				const value = parts[1].slice(1, -1)
				if(value === 'true'){
					result.options[parts[0]] = true
				} else if(value === 'false'){
					result.options[parts[0]] = false
				} else {
					result.options[parts[0]] = value
				}
			}
		}
		return result
	}

	// TODO: check usage and add types accordingly
	populateKeysFromArguments(args){
		const firstArgument        = args.arguments[0]
		const secondArgument       = args.arguments[1]
		const isKeyString          = this.validateString(firstArgument)
		const isDefaultValueString = this.validateString(secondArgument)

		if(!isKeyString){
			this.emit('warning', `Key is not a string literal: ${firstArgument}`)
		} else {
			const result = {
				...args.options,
				key: firstArgument.slice(1, -1),
			}
			if(isDefaultValueString){
				result.defaultValue = secondArgument.slice(1, -1)
			}
			this.keys.push(result)
		}
	}

	getFunctionRegex(){
		const functionPattern    = this.functionPattern()
		const curlyPattern       = '(?:{{)' + functionPattern + '\\s+(.*?)(?:}})'
		const parenthesisPattern = '(?:\\()' + functionPattern + '\\s+(.*)(?:\\))'
		const pattern            = curlyPattern + '|' + parenthesisPattern
		return new RegExp(pattern, 'gi')
	}

	getArgumentsRegex(){
		const pattern =
			      '(?:\\s+|^)' +
			      '(' +
			      '(?:' +
			      BaseLexer.variablePattern +
			      '(?:=' +
			      BaseLexer.stringOrVariablePattern +
			      ')?' +
			      ')' +
			      '|' +
			      BaseLexer.stringPattern +
			      ')'
		return new RegExp(pattern, 'gi')
	}
}
