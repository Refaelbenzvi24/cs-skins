import logger from "@acme/logger"
import { buildErrorCodesMapObject } from "@acme/logger"


const errorCodesMap = {
	E00001: buildErrorCodesMapObject({ severity: "ERROR", type: "MessageBroker", subName: "SendingMessage" }),
	E00002: buildErrorCodesMapObject({ severity: "ERROR", type: "MessageBroker", subName: "MessageConsuming" }),
	E00003: buildErrorCodesMapObject({ severity: "ERROR", type: "MessageBroker", subName: "AssertingQueue" }),
	E00004: buildErrorCodesMapObject({ severity: "ERROR", type: "MessageBroker", subName: "AssertingQueue" }),
	E00005: buildErrorCodesMapObject({ severity: "ERROR", type: "MessageBroker", subName: "Connection" }),
	E00006: buildErrorCodesMapObject({ severity: "ERROR", type: "MessageBroker", subName: "Connection" }),
	E00007: buildErrorCodesMapObject({ severity: "ERROR", type: "MessageBroker", subName: "ChannelCreation" }),
	E00008: buildErrorCodesMapObject({ severity: "ERROR", type: "MessageBroker", subName: "ChannelCreation" }),
	E00009: buildErrorCodesMapObject({ severity: "ERROR", type: "MessageBroker", subName: "ChannelCreation" }),
	E00010: buildErrorCodesMapObject({ severity: "ERROR", type: "MessageBroker", subName: "PurgingQueue" }),
} as const

export const errorTranslationKeys = {
	"errors:messageBroker.producer.publish.unknown":       "E00001",
	"errors:messageBroker.consumer.consume.unknown":       "E00002",
	"errors:messageBroker.producer.assertQueue.unknown":   "E00003",
	"errors:messageBroker.consumer.assertQueue.unknown":   "E00004",
	"errors:messageBroker.consumer.connect.unknown":       "E00005",
	"errors:messageBroker.producer.connect.unknown":       "E00006",
	"errors:messageBroker.producer.createChannel.unknown": "E00007",
	"errors:messageBroker.consumer.createChannel.unknown": "E00008",
	"errors:messageBroker.producer.purgeQueue.unknown":    "E00009",
	"errors:messageBroker.consumer.purgeQueue.unknown":    "E00010",
} satisfies Record<string, keyof typeof errorCodesMap>

export const loggerInstance = logger.createInstance(errorCodesMap, errorTranslationKeys)

// TODO: consider removing this...
