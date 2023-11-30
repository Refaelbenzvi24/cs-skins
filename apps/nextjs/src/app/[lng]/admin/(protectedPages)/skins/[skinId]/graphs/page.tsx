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
	const chartData              = await trpcRsc.skin.getByIdWithData.fetch({
		limit:     100,
		skinId,
		dateRange: {
			start: startDate ? moment(startDate).toDate() : undefined,
			end:   endDate ? moment(endDate).toDate() : undefined
		}
	})

	const steamListings = _(chartData.items)
	.groupBy(({ quality }) => quality)
	.map((items, quality) => ({
		id:   quality,
		data: _(items).map(({ steamListings, skinDataCreatedAt }) => ({ x: skinDataCreatedAt, y: steamListings })).value()
	}))
	.value()

	const bitSkinPrice = _(chartData.items)
	.groupBy(({ quality }) => quality)
	.map((items, quality) => ({
		id:   quality,
		data: _(items).map(({ bitSkinsPrice, skinDataCreatedAt }) => ({ x: skinDataCreatedAt, y: bitSkinsPrice })).value()
	}))
	.value()

	const percentChange = _(chartData.items)
	.groupBy(({ quality }) => quality)
	.map((items, quality) => ({
		id:   quality,
		data: _(items).map(({ percentChange, skinDataCreatedAt }) => ({ x: skinDataCreatedAt, y: percentChange })).value()
	}))
	.value()

	const steamMediaPrice = _(chartData.items)
	.groupBy(({ quality }) => quality)
	.map((items, quality) => ({
		id:   quality,
		data: _(items).map(({ steamMediaPrice, skinDataCreatedAt }) => ({ x: skinDataCreatedAt, y: steamMediaPrice })).value()
	}))
	.value()

	const steamVolume = _(chartData.items)
	.groupBy(({ quality }) => quality)
	.map((items, quality) => ({
		id:   quality,
		data: _(items).map(({ steamVolume, skinDataCreatedAt }) => ({ x: skinDataCreatedAt, y: steamVolume })).value()
	}))
	.value()

	return (
		<div className="flex h-full w-full">
			<Col className="w-full h-full">
				<Row className="min-h-[50%] w-full">
					<Chart data={steamListings}/>
					<Chart data={bitSkinPrice}/>
				</Row>

				<Row className="min-h-[50%] w-full">
					<Chart data={percentChange}/>
					<Chart data={steamMediaPrice}/>
				</Row>

				<Row className="min-h-[50%] w-full">
					<Chart data={bitSkinPrice}/>
					<Chart data={steamVolume}/>
				</Row>
			</Col>
		</div>
	)
}

export default Page
