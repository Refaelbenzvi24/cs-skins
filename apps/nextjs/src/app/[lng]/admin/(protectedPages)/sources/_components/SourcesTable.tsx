"use client";
import { ATagButton, Card, Row, Table, TextField, Typography } from "@acme/ui"
import { api } from "~/utils/api"
import type { FormEvent } from "react";
import { useMemo } from "react"
import type { trpcRsc } from "~/utils/apiServer"
import { useSearchParamState } from "~/hooks"
import type { ComponentWithLocaleProps } from "~/types"
import { useTranslation } from "~/app/i18n/client"
import { getNextPageParam } from "~/utils/apiHelpers"


interface SourcesTableProps extends ComponentWithLocaleProps {
	searchQuery?: string
	initialData?: Awaited<ReturnType<typeof trpcRsc.source.list.fetch>>
}

const SourcesTable = ({ searchQuery, initialData, lng }: SourcesTableProps) => {
	const { value, onChange } = useSearchParamState({
		route:                              "/admin/sources",
		key:                                "search",
		valueGetter:                        ({ target }: FormEvent<HTMLInputElement>) => (target as HTMLInputElement).value,
		beforeRouteChangeParamsTransformer: (params, value) => {
			if(value.length < 2){
				params.delete("search")
			} else {
				params.set("search", value)
			}
		}
	})

	const { t } = useTranslation(lng, ["common", "admin"])

	const { data: sourcesList, fetchNextPage, hasNextPage } = api.source.list.useInfiniteQuery({
		search: value ?? searchQuery,
		limit:  20
	}, { getNextPageParam })

	const sources = useMemo(() => sourcesList?.pages.flatMap(page => page.items).map(item => ({
		...item
	})) ?? [], [sourcesList])

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
				data={sources.length > 0 ? sources : initialData?.items ?? []}
				translationPrefix={"admin:sourcesTable."}
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
							onClick={(e) => e.stopPropagation()}
							target="_blank"
							rel="noopener noreferrer"
							noPadding
							width="fit-content"
							height={"100%"}
							color={bodyColor}
							colorDark={bodyColorDark}
							variant={"small"}>
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
							{createdAt?.toLocaleDateString()}
						</Typography>
					)
				}}/>
		</Card>
	)
}

export default SourcesTable
