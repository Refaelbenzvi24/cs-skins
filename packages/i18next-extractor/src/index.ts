import type { ExtractConfig } from "./extract";
import { extract } from "./extract"
import { transform } from "./transformer"


interface Config {
	extractConfig: ExtractConfig
}

const getTranslationsObject = async ({ extractConfig }: Config) => {
	const results            = await extract(extractConfig)
	return transform(results)
}


export { getTranslationsObject, extract, transform }
