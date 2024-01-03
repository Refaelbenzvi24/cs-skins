import errorCodesMap from "./errorCodesMap"


export const errorTranslationKeys = {
	"errors:unknownError":                                                            "E00001",
	"errors:validationError":                                                         "E00002",
	"errors:authenticationError":                                                     "E00003",
	"errors:authorizationError":                                                      "E00004",
	"errors:dataBaseError":                                                           "E00005",
	"errors:permissionsError":                                                        "E00006"
} satisfies Record<string, keyof typeof errorCodesMap>
