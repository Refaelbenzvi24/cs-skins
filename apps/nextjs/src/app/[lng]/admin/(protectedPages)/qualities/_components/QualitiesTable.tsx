"use client";
import { Card, Row, Table, TextField, Typography } from "@acme/ui"
import { api } from "~/utils/api"
import type { FormEvent } from "react";
import { useMemo } from "react"
import type { trpcRsc } from "~/utils/apiServer"
import { useSearchParamState } from "~/hooks"
import type { ComponentWithLocaleProps } from "~/types"
import { useTranslation } from "~/app/i18n/client"
import { getNextPageParam } from "~/utils/apiHelpers"


interface QualitiesTableProps extends ComponentWithLocaleProps {
	searchQuery?: string
	initialData?: Awaited<ReturnType<typeof trpcRsc.quality.list.fetch>>
}

const QualitiesTable = ({ searchQuery, initialData, lng }: QualitiesTableProps) => {
	const { value, onChange } = useSearchParamState({
		route:                              "/admin/qualities",
		key:                                "search",
		valueGetter:                        ({ target }: FormEvent<HTMLInputElement>) => (target as HTMLInputElement).value,
		beforeRouteChangeParamsTransformer: (params, value) => {
			if(value.length <= 2){
				params.delete("search")
			} else {
				params.set("search", value)
			}
		}
	})

	const { t } = useTranslation(lng, ["common", "admin"])

	const { data: qualitiesList, fetchNextPage, hasNextPage } = api.quality.list.useInfiniteQuery({
		search: value ?? searchQuery,
		limit:  20
	}, { getNextPageParam })

	const qualities = useMemo(() => qualitiesList?.pages.flatMap(page => page.items).map(item => ({
		...item
	})) ?? [], [qualitiesList])

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
					placeholder={t("admin:search")}
					height={"28px"}/>
			</Row>
			<Table
				data={qualities.length > 0 ? qualities : initialData?.items ?? []}
				translationPrefix={"admin:qualitiesTable."}
				translationFunction={t}
				hasPagination
				hasNextPage={hasNextPage}
				onNextPage={fetchNextPage}
				// onRowClick={(skinData) => void ``}
				headers={[
					{
						key:     "name",
						display: "Name"
					},
					{
						key:     "createdAt",
						display: "Created At"
					}
				]}
				components={{
					createdAt: ({ createdAt }, { bodyColor, bodyColorDark }) => (
						<Typography
							className="whitespace-nowrap"
							color={bodyColor}
							colorDark={bodyColorDark}
							variant={"small"}>
							{createdAt?.toLocaleDateString()}
						</Typography>
					)
				}}/>
		</Card>
	)
}

export default QualitiesTable
