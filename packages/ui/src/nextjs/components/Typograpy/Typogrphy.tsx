"use client";
import type { DetailedHTMLProps, ElementType, HTMLAttributes } from "react"

import StyledTypography, { type TypographyVariantOptions, type StyledTypographyProps, settings } from "./StyledTypography"
import { withTheme } from "@emotion/react"


const Typography = <Variant extends TypographyVariantOptions>(props:
	{
		as?: ElementType
	} & (Variant extends TypographyVariantOptions
	?
	DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>
	:
	DetailedHTMLProps<HTMLAttributes<HTMLHeadElement>, HTMLHeadElement>) & Omit<StyledTypographyProps, 'theme'>) => {
	const { children, variant, as, ...restProps } = props

	return (
		<StyledTypography {...restProps}
		                  as={as || settings[variant as keyof typeof settings].htmlTag}
		                  variant={variant}>
			{children}
		</StyledTypography>
	)
}


export default withTheme(Typography)
