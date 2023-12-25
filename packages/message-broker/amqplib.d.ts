import {
	MessagePropertyHeaders as OriginalMessagePropertyHeaders, Publish as OriginalPublish
} from "amqplib/properties"
import { servicesMap } from "@acme/logger"

export interface MessageHeaders {
	[key: string | number | symbol]: any
	initializedAtService: typeof servicesMap[number]["name"]
	systemProcessId: string
	userID?: string
	sentByUser: "system" | "public" | "user"
}

declare module "@types/amqplib/properties" {
	export interface MessagePropertyHeaders extends OriginalMessagePropertyHeaders, MessageHeaders {
	}
}
