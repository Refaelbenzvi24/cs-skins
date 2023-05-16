import {css} from "@emotion/react"
import styled from "@emotion/styled"
import clsx from "clsx"
import {motion} from "framer-motion"
import tw from "twin.macro"

import {Button, useMain} from '../../index'
import theme from "../../Utils/theme"
import {transformTransition} from "../../Utils/transitions"
import {conditionalRotate, conditionalTranslate} from "../../Utils/utils"
import IconCarbonChevronLeft from "~icons/carbon/chevronLeft"
import IconCarbonChevronRight from "~icons/carbon/chevronRight"
import {shouldForwardProp} from "../../Utils/StyledUtils";
import type {ButtonProps} from "../Buttons/Button";


interface SideBarButtonWrapperProps {
	state: boolean,
	width?: number
}


const SideBarButtonWrapper = styled(motion.div, {
	shouldForwardProp: (props) => shouldForwardProp<SideBarButtonWrapperProps>(
		['width', 'state']
	)(props as keyof SideBarButtonWrapperProps)
})(({width, state}: SideBarButtonWrapperProps) => [
	css`
    color: ${theme.colors.gray_700};
    z-index: ${theme.zIndex.sideBar};
    top: 0;
	`,
	tw`self-center fixed mt-10 shadow-lg`,
	theme.transitions([transformTransition()]),
	theme.transforms([
		conditionalRotate(!state, 180),
		conditionalTranslate(state, `${width as number}px`, 'ltr'),
	]),

])

interface SideBarButtonProps {
	className?: string | undefined
	dir?: "ltr" | "rtl",
	dark?: boolean
}

const SideBarButton = ({className, dir, dark, ...restProps}: SideBarButtonProps & ButtonProps) => {
	const {sideBarState: state, setSideBarState: setState, setOverlayState, sideBarOpts} = useMain()
	
	const {width} = sideBarOpts
	
	const setOpenState = (state: boolean) => {
		setState(state)
		setOverlayState(state)
	}
	
	return (
		<SideBarButtonWrapper className={clsx(className)}
		                      state={state}
		                      width={width}>
			<Button
				{...restProps}
				icon
				size={'24px'}
				dark={dark}
				onClick={() => setOpenState(!state)}>
				{dir === 'ltr' ? <IconCarbonChevronLeft/> : <IconCarbonChevronRight/>}
			</Button>
		</SideBarButtonWrapper>
	)
}

SideBarButton.defaultProps = {
	dir: 'ltr',
	dark: undefined,
	bgColor: theme.colorScheme.white,
	bgColorDark: theme.colorScheme.overlaysDark
}

export default SideBarButton
