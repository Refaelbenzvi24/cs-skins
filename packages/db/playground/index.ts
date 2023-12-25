import { dbHelper } from "../src/dbHelper"


const index = async () => {
	const skinId    = 'xpcmqpxah74gg79lg3252som'
	const search    = undefined
	const cursor    = "0"
	const limit     = 50
	const dateRange = {
		start: new Date('2023-12-03T00:00:00.000Z'),
		end:   new Date('2023-12-20T00:00:00.000Z'),
	}
	const query     = dbHelper
	.query
	.skinsQualitiesData
	.getBySkinIdWithDataForChart({ skinId, limit, dateRange })

	const sql = query.toSQL()
	console.log(sql)

	const result = await query.execute()
	console.log(result)
}

void index()
