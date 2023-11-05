"use client";
import styled from "@emotion/styled"
import { motion } from "framer-motion"
import tw from "twin.macro"
import { withTheme } from "@emotion/react"


const Tab = styled(motion.a)(() => [
	tw`cursor-pointer z-[11] !bg-transparent`,
])

export default withTheme(Tab)
