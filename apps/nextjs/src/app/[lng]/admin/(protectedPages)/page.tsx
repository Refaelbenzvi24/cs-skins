import { Col, Icon, LinkButton, Row, Typography } from "@acme/ui"
import { redirect } from "next/navigation"
import SkinsTable from "./_components/SkinsTable"
import { trpcRsc } from "~/utils/apiServer"
import { getTranslation } from "~/app/i18n"
import { auth } from "@acme/auth"
import type { GenerateMetadataWithLocaleProps, TranslatedRouteProps } from "~/types"


interface AdminPageProps extends TranslatedRouteProps {
	searchParams: { search?: string };
}

export async function generateMetadata(props: GenerateMetadataWithLocaleProps){
	const { params: { lng } } = props;
	const { t } = await getTranslation(lng, ['common', 'admin'])

	return {
		title:       `${t('common:metadata.title')} | ${t('admin:metadata.title')}`,
		description: t('common:metadata.appDescription')
	};
}

const Page = async ({ params: { lng }, searchParams }: AdminPageProps) => {
	const session = await auth();
	if(!session) redirect(`/${lng}/admin/login`)

	const skinsList = await trpcRsc.skin.list.fetch({ search: searchParams.search ?? "", limit: 20 })

	const { t, i18n } = await getTranslation(lng, 'admin')

	return (
		<main className="h-full">
			<Col className="h-full pb-[20px] px-10">
				<Row className="px-[30px] justify-between">
					<Typography variant={'h2'}
					            color={'colorScheme.subtitle2'}
					            colorDark={'colorScheme.body2'}>
						{t('admin:skins')}
					</Typography>

					<LinkButton href={`/${i18n.language}/admin/add-skin`}>
						<Row className="items-center justify-center space-x-1">
							<Icon color={'colorScheme.accent'}>
								<IconCarbonAdd/>
							</Icon>
							<Typography variant={'body'} color={'colorScheme.accent'}>
								{t('admin:addSkin')}
							</Typography>
						</Row>
					</LinkButton>
				</Row>

				<SkinsTable searchQuery={searchParams.search} initialData={skinsList} lng={lng}/>
			</Col>
		</main>
	)
}

export default Page
