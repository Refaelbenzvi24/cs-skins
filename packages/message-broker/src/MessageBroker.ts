import * as amqplib from "amqplib";
import type { Channel, Connection, ConsumeMessage, Options } from "amqplib";
import type { Replies } from "amqplib/properties";

import { buildConnectionString, type BuildConnectionStringProps } from "./connectionUtils";
import { MessageBrokerPayloads, QueueNames } from "./types"
import { createId } from "@paralleldrive/cuid2"
import MessageLocalStorage from "./ConsumedMessageLocalStorage"
import DefaultHeadersInjector from "./utils/DefaultHeadersInjector"
import { errors } from "@acme/logger"
import { newError } from "./logger"
import logger from "@acme/logger"


export class Producer {
	static connection: Connection;
	static channel: Channel;
	queue: Replies.AssertQueue | undefined;
	queueName: QueueNames;
	options?: Options.AssertQueue;

	constructor(queueName: QueueNames, options?: Options.AssertQueue){
		this.queueName = queueName
		this.options   = options
	}

	async setupConnection(connectionParameters: BuildConnectionStringProps){
		if(!Producer.connection){
			const connectionString = buildConnectionString(connectionParameters)
			try {
				Producer.connection = await amqplib.connect(connectionString);
			} catch (error) {
				if(error instanceof errors.BaseError || error instanceof errors.TRPCError){
					throw error
				}
				const store = MessageLocalStorage.getStore()
				throw newError({
					initializedAtService: store?.initializedAtService ?? process.env.npm_package_name as typeof logger.servicesMap[number]["name"],
					loggedAtService:      process.env.npm_package_name as typeof logger.servicesMap[number]["name"],
				}).BaseError("errors:messageBroker.consumer.connect.unknown", { cause: error })
			}
		}
	}

	async createChannel(){
		try {
			if(!Producer.channel) Producer.channel = await Producer.connection.createChannel();
		} catch (error) {
			if(error instanceof errors.BaseError || error instanceof errors.TRPCError){
				throw error
			}
			const store = MessageLocalStorage.getStore()
			throw newError({
				initializedAtService: store?.initializedAtService ?? process.env.npm_package_name as typeof logger.servicesMap[number]["name"],
				loggedAtService:      process.env.npm_package_name as typeof logger.servicesMap[number]["name"],
			}).BaseError("errors:messageBroker.producer.createChannel.unknown", { cause: error })
		}
	}

	async initializeProducer(connectionParameters: BuildConnectionStringProps){
		await this.setupConnection(connectionParameters)
		await this.createChannel()

		try {
			this.queue = await Producer.channel.assertQueue(this.queueName, this.options);
		} catch (error) {
			if(error instanceof errors.BaseError || error instanceof errors.TRPCError){
				throw error
			}
			const store = MessageLocalStorage.getStore()
			throw newError({
				initializedAtService: store?.initializedAtService ?? process.env.npm_package_name as typeof logger.servicesMap[number]["name"],
				loggedAtService:      process.env.npm_package_name as typeof logger.servicesMap[number]["name"],
			}).BaseError("errors:messageBroker.producer.assertQueue.unknown", { cause: error })
		}
	}

	async purgeQueue(){
		return await Producer.channel.purgeQueue(this.queueName)
	}

