import { css } from "@emotion/react"

export interface MarginsObject {
	left?: string | number
	right?: string | number
	top?: string | number
	bottom?: string | number
}

export const getMargins = (margins?: MarginsObject) => {
	if (!margins) return
	const { left, right, top, bottom } = margins
	return css`
      ${left && `margin-left: ${left};`}
      ${right && `margin-right: ${right};`}
      ${top && `margin-top: ${top};`}
      ${bottom && `margin-bottom: ${bottom};`}
	`
}
