import {Col, Divider, Row, theme, Typography, useDimensions, useMain} from "@acme/ui"
import {type ReactElement} from "react";
import {interpolate} from "~/utils/utils";
import {css} from "@emotion/css"
import tw from "twin.macro"
import ContactForm from "~/components/Contact/ContactForm";
import building from "~/assets/building 2.png";
import Image from "next/image";
import MainLayout from "~/layouts/MainLayout";
import {motion, AnimatePresence} from "framer-motion"
import {useRouter} from "next/router";
import SocialLinks from "~/components/SocialLinks";
import ContactBottomSheet from "~/components/Contact/ContactBottomSheet";
import useTranslation from "next-translate/useTranslation"


const Page = () => {
	const {windowWidth, windowHeight} = useDimensions()
	const {appBarOpts} = useMain()
	const {t} = useTranslation()
	
	return (
		<Col className="h-full">
			<div className="flex flex-row-reverse h-full px-[120px] max-[1000px]:px-[40px] max-[600px]:px-[30px] max-[400px]:px-[20px]">
				<Image
					className={css`
            ${tw`
              !w-[unset]
              !bottom-0
              !top-[unset]
              z-[-1]
            `};
            height: ${windowHeight ? `${windowHeight - appBarOpts.height}px` : `calc(100% - ${appBarOpts.height}px)`} !important;
            object-position: bottom left !important;

            @media (max-width: 500px) {
	            height: 100% !important;
              width: 100% !important;
            }

            [dir="rtl"] & {
              ${tw`!left-[unset] !right-0`};
              transform: scale(-1, 1);
            }
					`}
					src={building}
					alt={''}
					loading={"lazy"}
					layout='fill'
					objectFit='contain'/>
				
				<Col className="w-[700px] h-full">
					<Row
						className="items-center justify-center w-[100%] max-[800px]:pt-0">
						<Typography className={`whitespace-nowrap max-[1000px]:w-fit max-[1000px]:text-inherit`}
						            variant="h2"
						            color={theme.colorScheme.primary}>
							{t('common:contact')}
						</Typography>
						
						<Divider className="ml-[16px] rtl:mr-[16px] mt-[6px] min-[1000px]:mr-[140px] min-[1000px]:rtl:ml-[140px]"
						         color={theme.colorScheme.primary}/>
					</Row>
					
					<ContactForm/>
					
					<Row tw="items-center justify-center max-[800px]:hidden">
						<Row className="pt-[14px] pb-[24px] justify-center space-x-[18px] rtl:space-x-reverse items-center w-[60%]">
							<Divider className="max-[800px]:hidden"
							         thickness={'2px'}/>
							<SocialLinks/>
							<Divider className="max-[800px]:hidden"
							         thickness={'2px'}/>
						</Row>
					</Row>
				</Col>
			</div>
			
			<ContactBottomSheet tw="justify-center min-[800px]:hidden py-[6px]">
				<SocialLinks className="w-[60%] justify-around"/>
			</ContactBottomSheet>
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
					translateX: dir === 'rtl' ? '-100%' : '100%'
				},
				animate: {
					translateX: 0,
					transition: {
						duration: 1.5
					}
				},
				exit: {
					translateX: dir === 'rtl' ? '-100%' : '100%',
					transition: {
						duration: 1.5
					}
				}
			} : {
				initial: {
					opacity: 0,
					translateY: '100%'
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
					translateY: '100%',
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

Page.getLayout = (page: ReactElement) => (
	<MainLayout>
		<AnimatePresence initial={false} mode={"popLayout"}>
			{page}
		</AnimatePresence>
	</MainLayout>
)

export default Page
