import {EmailProvider, getTransporter} from "@acme/api/src/services/email/emailProvider";

let emailProvider: EmailProvider | undefined

const getEmailProvider = async () => {
	if (emailProvider) return emailProvider
	
	emailProvider = await getTransporter({
		port: Number(process.env.EMAIL_PORT),
		host: process.env.EMAIL_HOST as string,
		service: process.env.EMAIL_SERVICE as string,
		auth: {
			user: process.env.EMAIL_USER as string,
			pass: process.env.EMAIL_PASSWORD as string,
		}
	})
	
	return emailProvider
}

export default getEmailProvider
