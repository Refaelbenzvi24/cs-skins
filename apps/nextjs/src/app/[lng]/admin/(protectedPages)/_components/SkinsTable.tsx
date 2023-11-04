"use client";
import { Card, Row, Table, TextField, Typography } from "@acme/ui"
import { api } from "~/utils/api"
import type { FormEvent} from "react";
import { useCallback, useMemo } from "react"
import type { trpcRsc } from "~/utils/apiServer"
import { useClientTranslation } from "~/app/i18n/client"
import i18next from "i18next"
import { useRouter, useSearchParams } from "next/navigation"
import { debounce } from "~/utils/helpers"
import { useGetSearchParams } from "~/hooks"
import { useTranslation } from "~/app/i18n"
import { getTranslation } from "~/app/[lng]/admin/(protectedPages)/_components/serverTranslate"


interface SkinsTableProps {
	searchQuery?: string
	initialData?: Awaited<ReturnType<typeof trpcRsc.skin.list.fetch>>
}

// const getTranslation = async (key: string) => {
// 	"use server";
// 	const {t} = await useTranslation()
// 	return t(key)
// }

const SkinsTable = ({ searchQuery = "", initialData }: SkinsTableProps) => {
	const router       = useRouter()
	const searchParams = useSearchParams()
	const search = useGetSearchParams('search')
	const {
		      data: skinsList,
		      fetchNextPage,
		      hasNextPage
	      }            = api.skin.list.useInfiniteQuery({ search: search ?? searchQuery, limit: 20 }, {
		getNextPageParam: (lastPage, allPages) => {
			if(allPages[allPages.length - 1]?.items.length === 0) return undefined
			return lastPage.nextCursor
		}
	})

	const { t } = useClientTranslation(i18next.language, 'admin')

	const skins = useMemo(() => skinsList?.pages.flatMap(page => page.items).map(item => ({
		...item
	})) ?? [], [skinsList])

	const handleSearch = ({ target }: FormEvent<HTMLInputElement>) => {
		const searchText = (target as HTMLInputElement).value
		const params     = new URLSearchParams(searchParams)
		if(searchText.length < 2 && searchText.length !== 0){
			params.set('search', '')
		} else {
			params.set('search', searchText)
		}

		return router.push(`/${i18next.language}/admin?${params.toString()}`)
	}

	const debouncedSearchHandler = useCallback(debounce(handleSearch, 500), [])

	return (
		<Card
			className="flex-col mt-[20px] w-full"
			noPadding
			backgroundColor={'colorScheme.accent'}
			backgroundColorDark={'colorScheme.overlaysDark'}
			height="100%">
			<Row className="justify-end px-5 pt-4 pb-5">
				<TextField
					onChange={debouncedSearchHandler}
					hideHelperText
					removeShadow
					initialValue={searchQuery}
					backgroundColor={'colorScheme.light'}
					backgroundColorDark={'colorScheme.dark'}
					beforeIcon={<IconCarbonSearch/>}
					placeholder={t('admin:search')}
					height={'28px'}/>
			</Row>
			<Table
				data={skins.length > 0 ? skins : initialData?.items ?? []}
				hasPagination
				hasNextPage={hasNextPage}
				onNextPage={fetchNextPage}
				onRowClick={(skinData) => void ``}
				headers={[
					{
						key:     'weapon',
						display: 'Weapon'
					},
					{
						key: 'skin',
						display: 'Skin'
					},
					{
						key:     'quality',
						display: 'Quality'
					},
					{
						key:     'steamPrice',
						display: 'Steam Price'
					},
					{
						key:     'steamListings',
						display: 'Steam Listings'
					},
					{
						key:     'steamMedianPrice',
						display: 'Steam Median Price'
					},
					{
						key:     'steamVolume',
						display: 'Steam Volume'
					},
					{
						key:     'bitSkinsPrice',
						display: 'BitSkins Price'
					},
					{
						key:     'percentChange',
						display: 'Percent'
					},
					{
						key:     'createdAt',
						display: 'Created At'
					}
				]}
				components={{
					createdAt: ({ createdAt }, { bodyColor, bodyColorDark }) => (
						<Typography
							className="whitespace-nowrap"
							color={bodyColor}
							colorDark={bodyColorDark}
							variant={'small'}>
							{createdAt?.toLocaleDateString()}
						</Typography>
					)
				}}/>
		</Card>
	)
}

export default SkinsTable
