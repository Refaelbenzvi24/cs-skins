"use client";
import type { GenerateMetadataWithLocaleProps } from "~/types"
import { getTranslation } from "~/app/i18n"


export async function generateMetadata(props: GenerateMetadataWithLocaleProps){
	const { params: { lng } } = props;
	const { t }               = await getTranslation(lng, ["common", "admin"])

	return {
		title:       `${t("common:metadata.title")} | ${t("common:metadata.login.title")}}`,
		description: t("common:metadata.appDescription")
	};
}


const Page = () => {
	return
}

export default Page
