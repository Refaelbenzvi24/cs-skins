import { Card, Col, Icon, LinkButton, Row, TextField, Typography } from "@acme/ui"
import { useCallback } from "react"
import type { FormEvent } from "react";
import { debounce } from "~/utils/helpers"
import Head from "next/head"
import { useLocale, useTranslations } from "next-intl"
import { redirect, usePathname, useRouter, useSearchParams } from "next/navigation"
import SkinsTable from "./_components/SkinsTable"
import { trpcRsc } from "~/utils/apiServer"
import { useTranslation } from "~/app/i18n"
import { auth } from "@acme/auth"


const Page = async ({ params: { lng }, searchParams }: PageProps & {searchParams: { search?: string }}) => {
	const session = await auth();
	if(!session) redirect(`/${lng}/admin/login`)
	// const searchParams = useSearchParams()
	// const pathname = usePathname()
	// const router = useRouter()
	// const locale = useLocale()
	// const searchQuery = searchParams.get('search') ?? ""

	const skinsList = await trpcRsc.skin.list.fetch({ search: searchParams.search, limit: 20 })

	const { t, i18n } = await useTranslation(lng, 'admin')

	// const handleSearch = ({ target }: FormEvent<HTMLInputElement>) => {
	// 	const searchText = (target as HTMLInputElement).value
	//
	// 	if (searchText.length < 2 && searchText.length !== 0)
	// 		return router.push(`${pathname}`)
	//
	// 	return router.push(`${pathname}?search=${searchText}`)
	// }

	// eslint-disable-next-line react-hooks/exhaustive-deps
	// const debouncedSearchHandler = useCallback (debounce (handleSearch, 400), [])

	return (
		<>
			<Head>
				<title>CS Skins | Admin</title>
				<meta name="description" content=""/>
			</Head>

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



					<SkinsTable searchQuery={searchParams.search} initialData={skinsList}/>
				</Col>
			</main>
		</>
	)
}

export default Page
