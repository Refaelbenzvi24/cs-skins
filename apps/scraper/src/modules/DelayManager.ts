interface DelayManagerProps {
	delayInMili: number
}

export default class DelayManager {
	private delayHandlerIsWorking: boolean
	private delayInMili: number
	private queue: (() => void)[]
	
	constructor(props: DelayManagerProps) {
		this.delayInMili = props.delayInMili;
		this.queue = []
		this.delayHandlerIsWorking = false
	}
	
	
	start() {
		if (this.delayHandlerIsWorking) return console.log("Delay handler is already working")
		
		this.delayHandlerIsWorking = true
		
		setInterval(() => {
			if (this.queue.length > 0) {
				this.queue[0]()
				this.queue.shift()
			}
		}, this.delayInMili)
	}
	
	push<Callback extends () => any>(callback: Callback): Promise<ReturnType<Callback>> {
		if (!this.delayHandlerIsWorking) this.start()
		
		return new Promise((resolve, reject) => {
				
				this.queue.push(async () => {
					try {
						resolve(await callback())
					} catch (error) {
						reject(error)
					}
				})
			}
		)
	}
}
