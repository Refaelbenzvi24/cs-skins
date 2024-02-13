import type { GenerateMetadataWithLocaleProps } from "~/types"
import { getTranslation } from "~/app/i18n"
import LoginPage from "~/app/[lng]/admin/(publicPages)/login/_components/LoginForm"


export async function generateMetadata(props: GenerateMetadataWithLocaleProps){
	const { params: { lng } } = props;
	const { t }               = await getTranslation(lng, ["common", "admin"])

	return {
		title:       `${t("common:metadata.title")} | ${t("common:metadata.login.title")}}`,
		description: t("common:metadata.appDescription")
	};
}


const Page = () => {
	return <LoginPage/>
}

export default Page
