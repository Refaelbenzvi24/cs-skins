import type {leadsValidations} from "@acme/validations"
import {z} from "zod"
import * as React from "react";
import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Html,
	Img,
	Link,
	Preview,
	Section,
	Tailwind,
	Text,
} from '@react-email/components';

const baseUrl = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: `http://localhost:3000`

type ContactValidationOutput = z.ZodObject<typeof leadsValidations.contactObject>['_output']

export interface ContactEmailProps extends ContactValidationOutput {
	leadId: string
}

const Contact = (
	{
		name = "Test Name",
		email = "testemail@mail.com",
		phone = "123456789",
		message = "some random message with some additional info...",
		leadId = "123456789"
	}: ContactEmailProps) => {
	const previewText = `New lead from ${name}`;
	
	return (
		<Html dir="ltr">
			<Head/>
			<Preview>{previewText}</Preview>
			<Tailwind>
				<Body style={main} className="bg-[#F0F4F8] my-auto mx-auto font-sans">
					<Container className="bg-white rounded pt-[20px] pb-[48px] mb-[64px] mx-auto w-[465px]">
						<Section className="px-[48px]">
							<Section className="mt-[32px]">
								<Img
									src={`${baseUrl}/Logo.svg`}
									width={45}
									height={54}
									alt="YAM"
									className="my-0 mx-auto"
								/>
							</Section>
							<Heading className="text-black text-[24px font-normal text-center p-0 mt-[30px] mb-[30px] mb-0 mx-0">
								You have new lead from
							</Heading>
							<Text className="text-black text-[16px] leading-[24px]">
								Hello!
							</Text>
							<Text className="text-black text-[16px] leading-[24px]">
								<strong>{name}</strong> (
								<Link
									href={`mailto:${email}`}
									className="text-blue-600 no-underline">
									{email}
								</Link>
								) left you a message on your website.
							</Text>
							
							<Text className="text-black text-[16px] leading-[24px]">
								Phone: <strong>{phone}</strong>
							</Text>
							
							<Text className="text-black text-[16px] leading-[24px] my-2">
								This is the message content :
							</Text>
							<Text className="text-black text-[16px] leading-[24px] my-2">
								{message}
							</Text>
							
							<Button
								className="block bg-[#5F9BF3] text-white font-bold text-center w-full"
								href={`${baseUrl}/admin/lead/${leadId}`}
								pY={10}
							>
								See the lead on the website
							</Button>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	)
}

const main = {
	fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

export default Contact
