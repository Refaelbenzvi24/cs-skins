"use client";
import styled from "@emotion/styled"
import { motion } from "framer-motion"
import tw from "twin.macro"
import { withTheme } from "@emotion/react"


const LongDivider = styled(motion.hr)`
	${tw`flex-row border-t border-gray-700`}
`

export default withTheme(LongDivider)
