import { getTransporter } from "@acme/api/src/services/email/emailProvider";
import type { EmailProvider } from "@acme/api/src/services/email/emailProvider";


let emailProvider: EmailProvider | undefined

const getEmailProvider = async () => {
	if(emailProvider) return emailProvider
	const isEmailServiceEnabled = process.env.EMAIL_SERVICE_ENABLED === "true";
	if(!isEmailServiceEnabled) return undefined

	emailProvider = await getTransporter({
		port:    Number(process.env.EMAIL_PORT),
		host:    process.env.EMAIL_HOST!,
		service: process.env.EMAIL_SERVICE!,
		auth:    {
			user: process.env.EMAIL_USER!,
			pass: process.env.EMAIL_PASSWORD!,
		}
	})

	return emailProvider
}

export default getEmailProvider
