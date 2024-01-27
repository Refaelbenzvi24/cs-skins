import * as amqplib from "amqplib";
import type { Channel, Connection, ConsumeMessage, Options } from "amqplib";
import type { Replies } from "amqplib/properties";

import { buildConnectionString, type BuildConnectionStringProps } from "./connectionUtils";
import type { PayloadsByQueueName, QueueNames } from "./types"
import { createId } from "@paralleldrive/cuid2"
import MessageLocalStorage from "./ConsumedMessageLocalStorage"
import DefaultHeadersInjector from "./utils/DefaultHeadersInjector"
import { errorTranslationKeys, loggerInstance } from "./logger"
import logger from "@acme/logger"


const getErrorFromUnknown = (fallbackErrorKey: keyof typeof errorTranslationKeys, error: unknown, extraDetails?: unknown) => {
	const store = MessageLocalStorage.getStore()
	if(error instanceof logger.errors.BaseError || error instanceof logger.errors.TRPCError){
		return error.addSystemProcessId(store?.systemProcessId)
	}
	return loggerInstance({
		initializedAtService: store?.initializedAtService ?? process.env.npm_package_name as typeof logger.servicesMap[number]["name"],
		loggedAtService:      process.env.npm_package_name as typeof logger.servicesMap[number]["name"],
	}).errorBuilder.BaseError(fallbackErrorKey, { cause: error, extraDetails })
}

export class Producer<QueueName extends QueueNames> {
	static connection: Connection;
	static channel: Channel;
	queue: Replies.AssertQueue | undefined;
	queueName: QueueName;
	options?: Options.AssertQueue;

	constructor(queueName: QueueName, options?: Options.AssertQueue){
		this.queueName = queueName
		this.options   = options
	}

	async setupConnection(connectionParameters: BuildConnectionStringProps){
		if(!Producer.connection){
			const connectionString = buildConnectionString(connectionParameters)
			try {
				Producer.connection = await amqplib.connect(connectionString);
			} catch (error) {
				throw getErrorFromUnknown("errors:messageBroker.producer.connect.unknown", error, { queue: this.queue })
			}
		}
	}

	async createChannel(){
		try {
			if(!Producer.channel) Producer.channel = await Producer.connection.createChannel();
		} catch (error) {
			throw getErrorFromUnknown("errors:messageBroker.producer.createChannel.unknown", error, { queue: this.queue })
		}
	}

	async initializeProducer(connectionParameters: BuildConnectionStringProps){
		await this.setupConnection(connectionParameters)
		await this.createChannel()

		try {
			this.queue = await Producer.channel.assertQueue(this.queueName, this.options);
		} catch (error) {
			throw getErrorFromUnknown("errors:messageBroker.producer.assertQueue.unknown", error, { queue: this.queue })
		}
	}

	async purgeQueue(){
		try {
			return await Producer.channel.purgeQueue(this.queueName)
		} catch (error) {
			throw getErrorFromUnknown("errors:messageBroker.producer.purgeQueue.unknown", error, { queue: this.queue })
		}
	}

	async sendMessage(message: PayloadsByQueueName[QueueName], options?: Options.Publish){
		const { systemProcessId, initializedAtService, sentByUser } = MessageLocalStorage.getStore() ?? {}
		try {
			Producer.channel.sendToQueue(this.queueName, Buffer.from(JSON.stringify(message)), {
				...options,
				headers: {
					initializedAtService: initializedAtService ?? process.env.npm_package_name,
					systemProcessId:      systemProcessId ?? createId(),
					...(await DefaultHeadersInjector.getHeaders()),
					sentByUser: options?.headers?.sentByUser ?? (await DefaultHeadersInjector.getHeaders())?.sentByUser ?? sentByUser ?? "system",
					...options?.headers
				},
			})
		} catch (error) {
			throw getErrorFromUnknown("errors:messageBroker.producer.publish.unknown", error, { queue: this.queue })
		}
	}
}

interface ExtendedConsumeOptions extends Options.Consume {
	disableAutoAck?: boolean
}

export class Consumer<QueueName extends QueueNames> {
	static connection: Connection;
	static channel: Channel;
	queue: Replies.AssertQueue | undefined;
	queueName: QueueName;

	constructor(queueName: QueueName){
		this.queueName = queueName;
	}

	async setupConnection(connectionParameters: BuildConnectionStringProps){
		if(!Consumer.connection){
			const connectionString = buildConnectionString(connectionParameters)
			try {
				Consumer.connection = await amqplib.connect(connectionString);
			} catch (error) {
				throw getErrorFromUnknown("errors:messageBroker.consumer.connect.unknown", error, { queue: this.queue })
			}
		}
	}

	async createChannel(){
		try {
			if(!Consumer.channel) Consumer.channel = await Consumer.connection.createChannel();
		} catch (error) {
			throw getErrorFromUnknown("errors:messageBroker.consumer.createChannel.unknown", error, { queue: this.queue })
		}
	}

	async initializeConsumer(connectionParameters: BuildConnectionStringProps){
		await this.setupConnection(connectionParameters)
		await this.createChannel()

		try {
			this.queue = await Consumer.channel.assertQueue(this.queueName);
		} catch (error) {
			throw getErrorFromUnknown("errors:messageBroker.consumer.assertQueue.unknown", error, { queue: this.queue })
		}
	}

	async consumeMessages(messageHandler: (messageContent: PayloadsByQueueName[QueueName], msg: ConsumeMessage | null) => Promise<any>, options: ExtendedConsumeOptions = {}){
		const { disableAutoAck, ...restOptions } = options
		await Consumer.channel.consume(this.queueName, async (msg) => {
			if(!msg) return;
			const messageContent = JSON.parse(msg.content.toString() || "{}") as PayloadsByQueueName[QueueName]

			await MessageLocalStorage.run(
				{
					initializedAtService: msg.properties?.headers?.initializedAtService,
					systemProcessId:      msg.properties?.headers?.systemProcessId,
					sentByUser:           msg.properties?.headers?.sentByUser,
				},
				async () => {
					try {
						const messageReturning = await messageHandler(messageContent, msg)
						if(!disableAutoAck) Consumer.channel.ack(msg)
						return messageReturning
					} catch (error) {
						throw getErrorFromUnknown("errors:messageBroker.consumer.consume.unknown", error, { queue: this.queue })
					}
				}
			)
		}, restOptions);
	}
}
