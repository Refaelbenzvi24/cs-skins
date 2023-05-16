import {GetServerSideProps} from "next"
import {Card, Col, Row, Table, TextField, theme, Typography} from "@acme/ui"
import useTranslation from "next-translate/useTranslation"
import {FormEvent, ReactElement, useCallback, useEffect, useMemo, useRef} from "react";
import AdminLayout from "~/layouts/AdminLayout";
import {useSession} from "next-auth/react"
import {useRouter} from "next/router"
import IconCarbonSearch from "~icons/carbon/search"
import {api} from "~/utils/api"
import {debounce} from "~/utils/helpers";
import {css} from "@emotion/css";
import tw from "twin.macro"
import {getProxySSGHelpers} from "~/utils/ssg"

export const getServerSideProps: GetServerSideProps = async (context) => {
	const search = context.query?.search as string || ''
	const ssg = await getProxySSGHelpers(context)
	
	await ssg.leads.list.prefetchInfinite({limit: 20, search})
	
	return {
		props: {
			trpcState: ssg.dehydrate()
		},
	}
}

const Page = () => {
	const router = useRouter();
	const {status} = useSession()
	const {t} = useTranslation()
	
	const searchInputElement = useRef<HTMLInputElement>(null)
	
	const searchQuery = useMemo(() => router.query?.search as string || '', [router.query?.search])
	
	const {
		data: leadsList,
		fetchNextPage,
		hasNextPage
	} = api.leads.list.useInfiniteQuery({limit: 20, search: searchQuery}, {
		getNextPageParam: (lastPage, allPages) => {
			if (allPages[allPages.length - 1]?.items.length === 0) return undefined
			
			return lastPage.nextCursor
		}
	})
	
	const handleSearch = ({target}: FormEvent<HTMLInputElement>) => {
		const searchText = (target as HTMLInputElement).value
		
		if (searchText.length < 2 && searchText.length !== 0)
			return void router.push({query: {}}, undefined, {shallow: true})
		
		void router.push({query: searchText ? {search: searchText} : {}}, undefined, {shallow: true})
	}
	
	useEffect(() => {
		if (status === 'unauthenticated') void router.push('/admin/login')
	}, [status])
	
	const debouncedSearchHandler = useCallback(debounce(handleSearch, 400), [])
	
	useEffect(() => {
		if (searchInputElement.current) searchInputElement.current.value = searchQuery
	}, [searchInputElement.current])
	
	return (
		<Col className="h-full pb-[70px] min-[1260px]:w-[1250px] max-[1260px]:px-20 mx-auto">
			<Row className="px-[30px]">
				<Typography variant={'h2'}
				            color={theme.colorScheme.subtitle2}
				            darkColor={theme.colorScheme.body2}>
					{t("admin:leads")}
				</Typography>
			</Row>
			
			<Card
				className="flex-col mt-[60px] w-full"
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
					data={leadsList?.pages.flatMap(page => page.items) || []}
					autoFocus
					hasPagination
					hasNextPage={hasNextPage}
					onNextPage={fetchNextPage}
					onRowClick={(lead) => void router.push(`/admin/lead/[leadId]`, `/admin/lead/${lead.id}`)}
					headers={[
						{
							key: 'name',
							display: t('admin:name')
						},
						{
							key: 'email',
							display: t('admin:email')
						},
						{
							key: 'phone',
							display: t('admin:phone')
						},
						{
							key: 'createdAt',
							display: t('admin:dateCreated')
						},
						{
							key: 'message',
							display: t('admin:message'),
							tableHeaderProps: {
								className: "max-w-[70px] ltr:pr-4 rtl:pl-4"
							},
							tableDataProps: {
								className: "max-w-[70px] ltr:pr-4 rtl:pl-4"
							}
						},
					]}
					components={{
						message: ({message}, {bodyColor, bodyColorDark}) => {
							if (message && message.length > 0)
								return (
									<div className={css`
                    ${tw`flex flex-row justify-center items-center p-1 rounded-sm`};
                    background-color: ${theme.colorScheme.success};
                    width: 100%;
                    height: 100%;
									`}>
										<Typography
											className="whitespace-nowrap"
											color={bodyColor}
											darkColor={bodyColorDark}
											variant={'small'}>
											{t('admin:messageStatus.yes')}
										</Typography>
									</div>
								)
							
							
							return (
								<div className={css`
                  ${tw`flex flex-row justify-center items-center p-1 rounded-sm`};
                  background-color: ${theme.colorScheme.error};
                  width: 100%;
                  height: 100%;
								`}>
									<Typography
										className="whitespace-nowrap"
										color={bodyColor}
										darkColor={bodyColorDark}
										variant={'small'}>
										{t('admin:messageStatus.no')}
									</Typography>
								</div>
							)
						},
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
	)
}

Page.getLayout = (page: ReactElement) => (
	<AdminLayout>
		{page}
	</AdminLayout>
)

export default Page
