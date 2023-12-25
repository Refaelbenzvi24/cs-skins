import errorCodesMap from "./src"

const playground = () => {
	const error = errorCodesMap.E00001 ({
		systemProcessId:      "123",
		loggedAtService:      "cronjobs",
		initializedAtService: "scraper",
	})
	console.log (error.toString())
}

playground ()
