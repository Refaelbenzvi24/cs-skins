import * as amqplib from "amqplib";
import type { Channel, Connection, ConsumeMessage, Options } from "amqplib";
import type { Replies } from "amqplib/properties";

import { buildConnectionString  } from "./connectionUtils";
import type {BuildConnectionStringProps} from "./connectionUtils";
import type { PayloadsByQueueName, QueueNames } from "./types"
import MessageLocalStorage from "./ConsumedMessageLocalStorage"
import GlobalHelpers from "./utils/GlobalHelpers"


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
			Producer.connection    = await amqplib.connect(connectionString);
		}
	}

	async createChannel(){
		if(!Producer.channel) Producer.channel = await Producer.connection.createChannel();
	}

	async initializeProducer(connectionParameters: BuildConnectionStringProps){
		await this.setupConnection(connectionParameters)
		await this.createChannel()
		this.queue = await Producer.channel.assertQueue(this.queueName, this.options);
		return this.queue
	}

	async purgeQueue(){
		return await Producer.channel.purgeQueue(this.queueName)
	}

	async sendMessage(message: PayloadsByQueueName[QueueName], options?: Options.Publish){
		const { traceparent } = MessageLocalStorage.getStore() ?? {}
		const transaction     = GlobalHelpers?.apm?.startTransaction(`Producer: ${this.queueName} ${message.payload}`, 'message-broker', { tracestate: traceparent })
		transaction?.setLabel('queueName', this.queueName)
		transaction?.setLabel('messageContent', JSON.stringify(message))
		transaction?.setLabel('options', JSON.stringify(options))
		Producer.channel.sendToQueue(this.queueName, Buffer.from(JSON.stringify(message)), {
			...options,
			headers: {
				...options?.headers,
				traceparent: transaction?.traceparent ?? traceparent ?? undefined,
				sentAt:    new Date().toISOString()
			},
		})
		transaction?.end()
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
			Consumer.connection    = await amqplib.connect(connectionString);
		}
	}

	async createChannel(){
		if(!Consumer.channel) Consumer.channel = await Consumer.connection.createChannel();
	}

	async initializeConsumer(connectionParameters: BuildConnectionStringProps){
		await this.setupConnection(connectionParameters)
		await this.createChannel()
		this.queue = await Consumer.channel.assertQueue(this.queueName);
		return this.queue
	}

	async consumeMessages(messageHandler: (messageContent: PayloadsByQueueName[QueueName], msg: ConsumeMessage | null) => Promise<unknown>, options: ExtendedConsumeOptions = {}){
		const { disableAutoAck, ...restOptions } = options
		await Consumer.channel.consume(this.queueName, async (msg) => {
			if(!msg) return;
			const messageContent = JSON.parse(msg.content.toString() || "{}") as PayloadsByQueueName[QueueName]
			const transaction    = GlobalHelpers?.apm?.startTransaction(`Consumer: ${this.queueName} ${messageContent?.payload}`, 'message-broker', { childOf: msg.properties.headers?.traceparent })
			transaction?.setLabel('queueName', this.queueName)
			transaction?.setLabel('messageContent', JSON.stringify(messageContent))
			await MessageLocalStorage.run(
				{
					traceparent: (transaction?.traceparent ?? msg.properties.headers?.traceparent as string | undefined) ?? undefined
				},
				async () => {
					const messageReturning = await messageHandler(messageContent, msg)
					if(!disableAutoAck) Consumer.channel.ack(msg)
					return messageReturning
				}
			)
			transaction?.end()
		}, restOptions);
	}
}

