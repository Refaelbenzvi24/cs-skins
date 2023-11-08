import { Col, Divider, Row, Typography } from "@acme/ui"
import type { GenerateMetadataWithLocaleProps, PageWithLocaleProps } from "~/types"
import { getTranslation } from "~/app/i18n"
import AddSkinForm from "~/app/[lng]/admin/(protectedPages)/skins/add/_components/AddSkinForm"

export async function generateMetadata(props: GenerateMetadataWithLocaleProps) {
	const { params: { lng } } = props;
	const { t } = await getTranslation (lng, ["common", "admin"])

	return {
		title:       `${t ("common:metadata.title")} | ${t ("admin:metadata.title.main")} - ${t ("admin:metadata.title.addSkin")}`,
		description: t ("common:metadata.appDescription")
	};
}

const Page = async ({ params: { lng } }: PageWithLocaleProps) => {
	const {t} = await getTranslation(lng, ["common", "admin"])

	return (
		<main className="flex min-h-full justify-center items-center">
			<Col className="mx-auto items-center justify-center min-[950px]:w-[900px] py-20 px-[30px]">
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
