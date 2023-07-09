import amqplib, { Channel, Connection, ConsumeMessage, Options } from "amqplib"
import { Replies } from "amqplib/properties"
import { CONNECTION_STRING } from "./config/envVars"

export class Producer {
  static connection: Connection
  static channel: Channel
  queue: Replies.AssertQueue | undefined
  queueName: string
  
  constructor(queueName: string) {
    this.queueName = queueName
  }
  
  async initializeProducer() {
    if (!Producer.connection) Producer.connection = await amqplib.connect(CONNECTION_STRING)
    if (!Producer.channel) Producer.channel = await Producer.connection.createChannel()
    
    this.queue = await Producer.channel.assertQueue(this.queueName)
  }
  
  sendMessage(message: Record<string, any>) {
    Producer.channel.sendToQueue(this.queueName, Buffer.from(JSON.stringify(message)))
  }
}

export class Consumer {
  static connection: Connection
  static channel: Channel
  queue: Replies.AssertQueue | undefined
  queueName: string
  
  constructor(queueName: string) {
    this.queueName = queueName
  }
  
  async initializeConsumer() {
    if (!Consumer.connection) Consumer.connection = await amqplib.connect(CONNECTION_STRING)
    if (!Consumer.channel) Consumer.channel = await Consumer.connection.createChannel()
    
    this.queue = await Consumer.channel.assertQueue(this.queueName)
  }
  
  async consumeMessages(messageHandler: (msg: ConsumeMessage | null) => void, options: Options.Consume = {}) {
    await Consumer.channel.consume(this.queueName, messageHandler, options)
  }
}
