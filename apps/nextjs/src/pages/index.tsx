import {Col, useDimensions, useMain} from "@acme/ui"
import {type ReactElement} from "react"
import {interpolate} from "~/utils/utils"
import {css} from "@emotion/css"
import tw from "twin.macro"
import Home from "~/components/Home/Home"
import MainLayout from "~/layouts/MainLayout"
import {motion, AnimatePresence} from "framer-motion"
import {useRouter} from "next/router"
import useTranslation from "next-translate/useTranslation"

const Page = () => {
	const {windowWidth} = useDimensions()
	const {appBarOpts} = useMain()
	const {t} = useTranslation()
	
	const homeData = {
		name: t('common:companyName'),
		secondaryTitle: t('home:secondaryTitle'),
		description: <>
			{'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat'}
		</>,
		resumeLink: 'https://drive.google.com/file/d/13Ka8Ii_-iuz22BqavhnzsT9oC-y509cs/view?usp=sharing',
	} as const
	
	return (
		<Col
			className={`z-[10] h-full mx-auto ${css`
        padding-left: ${interpolate(windowWidth, [160, 20], [1300, 200])}px;
        padding-right: ${interpolate(windowWidth, [160, 20], [1300, 200])}px;
			`}`}
			transition={{
				delay: 1.5,
				duration: 0.5,
			}}>
			<div className={css`
        ${tw`w-full`};
        height: calc(100% - ${appBarOpts.height}px);
			`}>
				<Home {...homeData}/>
			</div>
		</Col>
	)
}


Page.getTransition = (page: ReactElement) => {
	const {asPath} = useRouter()
	const {windowWidth} = useDimensions()
	const {lang} = useTranslation()
	const dir = lang === 'he' ? 'rtl' : 'ltr'
	
	return (
		<motion.div
			className="h-full"
			{...(windowWidth && (windowWidth > 800) ? {
				initial: {
					translateX: dir === 'rtl' ? '100%' : '-100%'
				},
				animate: {
					translateX: 0,
					transition: {
						duration: 1.5
					}
				},
				exit: {
					translateX: dir === 'rtl' ? '100%' : '-100%',
					transition: {
						duration: 1.5
					}
				}
			} : {
				initial: {
					opacity: 0,
					translateY: '-100%'
				},
				animate: {
					opacity: 1,
					translateY: 0,
					transition: {
						duration: 1
					}
				},
				exit: {
					opacity: 0,
					translateY: '-100%',
					transition: {
						duration: 1
					}
				}
			})}
			key={asPath}>
			{page}
		</motion.div>
	)
}

Page.getLayout = (page: ReactElement) => {
	return (
		<MainLayout>
			<AnimatePresence initial={false} mode={"popLayout"}>
				{page}
			</AnimatePresence>
		</MainLayout>
	)
}

export default Page
