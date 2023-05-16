import type {ReactNode} from "react"

import styled from "@emotion/styled"
import clsx from "clsx"
import {motion, type HTMLMotionProps} from "framer-motion"
import {css} from "@emotion/react"
import tw from "twin.macro"
import {shouldForwardProp} from "../../Utils/StyledUtils";


interface NavigationWrapperProps {
	vertical?: boolean
}

const NavigationWrapper = styled(motion.div, {
	shouldForwardProp: (props) => shouldForwardProp<NavigationWrapperProps>(
		[
			"vertical"
		]
	)(props as keyof NavigationWrapperProps)
})(({vertical}: NavigationWrapperProps) => [
	tw`flex`,
	vertical ? tw`flex-col` : tw`flex-row`,
	vertical ? css`
    & > * {
      margin-bottom: 35px;
    }
  ;
	` : css`
    & > * {
      [dir=ltr] & {
        margin-right: 45px;
      }

      [dir=rtl] & {
        margin-left: 45px;
      }
    }
	`,
	
	vertical && css`
    & > * {
      width: fit-content;
      margin-left: auto;
      margin-right: auto;
    }
	`
])

interface NavigationProps extends Omit<HTMLMotionProps<"div">, 'children'>, NavigationWrapperProps {
	options: readonly { label: string, value: string }[] | { label: string, value: string }[]
	children: (item: { label: string, value: string, isSelected: boolean }, index: number) => ReactNode
	selected: { label: string, value: string }
}

const Navigation = (props: NavigationProps) => {
	const {selected, className, children, options, ...restProps} = props
	
	return (
		<NavigationWrapper
			{...restProps}
			className={clsx(className)}>
			
			{options.map((item, index) => (
				children({...item, isSelected: (item.value === selected?.value)}, index)
			))}
		</NavigationWrapper>
	)
}

Navigation.defaultProps = {
	vertical: false,
}

export default Navigation
