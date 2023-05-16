import {useState, useEffect} from 'react'
import type {ReactElement} from 'react'


interface ConditionalAnimationProps {
	children: ReactElement | undefined
	instantEntrance?: boolean
	condition: boolean;
	timeout?: number;
}

const ConditionalAnimation = (props: ConditionalAnimationProps) => {
	const [render, setRender] = useState(false)
	
	const {condition, timeout, instantEntrance, children} = props
	
	const renderController = () => {
		if (condition) {
			if (instantEntrance) {
				setRender(() => true)
				return
			}
			
			return setTimeout(() => {
				setRender(() => true)
			}, timeout)
		}
		
		setTimeout(() => {
			setRender(false)
		}, timeout)
	}
	
	useEffect(() => {
		renderController()
	}, [condition])
	
	return render && !!children ? children : <></>
}

ConditionalAnimation.defaultProps = {
	instantEntrance: false,
	timeout: 500,
}

export default ConditionalAnimation
