import logger from "./src"

const playground = () => {
	const errors = logger.errorBuilder({
		initializedAtService: "scraper",
		loggedAtService: "scraper",
	})
	const error = errors.TRPCError("E00001", "UNAUTHORIZED")
	console.log (error)
}

playground ()
