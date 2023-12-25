import { auth } from "@acme/auth"
import { redirect } from "next/navigation"
import Chart from "./_components/Chart"
import { trpcRsc } from "~/utils/apiServer"
import _ from "lodash"
import { Col, Row } from "@acme/ui"
import { getSearchParams } from "~/utils/serverFunctions"
import moment from "moment"


interface AdminPageProps {
	params: { lng: string, skinId: string }
}

const Page = async ({ params: { lng, skinId } }: AdminPageProps) => {
	const session = await auth();
	if(!session) return redirect(`/${lng}/admin/login`)
	const { startDate, endDate } = getSearchParams("startDate", "endDate")
	const chartData              = await trpcRsc.skin.getByIdWithDataForChart.fetch({
		limit:     50,
		skinId,
		dateRange: {
			start: startDate ? moment(startDate).toDate() : undefined,
			end:   endDate ? moment(endDate).toDate() : undefined
		}
	})

	const steamListings = _(chartData)
	.groupBy(({ quality }) => quality)
	.map((items, quality) => ({
		id:   quality,
		data: _(items)
		      .orderBy(({ createdAt }) => moment(createdAt).unix(), "asc")
		      .map(({ steamListingsAvg, createdAt }) => ({ x: createdAt, y: steamListingsAvg }))
		      .value()
	}))
	.value()

	const bitSkinPrice = _(chartData)
	.groupBy(({ quality }) => quality)
	.map((items, quality) => ({
		id:   quality,
		data: _(items)
		      .orderBy(({ createdAt }) => moment(createdAt).unix(), "asc")
		      .map(({ bitSkinPriceAvg, createdAt }) => ({ x: createdAt, y: bitSkinPriceAvg }))
		      .value()
	}))
	.value()

	const percentChange = _(chartData)
	.groupBy(({ quality }) => quality)
	.map((items, quality) => ({
		id:   quality,
		data: _(items)
		      .orderBy(({ createdAt }) => moment(createdAt).unix(), "asc")
		      .map(({ percentChangeAvg, createdAt }) => ({ x: createdAt, y: percentChangeAvg }))
		      .value()
	}))
	.value()

	const steamMediaPrice = _(chartData)
	.groupBy(({ quality }) => quality)
	.map((items, quality) => ({
		id:   quality,
		data: _(items)
		      .orderBy(({ createdAt }) => moment(createdAt).unix(), "asc")
		      .map(({ steamMedianPriceAvg, createdAt }) => ({ x: createdAt, y: steamMedianPriceAvg }))
		      .value()
	}))
	.value()

	const steamVolume = _(chartData)
	.groupBy(({ quality }) => quality)
	.map((items, quality) => ({
		id:   quality,
		data: _(items)
		      .orderBy(({ createdAt }) => moment(createdAt).unix(), "asc")
		      .map(({ steamVolumeAvg, createdAt }) => ({ x: createdAt, y: steamVolumeAvg }))
		      .value()
	}))
	.value()

	return (
		<div className="flex h-full w-full">
			<Col className="w-full h-full pb-4">
				<Row className="min-h-[50%] w-full">
					<Chart data={steamListings} xText="Time" yText="Steam Listing"/>
					<Chart data={bitSkinPrice} xText="Time" yText="Bit Skin Price"/>
				</Row>

				<Row className="min-h-[50%] w-full">
					<Chart data={percentChange} xText="Time" yText="Percent Change"/>
					<Chart data={steamMediaPrice} xText="Time" yText="Steam Median Price"/>
				</Row>

				<Row className="min-h-[50%] w-full">
					<Chart data={bitSkinPrice} xText="Time" yText="Bit Skin Price"/>
					<Chart data={steamVolume} xText="Time" yText="Steam Volume"/>
				</Row>
			</Col>
		</div>
	)
}

export default Page
