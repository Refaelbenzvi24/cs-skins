export interface BuildConnectionStringProps {
	protocol: string
	user: string
	password: string
	host: string
	port?: string
	pathname?: string
}

export const buildConnectionString = ({
	protocol,
	user,
	password,
	host,
	port,
	pathname
}: BuildConnectionStringProps) => {
	return `${protocol}://${user}:${password}@${host}${port ? `:${port}` : ``}${pathname ? `/${pathname}` : ``}`
}
