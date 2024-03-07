import type { BuildConnectionStringProps } from "@acme/message-broker"


const {
	      MESSAGE_BROKER_HOST,
	      MESSAGE_BROKER_PORT,
	      MESSAGE_BROKER_USER,
	      MESSAGE_BROKER_PASSWORD,
	      MESSAGE_BROKER_PROTOCOL,
	      MESSAGE_BROKER_PATHNAME
      } = process.env as Record<string, string>

export const messageBrokerConnectionParams = {
	protocol: MESSAGE_BROKER_PROTOCOL,
	user:     MESSAGE_BROKER_USER,
	password: MESSAGE_BROKER_PASSWORD,
	host:     MESSAGE_BROKER_HOST,
	port:     MESSAGE_BROKER_PORT,
	pathname: MESSAGE_BROKER_PATHNAME
} as BuildConnectionStringProps
