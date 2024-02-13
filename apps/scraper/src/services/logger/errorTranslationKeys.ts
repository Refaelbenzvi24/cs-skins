import type { errorCodesMap } from "./index"


export const errorTranslationKeys = {
	"errors:unknown":        "E00001",
	"errors:skins.notFound": "E00002",
	"errors:sources.notFound": "E00003",
} satisfies Record<string, keyof typeof errorCodesMap>
