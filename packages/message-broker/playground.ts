import apm from "elastic-apm-node"
const serviceName = process.env.APP || 'message-broker-playground'
apm.start({
	serviceName,
	active: process.env.APM_IS_ACTIVE === 'true',
	serverUrl: process.env.APM_URL || 'http://localhost:8200',
	secretToken: process.env.APM_SECRET_TOKEN || undefined,
	environment: process.env.ENVIRONMENT || 'development',
})
import { Producer, Consumer, BuildConnectionStringProps, setApmInstance } from "./src"
setApmInstance(apm)
import { QueueNames } from "./src/types"


const {
	      MESSAGE_BROKER_HOST,
	      MESSAGE_BROKER_USER,
	      MESSAGE_BROKER_PASSWORD,
	      MESSAGE_BROKER_PROTOCOL,
      } = process.env

const connectionParams = {
	host:     MESSAGE_BROKER_HOST,
	user:     MESSAGE_BROKER_USER,
	password: MESSAGE_BROKER_PASSWORD,
	protocol: MESSAGE_BROKER_PROTOCOL
} as BuildConnectionStringProps

const playground = async () => {
	const producer = new Producer("tests" as QueueNames)
	await producer.initializeProducer(connectionParams)
	await producer.sendMessage({ payload: "initial_scrape", url: "https://google.com" })
	const consumer = new Consumer("tests" as QueueNames)
	await consumer.initializeConsumer(connectionParams)
	await consumer.consumeMessages(async (message, msg) => {
		console.log(message)
	})
}

void playground()
