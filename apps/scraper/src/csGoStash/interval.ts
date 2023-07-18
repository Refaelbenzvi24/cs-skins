import {prisma} from "@acme/db";
import {getSkinHtml, getSkinTableData} from "./shared";

const getSkinsList = async () => {
	try {
		return await prisma.weapon.findMany({
			where: {
				source: {
					name: "csgostash"
				}
			}
		})
	} catch (error) {
		console.log("error getting skins list from db")
		console.log(error)
	}
}

export const removePriceCharFromStr = (value: string) => {
	return value.replace(/₪|\$/g, '')
}

export const convertToNumber = (value: string) => {
	const number = Number(removePriceCharFromStr(value))
	
	return isNaN(number) ? 0 : number
}

const getSkinDetails = async (url: string) => {
	const {data: skinHtml} = await getSkinHtml(url)
	const skinsData = getSkinTableData(skinHtml)
	
	
	return skinsData.map(row => ({
		url,
		quality: row[0] as string,
		steamPrice: convertToNumber(row[1]),
		steamListings: convertToNumber(row[2]),
		steamMedianPrice: convertToNumber(row[3]),
		steamVolume: convertToNumber(row[4]),
		bitSkinsPrice: convertToNumber(row[5])
	}))
}

type SkinDetails = Awaited<ReturnType<typeof getSkinDetails>>[0]

const calculatePercentChange = (
	{steamPrice, bitSkinsPrice, steamMedianPrice}:
		Pick<SkinDetails, 'bitSkinsPrice' | 'steamPrice' | 'steamMedianPrice'>
) => {
	const calculateSteamPrice = (steamPrice - steamMedianPrice) * 0.1 + steamMedianPrice
	const difference = calculateSteamPrice - bitSkinsPrice
	
	return convertToNumber(((difference / calculateSteamPrice) * 100).toFixed(2))
}

const getSkin = async ({url, quality}: { url: string, quality: string }) => {
	try {
		return await prisma.skin.findFirst({
			where: {
				weapon: {
					url
				},
				quality: {
					name: quality
				}
			}
		})
	} catch (error) {
		console.log(error)
		console.log('error getting skin from db')
	}
}

const saveSkinsDetailsToDb = async ({
	                                    steamPrice, bitSkinsPrice, steamMedianPrice, steamListings, steamVolume, quality, url, percentChange
                                    }: SkinDetails & { percentChange: number }) => {
	const skin = await getSkin({url, quality})
	
	try {
		return await prisma.skinData.create({
			data: {
				percentChange: Number(percentChange),
				skin: {
					connect: {
						id: skin.id
					}
				},
				steamPrice,
				steamListings,
				steamMedianPrice,
				steamVolume,
				bitSkinsPrice
			}
		})
	} catch (error) {
		console.log(error)
		console.log('error saving skin details to db')
	}
}

export const scrapeCsGoStash = async (weapon?: { url: string }[]) => {
	const weaponsList = weapon ? weapon : await getSkinsList()
	
	const skinsDetails = await Promise.all(
		weaponsList.map(async weapon => await getSkinDetails(weapon.url))
	)
	
	Promise.all(
		skinsDetails
			.flat()
			.map(async skinData => await saveSkinsDetailsToDb({
				...skinData,
				percentChange: calculatePercentChange(skinData)
			}))
	)
}
