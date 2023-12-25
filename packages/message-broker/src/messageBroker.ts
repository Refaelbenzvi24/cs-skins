import * as amqplib from "amqplib";
import type { Channel, Connection, ConsumeMessage, Options } from "amqplib";
import type { Replies } from "amqplib/properties";

import { buildConnectionString, type BuildConnectionStringProps } from "./connectionUtils";
import { MessageBrokerPayloads, QueueNames } from "./types"
import { createId } from "@paralleldrive/cuid2"
import MessageLocalStorage from "./ConsumedMessageLocalStorage"
import DefaultHeadersInjector from "./utils/DefaultHeadersInjector"


export class Producer {
	static connection: Connection;
	static channel: Channel;
	queue: Replies.AssertQueue | undefined;
	queueName: QueueNames;
	options?: Options.AssertQueue;

	constructor(queueName: QueueNames, options?: Options.AssertQueue) {
		this.queueName = queueName
		this.options = options
	}

	async initializeProducer(connectionParameters: BuildConnectionStringProps) {
		if (!Producer.connection) {
			const connectionString = buildConnectionString (connectionParameters)
			Producer.connection = await amqplib.connect (connectionString);
		}
		if (!Producer.channel) Producer.channel = await Producer.connection.createChannel ();

		this.queue = await Producer.channel.assertQueue (this.queueName, this.options);
	}

	async purgeQueue() {
		return await Producer.channel.purgeQueue (this.queueName)
	}

	async sendMessage(message: MessageBrokerPayloads, options?: Options.Publish) {
		const { systemProcessId, initializedAtService, sentByUser } = MessageLocalStorage.getStore () ?? {}
		Producer.channel.sendToQueue (this.queueName, Buffer.from (JSON.stringify (message)), {
			...options,
			headers: {
				initializedAtService: initializedAtService ?? process.env.npm_package_name,
				systemProcessId:      systemProcessId ?? createId (),
				...DefaultHeadersInjector.getHeaders (),
				sentByUser: options?.headers.sentByUser ?? (await DefaultHeadersInjector.getHeaders ()).sentByUser ?? sentByUser ?? "system",
				...options?.headers
			},
		})
	}
}

interface ExtendedConsumeOptions extends Options.Consume {
	disableAutoAck?: boolean
}

export class Consumer {
	static connection: Connection;
	static channel: Channel;
	queue: Replies.AssertQueue | undefined;
	queueName: QueueNames;

	constructor(queueName: QueueNames) {
		this.queueName = queueName;
	}

	async initializeConsumer(connectionParameters: BuildConnectionStringProps) {
		if (!Consumer.connection) {
			const connectionString = buildConnectionString (connectionParameters)
			Consumer.connection = await amqplib.connect (connectionString);
		}
		if (!Consumer.channel) Consumer.channel = await Consumer.connection.createChannel ();

		this.queue = await Consumer.channel.assertQueue (this.queueName);
	}

	async consumeMessages(messageHandler: (messageContent: MessageBrokerPayloads, msg: ConsumeMessage | null) => Promise<any>, options: ExtendedConsumeOptions = {}) {
		const { disableAutoAck, ...restOptions } = options
		await Consumer.channel.consume (this.queueName, async (msg) => {
			if (!msg) return;
			const messageContent = JSON.parse (msg.content.toString () || "{}") as MessageBrokerPayloads

			await MessageLocalStorage.run (
				{
					initializedAtService: msg.properties.headers.initializedAtService,
					systemProcessId:      msg.properties.headers.systemProcessId,
					sentByUser:           msg.properties.headers.sentByUser,
				},
				async () => {
					const messageReturning = await messageHandler(messageContent, msg)
					if (!disableAutoAck) Consumer.channel.ack (msg)
					return messageReturning
				}
			)
		}, restOptions);
	}
}
