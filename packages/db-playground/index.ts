import { dbHelper } from "@acme/db"

const playground = async () => {
	const skinId = 'xpcmqpxah74gg79lg3252som'
	const search = null
	const dateRange = null
	const cursor = null
	const limit = 20
	const data = await dbHelper
		.query
		.skinsQualitiesData
		.getBySkinIdWithData ({ skinId, search, dateRange, cursor, limit })
		.execute ()

	console.log(data)
}

void playground ()
