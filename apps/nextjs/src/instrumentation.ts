export const register = async () => {
	if(process.env.NEXT_RUNTIME === 'nodejs'){
		console.log('starting apm')
		await import("./apm-start.js")
		console.log('apm started')
		// }
	}
}
