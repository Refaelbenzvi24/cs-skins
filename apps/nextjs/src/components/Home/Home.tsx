import {useState, type ReactNode} from "react"

import {css} from "@emotion/css"
import tw from "twin.macro"

import {interpolate} from "~/utils/utils"
import {Col, LinkButton, Row, theme, Typography, useDimensions, useIsDark, useMain} from "@acme/ui"
import building from "~/assets/building 1.png"
import Image from "next/image"
import SocialLinks from "~/components/SocialLinks";
import useTranslation from "next-translate/useTranslation"


interface HomeProps {
	name: string
	secondaryTitle: string
	description: ReactNode
}

const Home = (props: HomeProps) => {
	const {name, secondaryTitle, description} = props
	
	const {appBarOpts} = useMain()
	const {windowWidth, windowHeight} = useDimensions()
	const isDark = useIsDark()
	const {t} = useTranslation()
	
	return (
		<Row className={css`
      ${tw`items-center h-full w-full max-[800px]:items-start`};
		`} id="home">
			<Col className="max-w-[920px] max-[1400px]:max-w-[400px]"
			     viewport={{once: true}}>
				
				<Typography
					className="whitespace-nowrap"
					variant="bold"
					size={(windowWidth && windowWidth > 1300) ? '' : interpolate(windowWidth, [0.876, 1], [400, 1300])}
					color={theme.colorScheme.primary}>
					{t('home:welcome')}
				</Typography>
				
				<div>
					<Typography
						className="whitespace-nowrap"
						variant="h1"
						size={(windowWidth && windowWidth > 1300) ? '' : interpolate(windowWidth, [2, 4], [375, 1300])}
						darkColor={theme.colorScheme.light}
						color={theme.colorScheme.header1}>
						{name}
					</Typography>
				</div>
				
				<div>
					<Typography className={`whitespace-nowrap max-[700px]:pt-2`}
					            variant="h1"
					            size={(windowWidth && windowWidth > 1300) ? '' : interpolate(windowWidth, [1.6, 4], [200, 1300])}
					            color={theme.colorScheme.secondary}>
						{secondaryTitle}
					</Typography>
				</div>
				
				
				<div>
					<Typography
						className={css`
              ${tw`
              pt-2
							max-w-[702px]
							min-[1100px]:pl-1.5
							max-[1100px]:pl-0.5
							min-[1100px]:min-w-[500px]
							min-[500px]:min-w-[300px]
							min-[350px]:min-w-[150px]
							`};
						`}
						variant="body"
						size={(windowWidth && windowWidth > 1300) ? '' : interpolate(windowWidth, [0.84, 1], [375, 1300])}
						color={theme.colorScheme.subtitle1}
						darkColor={theme.colorScheme.subtitle2}>
						{description}
					</Typography>
				</div>
				
				<SocialLinks className="py-1.5"/>
				
				<LinkButton
					className={`mt-1 ml-1.5 min-[1100px]:ml-1 flex items-center justify-center`}
					href={'/contact'}
					width="175px"
					height="40px">
					<Typography centered variant="bold" color={theme.colorScheme.light}>
						{t('home:contact us')}
					</Typography>
				</LinkButton>
			</Col>
			
			
			<Image
				className={`${
					css`
            ${tw`
          !w-[unset]
          max-[1150px]:max-h-[600px]
          max-[900px]:max-h-[450px]
          max-[800px]:max-h-[400px]
          max-[700px]:max-h-[350px]
          max-[600px]:max-h-[300px]
          !bottom-0
          !right-0
          !top-[unset]
          !left-[unset]
          z-[-1]`};

            height: ${windowHeight ? `${windowHeight - appBarOpts.height}px` : `calc(100% - ${appBarOpts.height}px)`} !important;

            [dir="rtl"] & {
              ${tw`!left-0 !right-[unset]`};
              transform: scale(-1, 1);
            }
					`
				}
				${isDark ? css`
          filter: brightness(85%) contrast(115%) saturate(110%);
				` : ''}`}
				src={building} alt={'logo'}
				layout='fill'
				objectFit='contain'/>
		</Row>
	)
}

export default Home
