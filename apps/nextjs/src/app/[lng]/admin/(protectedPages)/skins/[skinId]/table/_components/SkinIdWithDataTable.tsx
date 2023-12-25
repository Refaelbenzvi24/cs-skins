"use client";
import { Card, Row, Table, TextField, Typography } from "@acme/ui"
import { api } from "~/utils/api"
import type { FormEvent } from "react";
import { useMemo } from "react"
import type { trpcRsc } from "~/utils/apiServer"
import type { ComponentWithLocaleProps } from "~/types"
import { useTranslation } from "~/app/i18n/client"
import moment from "moment"
import { useGetSearchParams, useSearchParamState } from "~/hooks"
import { getNextPageParam } from "~/utils/apiHelpers"


interface SkinIdWithDataProps extends ComponentWithLocaleProps {
	skinId: string
	searchQuery?: string
	initialData?: Awaited<ReturnType<typeof trpcRsc.skin.getByIdWithData.fetch>>
}

const SkinIdWithDataTable = ({ initialData, lng, skinId, searchQuery }: SkinIdWithDataProps) => {
	const { value, onChange }    = useSearchParamState({
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
	const { startDate, endDate } = useGetSearchParams("startDate", "endDate")

	const { t } = useTranslation(lng, ["common", "admin"])

	const { data: skinIdWithDataList, fetchNextPage, hasNextPage } = api.skin.getByIdWithData.useInfiniteQuery({
		search:    value ?? searchQuery,
		skinId,
		limit:     20,
		dateRange: {
			start: startDate ? moment(startDate).toDate() : undefined,
			end:   endDate ? moment(endDate).toDate() : undefined
		}
	}, { getNextPageParam })

	const SkinIdWithData = useMemo(() => skinIdWithDataList?.pages.flatMap(page => page.items).map(item => ({
		...item
	})) ?? [], [skinIdWithDataList])

	return (
		<Card
			className="flex-col w-full h-full mt-[10px]"
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
				data={SkinIdWithData.length > 0 ? SkinIdWithData : initialData?.items ?? []}
				translationPrefix={"admin:skins.skinId.tableHeaders."}
				translationFunction={t}
				hasPagination
				hasNextPage={hasNextPage}
				onNextPage={fetchNextPage}
				headers={[
					{
						key:     "quality",
						display: "Quality"
					},
					{
						key:     "steamPrice",
						display: "Steam Price"
					},
					{
						key:     "steamListings",
						display: "Steam Listings"
					},
					{
						key:     "steamMedianPrice",
						display: "Steam Median Price"
					},
					{
						key:     "steamVolume",
						display: "Steam Volume"
					},
					{
						key:     "bitSkinsPrice",
						display: "BitSkins Price"
					},
					{
						key:     "percentChange",
						display: "Percent"
					},
					{
						key:     "skinDataCreatedAt",
						display: "Skin Data Created At"
					}
				]}
				components={{
					skinDataCreatedAt: ({ skinDataCreatedAt }, { bodyColor, bodyColorDark }) => (
						<Typography
							className="whitespace-nowrap"
							color={bodyColor}
							colorDark={bodyColorDark}
							variant={"small"}>
							{moment(skinDataCreatedAt).format("DD/MM/YYYY HH:mm:ss")}
						</Typography>
					)
				}}/>
		</Card>
	)
}

export default SkinIdWithDataTable
