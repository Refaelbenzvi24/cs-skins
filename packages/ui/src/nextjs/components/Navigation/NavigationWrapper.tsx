import { shouldForwardProp } from "../../utils/StyledUtils"
import { css, withTheme } from "@emotion/react"
import styled from "@emotion/styled"
import tw from "twin.macro"
import { motion } from "framer-motion"

export interface NavigationWrapperProps {
	vertical?: boolean
}

const NavigationWrapper = styled (motion.div, {
	shouldForwardProp: (props) => shouldForwardProp<NavigationWrapperProps> (
		[
			"vertical"
		]
	) (props as keyof NavigationWrapperProps)
}) (({ vertical }: NavigationWrapperProps) => [
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

export default withTheme(NavigationWrapper)
