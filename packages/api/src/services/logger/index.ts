import logger, { buildErrorCodesMapObject } from "@acme/logger"

const errorCodesMap = {
	E00001: buildErrorCodesMapObject({ severity: "ERROR", name: "DatabaseError" }),
	E00002: buildErrorCodesMapObject({ severity: "ERROR", name: "DatabaseError" }),
	E00003: buildErrorCodesMapObject({ severity: "ERROR", name: "DatabaseError" }),
	E00004: buildErrorCodesMapObject({ severity: "ERROR", name: "DatabaseError" }),
	E00005: buildErrorCodesMapObject({ severity: "ERROR", name: "MessageBroker", subName: "SendingMessage" })
} as const

export const errorTranslationKeys = {
	"errors:skinsQualitiesData.databaseError.getByIdWithDataForChart.failedToSearch": "E00001",
	"errors:skins.databaseError.list.failedToSearch":                                 "E00002",
	"errors:skinsQualitiesData.databaseError.getByIdWithData.failedToSearch":         "E00003",
	"errors:skins.databaseError.getById.failedToSearch":                              "E00004",
	"errors:skins.create.failedSendingMessage":                                       "E00005",
} satisfies Record<string, keyof typeof errorCodesMap>

export const newError = logger.errorBuilder(
	errorCodesMap, errorTranslationKeys
)({loggedAtService: "nextjs", initializedAtService: "nextjs"})
