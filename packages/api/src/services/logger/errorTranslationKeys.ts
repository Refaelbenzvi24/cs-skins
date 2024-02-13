import type { errorCodesMap } from "./index"


export const errorTranslationKeys = {
	"errors:unknown":          "E00001",
	"errors:authenticationError":   "E00002",
	"errors:authorizationError":    "E00003",
	"errors:permissionsError":      "E00004",
	"errors:weapons.list.notFound": "E00005",
} satisfies Record<string, keyof typeof errorCodesMap>
