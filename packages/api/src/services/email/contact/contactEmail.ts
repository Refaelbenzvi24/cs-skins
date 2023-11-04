import nodemailer from "nodemailer";
import {render} from "@react-email/render"

import type {ContactEmailProps} from "@acme/email-templates/templates/contact";
import {ContactEmail} from "@acme/email-templates"
import {sendEmail} from "../emailProvider";

export const sendContactEmail = async ({emailProvider, data}: { emailProvider: nodemailer.Transporter, data: ContactEmailProps }) => {
	try {
		return await sendEmail({
			emailProvider,
			data: {
				from: data.email,
				to: process.env.EMAIL_USER as string,
				html: render(ContactEmail(data)),
				subject: `New lead from ${data.name}`,
			}
		})
	} catch (error) {
		console.log(error)
	}
}
