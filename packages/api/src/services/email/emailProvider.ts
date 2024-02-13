import nodemailer from "nodemailer"
import type Mail from "nodemailer/lib/mailer";
import previewEmail from "preview-email";
// import smtpTransport from "nodemailer-smtp-transport";

export type EmailProvider = ReturnType<typeof nodemailer.createTransport>

export interface ProviderData {
	port: number
	host: string
	service: string
	auth: {
		user: string
		pass: string
	}
}

const checkTransporterConnection = async (transporter: EmailProvider) => {
	return await new Promise((resolve, reject) => {
		transporter.verify((error, success) => {
			if(error){
				console.log(error);
				reject(error);
			} else {
				console.log("Server is ready to take our messages");
				resolve(success);
			}
		});
	});
}

export const getTransporter = async (providerData: ProviderData) => {
	const transporter = nodemailer.createTransport({
		...providerData,
		secure: true,
	});

	try {
		await checkTransporterConnection(transporter)
		console.log('Connected to email provider.')
	} catch (error) {
		console.log('Error connecting to email provider.')
	}

	return transporter
}


export const sendEmail = async ({ emailProvider, data }: { emailProvider?: EmailProvider, data: Mail.Options }) => {
	if(!emailProvider) return previewEmail(data)

	return await emailProvider.sendMail(data)
}
