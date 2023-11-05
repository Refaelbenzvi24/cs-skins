"use client";
import { useState, useEffect } from "react"
import type { ReactElement } from "react"


interface ConditionalAnimationProps {
	children: ReactElement | undefined
	instantEntrance?: boolean
	condition: boolean;
	timeout?: number;
}

const ConditionalAnimation = ({
	                              condition,
	                              instantEntrance = false,
	                              timeout = 500,
	                              children
                              }: ConditionalAnimationProps) => {
	const [render, setRender] = useState (false)


	const renderController = () => {
		if (condition) {
			if (instantEntrance) {
				setRender (() => true)
				return
			}

			return setTimeout (() => {
				setRender (() => true)
			}, timeout)
		}

		setTimeout (() => {
			setRender (false)
		}, timeout)
	}

	useEffect (() => {
		renderController ()
	}, [condition])

	return render && !!children ? children : <></>
}

export default ConditionalAnimation
