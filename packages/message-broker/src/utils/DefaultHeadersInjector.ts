import type { MessageHeaders } from "../../amqplib"

type PartialMessageHeaders = Partial<MessageHeaders>

type MessageHeadersGetter = () => PartialMessageHeaders | Promise<PartialMessageHeaders>

export default class DefaultHeadersInjector {
	private static headersGetter: MessageHeadersGetter = async () => ({})

	static async getHeaders() {
		return DefaultHeadersInjector.headersGetter()
	}

	static setHeaders(headersGetter: MessageHeadersGetter) {
		DefaultHeadersInjector.headersGetter = headersGetter
	}
}
