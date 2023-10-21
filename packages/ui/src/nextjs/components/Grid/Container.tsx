"use client";
import styled from "@emotion/styled"
import { motion } from "framer-motion"
import tw from "twin.macro"
import { withTheme } from "@emotion/react"


const Container = styled(motion.div)(() => [
	tw`flex mx-auto`,
])

export default withTheme(Container)
