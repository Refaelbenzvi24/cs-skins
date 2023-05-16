import {motion, type HTMLMotionProps} from "framer-motion"

import {defaultMainData} from '../Main/MainContext'
import {useMain} from "../../index";
import useDimensions from "../../hooks/useDimensions";


const {sideBarOpts: defaultSideBarOptions} = defaultMainData
const {shrinkPoint: defaultShrinkPoint} = defaultSideBarOptions

const SideBarLink = (props: HTMLMotionProps<"div">) => {
	const {children, ...restProps} = props
	
	const {sideBarState, sideBarOpts, setSideBarState, setOverlayState} = useMain()
	
	const {windowWidth} = useDimensions()
	
	const {shrinkPoint} = {
		...sideBarOpts,
		shrinkPoint: sideBarOpts.shrinkPoint || defaultShrinkPoint,
	}
	
	const action = () => {
		if (sideBarState && shrinkPoint && windowWidth && shrinkPoint > windowWidth) {
			setSideBarState(false)
			setOverlayState(false)
		}
	}
	
	return (
		<motion.div {...restProps}
		            role="presentation"
		            onClick={action}>
			{children}
		</motion.div>
	)
}

export default SideBarLink
