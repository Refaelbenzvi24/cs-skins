"use client";
import { Card, Col, Row, Tab, Table, Tabs, TextField, Typography } from "@acme/ui"
import { api } from "~/utils/api"
import type { FormEvent } from "react";
import { useMemo } from "react"
import type { trpcRsc } from "~/utils/apiServer"
import { useSearchParamState } from "~/hooks"
import type { ComponentWithLocaleProps } from "~/types"
import { useTranslation } from "~/app/i18n/client"
import moment from "moment/moment"
import { getNextPageParam } from "~/utils/apiHelpers"


interface SkinsDataTableProps extends ComponentWithLocaleProps {
	searchQuery?: string
	initialData?: Awaited<ReturnType<typeof trpcRsc.skinData.list.fetch>>
}

const SkinsDataTable = ({ searchQuery, initialData, lng }: SkinsDataTableProps) => {
	const { value, onChange } = useSearchParamState({
		route:                              "/admin/skins-data",
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

	const {
		      data: skinsList,
		      fetchNextPage,
		      hasNextPage
	      } = api.skinData.list.useInfiniteQuery({ search: value ?? searchQuery, limit: 20 }, { getNextPageParam })

	const skins = useMemo(() => skinsList?.pages.flatMap(page => page.items).map(item => ({
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
					placeholder={t("admin:search")}
					height={"28px"}/>
			</Row>
			<Table
				data={skins.length > 0 ? skins : initialData?.items ?? []}
				translationPrefix={"admin:skinsDataTable."}
				translationFunction={t}
				hasPagination
				hasNextPage={hasNextPage}
				onNextPage={fetchNextPage}
				// onRowClick={(skinData) => void ``}
				headers={[
					{
						key:     "weapon",
						display: "Weapon"
					},
					{
						key:     "skin",
						display: "Skin"
					},
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
							{moment(createdAt).format("DD/MM/YYYY HH:mm:ss")}
						</Typography>
					)
				}}/>
		</Card>
	)
}

export default SkinsDataTable
