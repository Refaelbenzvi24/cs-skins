"use client";
import { ATagButton, Card, Row, Table, TextField, Typography } from "@acme/ui"
import { api } from "~/utils/api"
import type { FormEvent } from "react";
import { useMemo } from "react"
import type { trpcRsc } from "~/utils/apiServer"
import { useSearchParamState } from "~/hooks"
import type { ComponentWithLocaleProps } from "~/types"
import { useTranslation } from "~/app/i18n/client"
import { useRouter } from "next/navigation"


interface SkinsTableProps extends ComponentWithLocaleProps {
	searchQuery?: string
	initialData?: Awaited<ReturnType<typeof trpcRsc.skin.list.fetch>>
}

const SkinsTable = ({ searchQuery, initialData, lng }: SkinsTableProps) => {
	const { value, onChange } = useSearchParamState ({
		route:                              "/admin/skins",
		key:                                "search",
		valueGetter:                        ({ target }: FormEvent<HTMLInputElement>) => (target as HTMLInputElement).value,
		beforeRouteChangeParamsTransformer: (params, value) => {
			if (value.length <= 2) {
				params.delete ("search")
			} else {
				params.set ("search", value)
			}
		}
	})

	const router = useRouter ()

	const { t } = useTranslation (lng, ["common", "admin"])

	const {
		data: skinsList,
		fetchNextPage,
		hasNextPage
	} = api.skin.list.useInfiniteQuery ({ search: value ?? searchQuery, limit: 20 }, {
		getNextPageParam: (lastPage, allPages) => {
			if (allPages[allPages.length - 1]?.items.length === 0) return undefined
			return lastPage.nextCursor
		}
	})

	const skins = useMemo (() => skinsList?.pages.flatMap (page => page.items).map (item => ({
		...item
	})) ?? [], [skinsList])

	return (
		<Card
			className="flex-col mt-[20px] w-full"
			noPadding
			backgroundColor={"colorScheme.accent"}
			backgroundColorDark={"colorScheme.overlaysDark"}
			height="100%">
			<Row className="justify-end px-5 pt-4 pb-5">
				<TextField
					onChange={onChange}
					hideHelperText
					removeShadow
					initialValue={searchQuery}
					backgroundColor={"colorScheme.light"}
					backgroundColorDark={"colorScheme.dark"}
					beforeIcon={<IconCarbonSearch/>}
					placeholder={t ("admin:search")}
					height={"28px"}/>
			</Row>
			<Table
				data={skins.length > 0 ? skins : initialData?.items ?? []}
				translationPrefix={"admin:skinsTable."}
				translationFunction={t}
				hasPagination
				hasNextPage={hasNextPage}
				onNextPage={fetchNextPage}
				hrefCreator={(skinData) => `/${lng}/admin/skins/${skinData.id}/table`}
				onRowClick={(skinData, event) => {
					if (event.metaKey || event.ctrlKey) {
						return window.open (`/${lng}/admin/skins/${skinData.id}/table`, "_blank")
					}
					router.push (`/${lng}/admin/skins/${skinData.id}/table`)
				}}
				headers={[
					{
						key:     "name",
						display: "Name"
					},
					{
						key:     "url",
						display: "url"
					},
					{
						key:     "createdAt",
						display: "Created At"
					}
				]}
				components={{
					url:       ({ url }, { bodyColor, bodyColorDark }) => (
						<ATagButton
							className="flex whitespace-nowrap"
							href={url}
							text
							onClick={(e) => e.stopPropagation ()}
							target="_blank"
							rel="noopener noreferrer"
							noPadding
							height={"100%"}
							width="fit-content"
							color={bodyColor}
							colorDark={bodyColorDark}>
							<Typography
								className="whitespace-nowrap"
								variant={"small"}>
								{url}
							</Typography>
						</ATagButton>
					),
					createdAt: ({ createdAt }, { bodyColor, bodyColorDark }) => (
						<Typography
							className="whitespace-nowrap"
							color={bodyColor}
							colorDark={bodyColorDark}
							variant={"small"}>
							{createdAt?.toLocaleDateString ()}
						</Typography>
					)
				}}/>
		</Card>
	)
}

export default SkinsTable
