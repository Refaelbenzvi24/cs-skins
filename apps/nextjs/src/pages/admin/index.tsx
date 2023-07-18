import {GetServerSideProps} from "next"
import Head from "next/head"
import {Card, Col, Row, Table, TextField, theme, Typography} from "@acme/ui"
import useTranslation from "next-translate/useTranslation"
import {FormEvent, ReactElement, useCallback, useEffect, useMemo, useRef} from "react";
import AdminLayout from "~/layouts/AdminLayout";
import {useRouter} from "next/router"
import IconCarbonSearch from "~icons/carbon/search"
import {api} from "~/utils/api"
import {debounce} from "~/utils/helpers";
import {getProxySSGHelpers} from "~/utils/ssg"
import {getServerSession} from "@acme/auth";
import {omit} from "~/utils/utils";

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getServerSession(context)
	
	if (!session || !session.user) {
		return {
			redirect: {
				permanent: false,
				destination: '/admin/login'
			}
		}
	}
	
	const search = context.query?.search as string || ''
	const ssg = await getProxySSGHelpers(context)
	
	await ssg.skin.list.prefetchInfinite({limit: 20, search})
	
	return {
		props: {
			trpcState: ssg.dehydrate()
		},
	}
}

const Page = () => {
	const router = useRouter();
	const {t} = useTranslation()
	
	const searchInputElement = useRef<HTMLInputElement>(null)
	
	const searchQuery = useMemo(() => router.query?.search as string || '', [router.query?.search])
	
	const {
		data: skinsList,
		fetchNextPage,
		hasNextPage
	} = api.skin.list.useInfiniteQuery({limit: 20, search: searchQuery}, {
		getNextPageParam: (lastPage, allPages) => {
			if (allPages[allPages.length - 1]?.items.length === 0) return undefined
			
			return lastPage.nextCursor
		}
	})
	
	const skins = useMemo(() => skinsList?.pages.flatMap(page => page.items).map(item => ({
		...omit(item, 'skinData'),
		...item.skinData[0],
		name: item.weapon.name,
		quality: item.quality.name
	})) || [], [skinsList])
	
	const handleSearch = ({target}: FormEvent<HTMLInputElement>) => {
		const searchText = (target as HTMLInputElement).value
		
		if (searchText.length < 2 && searchText.length !== 0)
			return void router.push({query: {}}, undefined, {shallow: true})
		
		void router.push({query: searchText ? {search: searchText} : {}}, undefined, {shallow: true})
	}
	
	const debouncedSearchHandler = useCallback(debounce(handleSearch, 400), [])
	
	useEffect(() => {
		if (searchInputElement.current) searchInputElement.current.value = searchQuery
	}, [searchInputElement.current])
	
	return (
		<>
			<Head>
				<title>CS Skins | Admin</title>
				<meta name="description" content=""/>
			</Head>
			
			<main className="h-full">
				<Col className="h-full pb-[20px] px-10">
					<Row className="px-[30px]">
						<Typography variant={'h2'}
						            color={theme.colorScheme.subtitle2}
						            darkColor={theme.colorScheme.body2}>
							Skins
						</Typography>
					</Row>
					
					<Card
						className="flex-col mt-[20px] w-full"
						noPadding
						bgColor={theme.colorScheme.accent}
						bgColorDark={theme.colorScheme.overlaysDark}
						height="100%">
						<Row className="justify-end px-5 pt-4 pb-5">
							<TextField
								ref={searchInputElement}
								onChange={debouncedSearchHandler}
								removeShadow
								bgColor={theme.colorScheme.light}
								bgColorDark={theme.colorScheme.dark}
								beforeIcon={() => <IconCarbonSearch/>}
								placeholder={t('common:search')}
								height={'28px'}/>
						</Row>
						
						<Table
							data={skins}
							autoFocus
							hasPagination
							hasNextPage={hasNextPage}
							onNextPage={fetchNextPage}
							onRowClick={(skinData) => void router.push(`/admin/skinData/[skinDataId]`, `/admin/skinData/${skinData.id}`)}
							headers={[
								{
									key: 'name',
									display: 'Name'
								},
								{
									key: 'quality',
									display: 'Quality'
								},
								{
									key: 'steamPrice',
									display: 'Steam Price'
								},
								{
									key: 'steamListings',
									display: 'Steam Listings'
								},
								{
									key: 'steamMedianPrice',
									display: 'Steam Median Price'
								},
								{
									key: 'steamVolume',
									display: 'Steam Volume'
								},
								{
									key: 'bitSkinsPrice',
									display: 'BitSkins Price'
								},
								{
									key: 'percentChange',
									display: 'Percent'
								},
								{
									key: 'createdAt',
									display: 'Created At'
								}
							]}
							components={{
								createdAt: ({createdAt}, {bodyColor, bodyColorDark}) => (
									<Typography
										className="whitespace-nowrap"
										color={bodyColor}
										darkColor={bodyColorDark}
										variant={'small'}>
										{createdAt.toLocaleDateString()}
									</Typography>
								)
							}}/>
					</Card>
				
				</Col>
			</main>
		</>
	)
}

Page.getLayout = (page: ReactElement) => (
	<AdminLayout>
		{page}
	</AdminLayout>
)

export default Page
