import { glob } from "glob"
import fs from "fs"


const transformAndParseStringifiedArray = (stringifiedArray: string) => {
	const regexPatternKeys   = /(\b\w+\b):/g;
	const correctedKeys      = stringifiedArray.replace(regexPatternKeys, '"$1":');
	const regexPatternCommas = /,(\s*[}\]])/g;
	const correctedString    = correctedKeys.replace(regexPatternCommas, '$1');
	try {
		return JSON.parse(correctedString) as { key: string, display: string }[];
	} catch (error) {
		console.error('Error parsing fixed string:', error);
		return null;
	}
}

const getTranslationPrefixResults = (fileContent: string) => {
	const regex   = /translationPrefix={"([^"]*)"}/g;
	const matches = fileContent.match(regex)
	if(matches){
		return [matches.map(match => {
			const prefix      = match.replace(/translationPrefix={(["'])/, '').replace(/(["'])}/, '')
			const headersText = /headers={\[((?:.|\n|\r)*)\]}/g
			const headers     = fileContent.match(headersText)
			if(headers){
				return [headers.map(header => {
					const withoutSpacesAndNewLines = header.replace(/\s/g, '')
					const withoutPrefix            = withoutSpacesAndNewLines.replace('headers={', '').replace(']}', ']')
					const parsedHeaders            = transformAndParseStringifiedArray(withoutPrefix)
					if(parsedHeaders){
						return parsedHeaders.map(({ key }) => `${prefix}${key}`)
					}
				})].flat(Infinity)
			}
		})].flat(Infinity)
	}
	return []
}

const getTemplateLiterals = (templateLiteral: string, fileContent: string) => {
	const regex   = /\$\{([^}]+)\}/g;
	const matches = templateLiteral.match(regex)
	return [matches?.map(match => match.replace(/\$\{([^}]+)\}/, '$1'))]
	.flat(Infinity)
	.filter(Boolean)
	.reduce((acc, match) => {
		if(match){
			return {
				...acc,
				[match as string]: extractVariableFromFileContent(fileContent, match as string)[0]
			}
		}

		return acc
	}, {})
}

const replaceTemplateLiterals = (fileContent: string, templateLiteral: string) => {
	const templateLiterals = getTemplateLiterals(templateLiteral, fileContent)
	return Object.keys(templateLiterals).reduce((acc, key) => {
		const regex = new RegExp(`\\$\\{${key}\\}`, 'g');
		return acc.replace(regex, templateLiterals[key as keyof typeof templateLiterals])
	}, templateLiteral)
}

const getTFunctionTemplateLiterals = (fileContent: string) => {
	const regex   = /(?<![a-zA-Z0-9])t\(([`][^\)]*?)\)/g;
	const matches = fileContent.match(regex)
	return [matches?.map(match => match.replace(/t\(`([^`]*)`\)/, '$1'))]
	.flat(Infinity)
	.filter(Boolean)
	.map((match) => {
		if(match) return replaceTemplateLiterals(fileContent, match as string)
	})
	.filter(Boolean);
}

const getTFunctionConstVariablesResults = (fileContent: string) => {
	const regex   = /(?<![a-zA-Z0-9])t\(([^'"`][^\)]*?)\)/g;
	const matches = fileContent.match(regex)
	return [matches?.map(match => match.replace(/t\(([^'"\)]+)\)/, '$1'))]
	.flat(Infinity)
	.filter(Boolean)
	.map((match) => {
		if(match) return extractVariableFromFileContent(fileContent, match as string)
	})
	.filter(Boolean);
}

const extractVariableFromFileContent = (fileContent: string, variableName: string) => {
	// TODO: search in closest scope to the extracted variable=
	const regex   = new RegExp(`(?<![a-zA-Z0-9])${variableName}\\s+=\\s+['"]([^'"]+)['"]`, 'g');
	const matches = fileContent.match(regex)
	return [matches?.map(match => match.replace(new RegExp(`${variableName}\\s+=\\s+['"]([^'"]+)['"]`), '$1'))]
	.flat(Infinity)
	.filter(Boolean)
}

const getTFunctionStrings = (fileContent: string) => {
	const regex   = /(?<![a-zA-Z0-9])t\((['"])(.*?)\1\)/g;
	const matches = fileContent.match(regex)
	return [matches?.map(match => match.replace(/t\((['"])(.*?)\1\)/, '$2'))]
	.flat(Infinity)
	.filter(Boolean);
}

export interface ExtractConfig {
	searchPattern: string
	ignore?: string[]
	extractionFunctions?: ((fileContent: string) => string[])[]
}

export const extract = async ({ searchPattern, ignore = [], extractionFunctions }: ExtractConfig) => {
	const files          = await glob(searchPattern, { ignore })
	const results        = files.map((file) => {
		const fileContent                    = fs.readFileSync(file, 'utf8');
		const tFunctionResults               = getTFunctionStrings(fileContent)
		const tFunctionConstVariablesResults = getTFunctionConstVariablesResults(fileContent)
		const tFunctionTemplateLiterals      = getTFunctionTemplateLiterals(fileContent)
		const additionalExtractions          = [extractionFunctions?.map((func) => func(fileContent))].flat(Infinity)
		return [...tFunctionResults, ...tFunctionConstVariablesResults, ...tFunctionTemplateLiterals, ...additionalExtractions]
	})
	const flattenResults = results.flat(Infinity).filter(Boolean) as string[]
	return Array.from(new Set(flattenResults))
}
