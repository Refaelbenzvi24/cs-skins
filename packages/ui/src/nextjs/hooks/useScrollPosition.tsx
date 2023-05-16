import {useEffect, useState} from "react";

const useScrollPosition = () => {
	const [scrollY, setScrollY] = useState<number>()
	const [scrollX, setScrollX] = useState<number>()
	
	
	useEffect(() => {
		const updateScrollPosition = () => {
			setScrollX(window.scrollX)
			setScrollY(window.scrollY)
		}
		
		window.addEventListener('scroll', updateScrollPosition)
		
		return () => {
			window.removeEventListener('scroll', updateScrollPosition)
		}
	}, [])
	
	return {scrollX, scrollY}
}

export default useScrollPosition
