import { db, dbOperators, schema as schemaList } from "../index"
import { addOperatorByParametersNil } from "../utils"
import type { PaginateWithSearchParams } from "../../types/queryParams"


const tableName: keyof typeof db.query = "skins"

const getSchema = () => schemaList[tableName]


const list = ({ cursor, search, limit }: PaginateWithSearchParams = {}) => {
	const schema                          = getSchema()
	const { weaponsSkins, weapons }       = schemaList
	const { eq, gt, desc, like, or, and } = dbOperators
	return db
	.select({
		id:         schema.id,
		weaponId:   weapons.id,
		name:       schema.name,
		weaponName: weapons.name,
		url:        schema.url,
		createdAt:  schema.createdAt,
	})
	.from(schema)
	.leftJoin(weaponsSkins, eq(weaponsSkins.skinId, schema.id))
	.leftJoin(weapons, eq(weapons.id, weaponsSkins.weaponId))
	.orderBy(({ id }) => desc(id))
	.where((queryData) => and(
		addOperatorByParametersNil({ cursor }, ({ cursor }) => gt(queryData.id, cursor)),
		addOperatorByParametersNil({ search }, ({ search }) => or(
			like(queryData.name, `${search}`),
			like(queryData.url, `${search}`)
		))
	))
	.limit(limit ?? 20)
}

const findById = ({ id }: { id: string }) => {
	const schema                           = getSchema()
	const { skins, weaponsSkins, weapons } = schemaList
	const { eq }                           = dbOperators
	return db
	.select({
		id:         skins.id,
		weaponId:   weapons.id,
		weaponName: weapons.name,
		name:       skins.name,
		url:        skins.url,
		createdAt:  skins.createdAt,
	})
	.from(schema)
	.leftJoin(weaponsSkins, eq(weaponsSkins.skinId, skins.id))
	.leftJoin(weapons, eq(weapons.id, weaponsSkins.weaponId))
	.where(eq(skins.id, id))
	.limit(1)
}

export default { list, findById }