	async sendMessage(message: MessageBrokerPayloads, options?: Options.Publish){
		const { systemProcessId, initializedAtService, sentByUser } = MessageLocalStorage.getStore() ?? {}
		try {
			Producer.channel.sendToQueue(this.queueName, Buffer.from(JSON.stringify(message)), {
				...options,
				headers: {
					initializedAtService: initializedAtService ?? process.env.npm_package_name,
					systemProcessId:      systemProcessId ?? createId(),
					...DefaultHeadersInjector.getHeaders(),
					sentByUser: options?.headers?.sentByUser ?? (await DefaultHeadersInjector.getHeaders())?.sentByUser ?? sentByUser ?? "system",
					...options?.headers
				},
			})
		} catch (error) {
			if(error instanceof errors.BaseError || error instanceof errors.TRPCError){
				throw error
			}
			const store = MessageLocalStorage.getStore()
			throw newError({
				initializedAtService: store?.initializedAtService ?? process.env.npm_package_name as typeof logger.servicesMap[number]["name"],
				loggedAtService:      process.env.npm_package_name as typeof logger.servicesMap[number]["name"],
			}).BaseError("errors:messageBroker.producer.publish.unknown", { cause: error })
		}
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

	constructor(queueName: QueueNames){
		this.queueName = queueName;
	}

	// TODO: consider moving this into a separate function to have a SSOT
	async setupConnection(connectionParameters: BuildConnectionStringProps){
		if(!Producer.connection){
			const connectionString = buildConnectionString(connectionParameters)
			try {
				Producer.connection = await amqplib.connect(connectionString);
			} catch (error) {
				if(error instanceof errors.BaseError || error instanceof errors.TRPCError){
					throw error
				}
				const store = MessageLocalStorage.getStore()
				throw newError({
					initializedAtService: store?.initializedAtService ?? process.env.npm_package_name as typeof logger.servicesMap[number]["name"],
					loggedAtService:      process.env.npm_package_name as typeof logger.servicesMap[number]["name"],
				}).BaseError("errors:messageBroker.consumer.connect.unknown", { cause: error })
			}
		}
	}

	async createChannel(){
		try {
			if(!Producer.channel) Producer.channel = await Producer.connection.createChannel();
		} catch (error) {
			if(error instanceof errors.BaseError || error instanceof errors.TRPCError){
				throw error
			}
			const store = MessageLocalStorage.getStore()
			throw newError({
				initializedAtService: store?.initializedAtService ?? process.env.npm_package_name as typeof logger.servicesMap[number]["name"],
				loggedAtService:      process.env.npm_package_name as typeof logger.servicesMap[number]["name"],
			}).BaseError("errors:messageBroker.producer.createChannel.unknown", { cause: error })
		}
	}

	async initializeConsumer(connectionParameters: BuildConnectionStringProps){
		await this.setupConnection(connectionParameters)
		await this.createChannel()

		try {
			this.queue = await Producer.channel.assertQueue(this.queueName);
		} catch (error) {
			if(error instanceof errors.BaseError || error instanceof errors.TRPCError){
				throw error
			}
			const store = MessageLocalStorage.getStore()
			throw newError({
				initializedAtService: store?.initializedAtService ?? process.env.npm_package_name as typeof logger.servicesMap[number]["name"],
				loggedAtService:      process.env.npm_package_name as typeof logger.servicesMap[number]["name"],
			}).BaseError("errors:messageBroker.consumer.assertQueue.unknown", { cause: error, extraDetails: { queue: this.queue } })
		}
	}

	async consumeMessages(messageHandler: (messageContent: MessageBrokerPayloads, msg: ConsumeMessage | null) => Promise<any>, options: ExtendedConsumeOptions = {}){
		const { disableAutoAck, ...restOptions } = options
		await Consumer.channel.consume(this.queueName, async (msg) => {
			if(!msg) return;
			const messageContent = JSON.parse(msg.content.toString() || "{}") as MessageBrokerPayloads

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
						if(error instanceof errors.BaseError || error instanceof errors.TRPCError){
							throw error
						}
						const store = MessageLocalStorage.getStore()
						throw newError({
							initializedAtService: store?.initializedAtService ?? process.env.npm_package_name as typeof logger.servicesMap[number]["name"],
							loggedAtService:      process.env.npm_package_name as typeof logger.servicesMap[number]["name"],
						}).BaseError("errors:messageBroker.consumer.consume.unknown", { cause: error, extraDetails: { queue: this.queue } })
					}
				}
			)
		}, restOptions);
	}
}
