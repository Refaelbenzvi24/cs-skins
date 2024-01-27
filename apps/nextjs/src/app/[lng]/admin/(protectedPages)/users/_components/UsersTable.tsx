"use client";
import { Card, Row, Table, TextField } from "@acme/ui"
import { api } from "~/trpc/api"
import type { FormEvent } from "react";
import { useMemo } from "react"
import type { trpcRsc } from "~/trpc/apiServer"
import { useSearchParamState } from "~/hooks"
import type { ComponentWithLocaleProps } from "~/types"
import { useTranslation } from "~/app/i18n/client"
import { getNextPageParam } from "~/trpc/apiHelpers"
import { useSession } from "next-auth/react"
import useCheckForPermissions from "~/hooks/useCheckForPermissions"


interface UsersTableProps extends ComponentWithLocaleProps {
	searchQuery?: string
	initialData?: Awaited<ReturnType<typeof trpcRsc.user.list>>
}

const UsersTable = ({ searchQuery, initialData, lng }: UsersTableProps) => {
	const { value, onChange } = useSearchParamState({
		route:                              "/admin/users",
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

	const { data: usersList, fetchNextPage, hasNextPage } = api.user.list.useInfiniteQuery({
		search: value ?? searchQuery,
		limit:  20
	}, { getNextPageParam })

	const users = useMemo(() => usersList?.pages.flatMap(page => page.items).map(item => ({
		...item
	})) ?? [], [usersList])

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
				data={users.length > 0 ? users : initialData?.items ?? []}
				translationPrefix={"admin:usersTable."}
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
						key:     "email",
						display: "Email"
					},
				]}/>
		</Card>
	)
}

export default UsersTable
