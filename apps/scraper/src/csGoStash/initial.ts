import axios from "axios"
import {getSkinHtml, getSkinTableData, getSkinTitle} from "./shared"
import {prisma} from "@acme/db"

const getBasicSkinData = async (url: string) => {
	const {data: skinHtml} = await getSkinHtml(url)
	
	const skinsData = getSkinTableData(skinHtml)
	const name = getSkinTitle(skinHtml)
	
	return skinsData.map(row => ({
		url,
		name,
		quality: row[0] as string,
	}))
}

const saveSkinToDb = async ({url, name, quality}: { url: string, name: string, quality: string }) => {
	try {
		return await prisma.skin.create({
			data: {
				weapon: {
					connectOrCreate: {
						where: {
							url
						},
						create: {
							name,
							url,
							source: {
								connectOrCreate: {
									create: {
										name: 'csgostash',
										url: 'https://csgostash.com/',
									},
									where: {
										name: 'csgostash'
									}
								}
							}
						}
					}
				},
				quality: {
					connectOrCreate: {
						create: {name: quality},
						where: {name: quality}
					}
				}
			}
		})
	} catch (error) {
		console.log(error)
		console.log('error saving skin to db')
	}
}

export const initialScrapeCsGoStash = async (url: string) => {
	const basicSkinData = await getBasicSkinData(url)
	await Promise.all(basicSkinData.map(async skin => await saveSkinToDb(skin)))
}
