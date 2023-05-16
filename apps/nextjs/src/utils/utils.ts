export const scrollToElement = (selector: string) => {
	const element = document.querySelector(selector)

	if (element) element.scrollIntoView({ behavior: 'smooth' })
}

export const scrollToSelector = (selector: string, offset = -100) => {
	const element = document.querySelector(selector)

	if (element) {
		const rect = element.getBoundingClientRect()

		const top    = rect.top + window.pageYOffset + offset
		const bottom = rect.bottom + window.pageYOffset + offset

		if (top - window.scrollY < 0) window.scrollTo({ top: bottom - (window.innerHeight / 2), behavior: 'smooth' })
		if (top - window.scrollY > 0) window.scrollTo({ top, behavior: 'smooth' })
	}
}


export const interpolate = (x: number | undefined, [y1, y2]: [y1: number, y2: number], [x1, x2]: [x1: number, x2: number]) => {
	if (typeof x === 'undefined') return y1
	
	return y1 + ((x - x1) / (x2 - x1)) * (y2 - y1)
}


export const isElementInViewport = (el: Element) => {
	const rect = el.getBoundingClientRect()

	return (
		rect.top >= 0
		&& rect.left >= 0
	)
}

export const isTouchDevice = () => {
	return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0))
}
