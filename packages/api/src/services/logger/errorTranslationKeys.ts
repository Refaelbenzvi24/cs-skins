import type { errorCodesMap } from "./index"


export const errorTranslationKeys = {
	"errors:authenticationError":                                                     "E00001",
	"errors:authorizationError":                                                      "E00002",
	"errors:permissionsError":                                                        "E00003",
	"errors:unknownError":                                                            "E00004"
} satisfies Record<string, keyof typeof errorCodesMap>
