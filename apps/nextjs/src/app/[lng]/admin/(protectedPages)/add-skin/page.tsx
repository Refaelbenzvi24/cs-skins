import { Col, Divider, Row, Typography } from "@acme/ui"
import type { GenerateMetadataWithLocaleProps, PageWithLocaleProps } from "~/types"
import { getTranslation } from "~/app/i18n"
import AddSkinForm from "~/app/[lng]/admin/(protectedPages)/add-skin/_components/AddSkinForm"

export async function generateMetadata(props: GenerateMetadataWithLocaleProps) {
	const { params: { lng } } = props;
	const { t } = await getTranslation (lng, ["common", "admin"])

	return {
		title:       `${t ("common:metadata.title")} | ${t ("admin:metadata.title")} - ${t ("admin:metadata.addSkin")}`,
		description: t ("common:metadata.appDescription")
	};
}

const Page = async ({ params: { lng } }: PageWithLocaleProps) => {
	const {t} = await getTranslation(lng, ["common", "admin"])

	return (
		<main className="h-full">
			<Col className="mx-auto h-full items-center justify-center min-[950px]:w-[900px] px-[30px]">
				<Row
					className="w-full items-center justify-center px-[24px] pb-[120px] rtl:space-x-reverse">
					<Divider className="max-[800px]:hidden" thickness="2px"/>
					<Typography
						className="whitespace-nowrap mx-[18px]"
						variant="h2"
						color={"colorScheme.primary"}>
						{t('admin:addSkin')}
					</Typography>
					<Divider className="max-[800px]:hidden" thickness="2px"/>
				</Row>

				<AddSkinForm lng={lng}/>
			</Col>
		</main>
	)
}

export default Page
