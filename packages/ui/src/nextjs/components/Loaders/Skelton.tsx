import {css} from "@emotion/react"
import styled from "@emotion/styled"
import {motion} from "framer-motion"
import tw from "twin.macro"

import theme from "../../Utils/theme"


export interface SkeletonProps {
	width?: number | string
	height?: number | string
	dark?: boolean
	bgColor?: string
	bgColorDark?: string
}

const Skeleton = styled(motion.div)(({height, width, dark, bgColor, bgColorDark}: SkeletonProps) => [
	css`
    background-color: ${bgColor};
	`,
	
	(props) => (dark || props.theme.isDark) && css`
    background-color: ${bgColorDark};
	`,
	
	height && css`
    height: ${typeof height === 'number' ? `${height}px` : height};
	`,
	width && css`
    width: ${typeof width === 'number' ? `${width}px` : width};;
	`,
	
	tw`animate-pulse`,
])

Skeleton.defaultProps = {
	height: '100%',
	width: '100%',
	bgColor: theme.colors.gray_300,
	bgColorDark: theme.colors.gray_700
} as const

export default Skeleton
