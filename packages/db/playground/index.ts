import { dbHelper } from "./src/dbHelper"

const index = async () => {
	const skinId = 'x6rjptv4pjdhips9wwfrjans'
	const search = undefined
	const cursor = "0"
	const limit = 20
	const data = dbHelper
		.query
		.skinsQualitiesData
		.getBySkinIdWithData ({ skinId, search, cursor, limit })
		.toSQL()

	console.log(data)
}

void index ()
