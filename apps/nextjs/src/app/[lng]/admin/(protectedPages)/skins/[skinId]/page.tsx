import { Col, Icon, LinkButton, Row, Typography } from "@acme/ui"
import { redirect } from "next/navigation"
import { trpcRsc } from "~/utils/apiServer"
import { getTranslation } from "~/app/i18n"
import { auth } from "@acme/auth"
import type { GenerateMetadataWithLocaleProps } from "~/types"
import SkinIdWithDataTable from "~/app/[lng]/admin/(protectedPages)/skins/[skinId]/_components/SkinIdWithDataTable"
import NotFound from "~/app/[lng]/not-found"


interface AdminPageProps {
	params: { lng: string, skinId: string }
	searchParams: { search?: string };
}

export async function generateMetadata(props: GenerateMetadataWithLocaleProps & AdminPageProps) {
	const { params: { lng, skinId } } = props;
	const skin = await trpcRsc.skin.getById.fetch(skinId)
	const { t } = await getTranslation (lng, ["common", "admin"])

	return {
		title:       `${t ("common:metadata.title")} | ${t ("admin:metadata.title.main")} - ${t ("admin:metadata.title.skins")} - ${skin?.weaponName}: ${skin?.name}`,
		description: t ("common:metadata.appDescription")
	};
}

const Page = async ({ params: { lng, skinId }, searchParams: {search} }: AdminPageProps) => {
	const session = await auth ();
	if (!session) redirect (`/${lng}/admin/login`)

	const skinData = await trpcRsc.skin.getByIdWithData.fetch({skinId, limit: 20, search })
	const skin = await trpcRsc.skin.getById.fetch(skinId)

	if (!skin) return NotFound()

	return (
		<main className="h-full">
			<Col className="h-full pb-[20px] px-10">
				<Row className="px-[30px] justify-between">
					<Typography variant={'h2'}
					            color={'colorScheme.subtitle2'}
					            colorDark={'colorScheme.body2'}>
						{skin.weaponName}: {skin.name}
					</Typography>
				</Row>

				<SkinIdWithDataTable lng={lng} initialData={skinData} searchQuery={search} skinId={skinId}/>
			</Col>
		</main>
	)
}

export default Page
