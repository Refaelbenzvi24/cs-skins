const MESSAGE_BROKER_HOST = process.env.MESSAGE_BROKER_HOST
const MESSAGE_BROKER_PORT = process.env.MESSAGE_BROKER_PORT
const MESSAGE_BROKER_USER = process.env.MESSAGE_BROKER_USER
const MESSAGE_BROKER_PASSWORD = process.env.MESSAGE_BROKER_PASSWORD
const MESSAGE_BROKER_PROTOCOL = process.env.MESSAGE_BROKER_PROTOCOL

interface BuildConnectionStringProps {
  protocol: string
  user: string
  password: string
  host: string
  port?: string
}

const buildConnectionString = ({ protocol, user, password, host, port }: BuildConnectionStringProps) => {
  return `${protocol}://${user}:${password}@${host}${port ? `:${port}` : ``}`
}

export const CONNECTION_STRING = buildConnectionString({
  protocol: MESSAGE_BROKER_PROTOCOL as string,
  user: MESSAGE_BROKER_USER as string,
  password: MESSAGE_BROKER_PASSWORD as string,
  host: MESSAGE_BROKER_HOST as string,
  port: MESSAGE_BROKER_PORT
})
