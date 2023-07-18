import cheerio from "cheerio";
import axios from "axios";

export const getSkinHtml = async (skinUrl: string) => {
	try {
		return await axios.get(skinUrl)
	} catch (error) {
		console.error(error)
		console.log('error in getting skin html')
	}
}

export const getSkinTitle = (skinHtml: string) => {
	const $ = cheerio.load(skinHtml)
	const title = $("title").text()
	
	return title.split('CS:GO')[0].slice(0, -2);
}

export const getSkinTableData = (skinHtml: string) => {
	const $ = cheerio.load(skinHtml)
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
