import { Col, Icon, LinkButton, Row, Typography } from "@acme/ui"
import { redirect } from "next/navigation"
import SkinsDataTable from "~/app/[lng]/admin/(protectedPages)/skins-data/_components/SkinsDataTable"
import { trpcRsc } from "~/utils/apiServer"
import { getTranslation } from "~/app/i18n"
import { auth } from "@acme/auth"
import type { GenerateMetadataWithLocaleProps, TranslatedRouteProps } from "~/types"


interface AdminPageProps extends TranslatedRouteProps {
	searchParams: { search?: string };
}

export async function generateMetadata(props: GenerateMetadataWithLocaleProps) {
	const { params: { lng } } = props;
	const { t } = await getTranslation (lng, ["common", "admin"])

	return {
		title:       `${t ("common:metadata.title")} | ${t ("admin:metadata.title.main")} - ${t ("admin:metadata.title.dashboard")}`,
		description: t ("common:metadata.appDescription")
	};
}

const Page = async ({ params: { lng } }: AdminPageProps) => {
	const session = await auth ();
	if (!session) redirect (`/${lng}/admin/login`)

	return (
		<main className="h-full">

		</main>
	)
}

export default Page
