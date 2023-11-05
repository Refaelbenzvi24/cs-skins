"use client";
import { useEffect, useState } from "react"


const useDimensions = () => {
	const [windowWidth, setWindowWidth]   = useState<number>()
	const [windowHeight, setWindowHeight] = useState<number>()

	const setWindowData = () => {
		setWindowWidth(window.innerWidth)
		setWindowHeight(window.innerHeight)
	}

	useEffect(() => {
		setWindowData()
		window.addEventListener('resize', setWindowData)

		return () => {
			window.removeEventListener('resize', setWindowData)
		}
	}, [])

	return { windowWidth, windowHeight }
}

export default useDimensions
