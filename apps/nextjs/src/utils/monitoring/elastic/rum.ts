import type { AgentConfigOptions } from '@elastic/apm-rum';
import { init, apm } from '@elastic/apm-rum'


const serviceName                = process.env.APP || 'next'
const config: AgentConfigOptions = {
	serviceName:               `rum-${serviceName}`,
	serverUrl:                 process.env.NEXT_PUBLIC_APM_URL || 'http://localhost:8200',
	environment:               process.env.ENVIRONMENT || 'development',
	active:                    process.env.NEXT_PUBLIC_APM_IS_ACTIVE === 'true',
	distributedTracingOrigins: [process.env.NEXT_PUBLIC_API_ENDPOINT || ''],
}

export function initRum(){
	return init(config)
}

export function captureRUMError(error: Error | string){
	if(typeof window !== 'undefined'){
		apm.captureError(error)
	}
}

// apm.setUserContext({
//     id: conseiller.id,
//     username: `${conseiller.firstName} ${conseiller.lastName}`,
//     email: conseiller.email,
//   })
