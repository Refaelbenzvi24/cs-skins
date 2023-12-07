import amqplib from "amqplib";
import type { Channel, Connection, ConsumeMessage, Options } from "amqplib";
import type { Replies } from "amqplib/properties";

import { buildConnectionString, type BuildConnectionStringProps } from "./connectionUtils";
import { MessageBrokerPayloads } from "./types"

export class Producer {
	static connection: Connection;
	static channel: Channel;
	queue: Replies.AssertQueue | undefined;
	queueName: string;
	options?: Options.AssertQueue;

	constructor(queueName: string, options?: Options.AssertQueue) {
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

	sendMessage(message: MessageBrokerPayloads, options?: Options.Publish) {
		Producer.channel.sendToQueue (this.queueName, Buffer.from (JSON.stringify (message)), options)
	}
}

export class Consumer {
	static connection: Connection;
	static channel: Channel;
	queue: Replies.AssertQueue | undefined;
	queueName: string;

	constructor(queueName: string) {
		this.queueName = queueName;
	}

	async initializeConsumer(connectionParameters: BuildConnectionStringProps) {
		if (!Consumer.connection) {
			const connectionString = buildConnectionString (connectionParameters)
			Consumer.connection = await amqplib.connect (connectionString);
		}
		if (!Consumer.channel)
			Consumer.channel = await Consumer.connection.createChannel ();

		this.queue = await Consumer.channel.assertQueue (this.queueName);
	}

	async consumeMessages(messageHandler: (msg: ConsumeMessage | null, messageContent: MessageBrokerPayloads) => Promise<void>, options: Options.Consume = {}) {
		await Consumer.channel.consume (this.queueName, (msg) => {
			const messageContent = JSON.parse (msg?.content.toString () || '{}') as MessageBrokerPayloads
			void messageHandler (msg, messageContent)
		}, options);
	}
}
