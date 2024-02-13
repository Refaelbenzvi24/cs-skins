import type { errorCodesMap } from "./index"


export const errorTranslationKeys = {
	"errors:unknown": "E00001",
} satisfies Record<string, keyof typeof errorCodesMap>
