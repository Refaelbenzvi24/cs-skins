import type { errorCodesMap } from "./index"


export const errorTranslationKeys = {
	"errors:unknown":                 "E00001",
	"errors:skins.notFound":          "E00002",
	"errors:sources.notFound":        "E00003",
	"errors:qualities.notFound":      "E00004",
	"errors:csGoStash.skin.notFound": "E00005",
	"errors:weapons.insert.failure":  "E00006",
} satisfies Record<string, keyof typeof errorCodesMap>
