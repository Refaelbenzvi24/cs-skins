import cheerio from "cheerio";
import axios from "axios";
import DelayManager from "../modules/DelayManager";
import { logError, newError } from "../services/logger"


const delayManager = new DelayManager({
	delayInMili: 700
})

export const getSkinHtml = async (skinUrl: string) => {
	return await delayManager.push(async () => {
		return await axios.get(skinUrl)
	})
}


export const getSkinTitle = (skinHtml: string) => {
	const $                      = cheerio.load(skinHtml)
	const title                  = $(".result-box > h2").text()
	const [weaponName, skinName] = title.split(" | ") as [string, string]

	return { weaponName, skinName }
}

export const getSkinTableData = (skinHtml: string) => {
	const $         = cheerio.load(skinHtml)
	const tableBody = $("tbody")
	const tableRows = tableBody.find("tr")

	return tableRows.get().map(row =>
		$(row).map((i, el) =>
			$(el).find("td").map((i, el) =>
				$(el).text().replace(/[\n\t]/g, "").trim()
			).get()
		).get()
	)
}
