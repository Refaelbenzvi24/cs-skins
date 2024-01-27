import { Col, Icon, LinkButton, Row, Typography } from "@acme/ui"
import { redirect } from "next/navigation"
import { trpcRsc } from "~/trpc/apiServer"
import { getTranslation } from "~/app/i18n"
import { auth } from "@acme/auth"
import type { GenerateMetadataWithLocaleProps, TranslatedRouteProps } from "~/types"
import UsersTable from "~/app/[lng]/admin/(protectedPages)/users/_components/UsersTable"
import checkForServerPermissions from "~/hooks/checkForServerPermissions"
import managedRsc from "~/components/managedRsc"


interface AdminPageProps extends TranslatedRouteProps {
	searchParams: { search?: string };
}

export async function generateMetadata(props: GenerateMetadataWithLocaleProps){
	const { params: { lng } } = props;
	const { t }               = await getTranslation(lng, ['common', 'admin'])

	return {
		title:       `${t('common:metadata.title')} | ${t("admin:metadata.title.main")} - ${t("admin:metadata.title.users")}`,
		description: t('common:metadata.appDescription')
	};
}

const Page = managedRsc(async ({ params: { lng }, searchParams }: AdminPageProps) => {
	const session = await auth();
	if(!session) return redirect(`/${lng}/admin/login`)

	const usersList = await trpcRsc.user.list({ search: searchParams.search, limit: 20 })

	const { isAdmin } = await checkForServerPermissions({ isAdmin: 'admin' })
	const { t }       = await getTranslation(lng, 'admin')

	return (
		<main className="min-h-full w-full">
			<Col className="h-full pb-[20px] px-10">
				<Row className="px-[30px] justify-between">
					<Typography variant={'h2'}
					            color={'colorScheme.subtitle2'}
					            colorDark={'colorScheme.body2'}>
						{t('admin:users.title')}
					</Typography>


					{isAdmin && (
						<LinkButton href={`/${lng}/admin/users/create`}>
							<Row className="items-center justify-center space-x-1">
								<Icon color={'colorScheme.accent'}>
									<IconCarbonAdd/>
								</Icon>
								<Typography variant={'body'} color={'colorScheme.accent'}>
									{t('admin:users.create')}
								</Typography>
							</Row>
						</LinkButton>
					)}
				</Row>

				<UsersTable searchQuery={searchParams.search} initialData={usersList} lng={lng}/>
			</Col>
		</main>
	)
})

export default Page
