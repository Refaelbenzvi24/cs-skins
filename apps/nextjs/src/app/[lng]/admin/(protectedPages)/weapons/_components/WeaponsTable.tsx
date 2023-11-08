"use client";
import { Card, Row, Table, TextField, Typography } from "@acme/ui"
import { api } from "~/utils/api"
import type { FormEvent } from "react";
import { useMemo } from "react"
import type { trpcRsc } from "~/utils/apiServer"
import { useSearchParamState } from "~/hooks"
import type { ComponentWithLocaleProps } from "~/types"
import { useTranslation } from "~/app/i18n/client"


interface WeaponsTableProps extends ComponentWithLocaleProps {
	searchQuery?: string
	initialData?: Awaited<ReturnType<typeof trpcRsc.weapon.list.fetch>>
}

const WeaponsTable = ({ searchQuery, initialData, lng }: WeaponsTableProps) => {
	const { search, searchHandler } = useSearchParamState ({
		route:                              "/admin/weapons",
		key:                                "search",
		valueGetter:                        ({ target }: FormEvent<HTMLInputElement>) => (target as HTMLInputElement).value,
		beforeRouteChangeParamsTransformer: (params, value) => {
			if (value.length <= 2) {
				params.delete("search")
			} else {
				params.set ("search", value)
			}
		}
	})

	const { t } = useTranslation (lng, ["common", "admin"])

	const {
		      data: weaponsList,
		      fetchNextPage,
		      hasNextPage
	      } = api.weapon.list.useInfiniteQuery ({ search: search ?? searchQuery, limit: 20 }, {
		getNextPageParam: (lastPage, allPages) => {
			if (allPages[allPages.length - 1]?.items.length === 0) return undefined
			return lastPage.nextCursor
		}
	})

	const weapons = useMemo (() => weaponsList?.pages.flatMap (page => page.items).map (item => ({
		...item
	})) ?? [], [weaponsList])

	return (
		<Card
			className="flex-col mt-[20px] w-full"
			noPadding
			backgroundColor={"colorScheme.accent"}
			backgroundColorDark={"colorScheme.overlaysDark"}
			height="100%">
			<Row className="justify-end px-5 pt-4 pb-5">
				<TextField
					onChange={searchHandler}
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
				data={weapons.length > 0 ? weapons : initialData?.items ?? []}
				translationPrefix={"admin:weaponsTable."}
				translationFunction={t}
				hasPagination
				hasNextPage={hasNextPage}
				onNextPage={fetchNextPage}
				// onRowClick={(skinData) => void ``}
				headers={[
					{
						key: "name",
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
							{createdAt?.toLocaleDateString ()}
						</Typography>
					)
				}}/>
		</Card>
	)
}

export default WeaponsTable
