import { Col, Row, Typography } from "@acme/ui"
import { trpcRsc } from "~/utils/apiServer"
import type { ReactNode } from "react"
import { getPathname, getSearchParams } from "~/utils/serverFunctions"
import _ from "lodash"
import SkinDataDatePicker from "~/app/[lng]/admin/(protectedPages)/skins/[skinId]/table/_components/SkinDataDatePicker"
import SkinDataTabs from "~/app/[lng]/admin/(protectedPages)/skins/[skinId]/table/_components/SkinDataTabs"


interface LayoutProps {
	params: {
		skinId: string
		lng: string
	},
	children: ReactNode
}

const Layout = async ({ params: { lng, skinId }, children }: LayoutProps) => {
	const pathname     = getPathname()
	const { startDate, endDate } = getSearchParams("startDate", "endDate")
	const skin = await trpcRsc.skin.getById.fetch(skinId)

	return (
		<main className="h-full">
			<Col className="h-full pb-[20px] px-10">
				<Row className="px-[30px] justify-between">
					<Typography variant={"h2"}
					            color={"colorScheme.subtitle2"}
					            colorDark={"colorScheme.body2"}>
						{skin?.weaponName}: {skin?.name}
					</Typography>
				</Row>
				<Row className="w-full justify-between mt-[20px]">
					<SkinDataTabs skinId={skinId} lng={lng} initialActiveTab={_(pathname).split("/").last()}/>

					<Col className="min-w-[280px] justify-center">
						<SkinDataDatePicker
							initialStartDate={startDate}
							initialEndDate={endDate}/>
					</Col>
				</Row>

				{children}
			</Col>
		</main>
	)
}

export default Layout
