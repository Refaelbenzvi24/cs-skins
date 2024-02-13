import { css } from "@emotion/react"
import styled from "@emotion/styled"
import { Row, theme } from "@acme/ui"
import { shouldForwardProp } from "@acme/ui/src/nextjs/Utils/StyledUtils"

interface ContactBottomSheetProps {
	dark?: boolean
	bgColor?: string
	bgColorDark?: string
}

const defaultProps = {
	bgColor: `${theme.colorScheme.iris}cc`,
	bgColorDark: `${theme.colorScheme.overlaysDark}cc`
} as const

const ContactBottomSheet = styled(Row, {
	shouldForwardProp: props =>
		shouldForwardProp<ContactBottomSheetProps>([
			"dark",
			"bgColor",
			"bgColorDark"
		])(props as keyof ContactBottomSheetProps)
})(({ dark, bgColor, bgColorDark }: ContactBottomSheetProps) => [
	css`
		background-color: ${bgColor};
	`,

	props =>
		(dark ?? props.theme.isDark) &&
		css`
			background-color: ${bgColorDark};
		`
])

ContactBottomSheet.defaultProps = defaultProps

export default ContactBottomSheet
