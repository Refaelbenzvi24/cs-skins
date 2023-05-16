import {GetServerSideProps} from "next"
import {ReactElement, useEffect} from "react";
import AdminLayout from "~/layouts/AdminLayout";
import {useSession} from "next-auth/react"
import {useRouter} from "next/router"
import useTranslation from "next-translate/useTranslation"
import {api} from "~/utils/api";
import {Card, Col, Icon, Row, theme, Typography} from "@acme/ui";
import IconCarbonPhoneFilled from "~icons/carbon/phoneFilled"
import IconIcOutlineEmail from "~icons/ic/outlineEmail"
import {getProxySSGHelpers} from "~/utils/ssg";

export const getServerSideProps: GetServerSideProps = async (context) => {
	const leadId = context.params?.leadId as string
	const ssg = await getProxySSGHelpers(context)
	
	await ssg.leads.getById.prefetch(leadId)
	
	return {
		props: {
			trpcState: ssg.dehydrate()
		},
	}
}

const Page = () => {
	const router = useRouter();
	const {status} = useSession()
	const {t} = useTranslation()
	
	const leadId = router.query?.leadId as string || ''
	
	useEffect(() => {
		if (status === 'unauthenticated') void router.push('/admin/login')
	}, [status])
	
	const {data: lead} = api.leads.getById.useQuery(leadId)
	
	
	return (
		<Col className="h-full justify-center items-center max-[700px]:px-10 max-[700px]:py-20">
			<Card
				className="flex flex-col p-[20px] min-[700px]:w-[640px] max-[700px]:w-full min-[700px]:h-[400px] max-[700px]:h-full"
				noPadding>
				<Typography
					color={theme.colorScheme.primary}
					darkColor={theme.colorScheme.primary}
					variant={'h3'}>
					{lead?.name}
				</Typography>
				
				<Col className="pt-[14px] space-y-[10px]">
					<Row>
						<Icon
							className="ltr:mr-[8px] rtl:ml-[8px]"
							color={theme.colorScheme.secondary}>
							<IconCarbonPhoneFilled/>
						</Icon>
						
						<Typography
							color={theme.colorScheme.subtitle1}
							darkColor={theme.colorScheme.subtitle2}
							variant={'body'}>
							{lead?.phone}
						</Typography>
					</Row>
					
					<Row>
						<Icon
							className="ltr:mr-[8px] rtl:ml-[8px]"
							color={theme.colorScheme.secondary}>
							<IconIcOutlineEmail/>
						</Icon>
						
						<Typography
							color={theme.colorScheme.subtitle1}
							darkColor={theme.colorScheme.subtitle2}
							variant={'body'}>
							{lead?.email}
						</Typography>
					</Row>
				</Col>
				
				<Col className="pt-[32px]">
					<Typography
						color={theme.colorScheme.subtitle1}
						darkColor={theme.colorScheme.subtitle2}
						variant={'body'}>
						{lead?.message ? lead?.message : t('common:noMessage')}
					</Typography>
				</Col>
			</Card>
		</Col>
	)
}

Page.getLayout = (page: ReactElement) => (
	<AdminLayout>
		{page}
	</AdminLayout>
)

export default Page
