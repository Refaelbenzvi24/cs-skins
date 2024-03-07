declare module '@elastic/apm-rum-react' {
	import type { Transaction } from '@elastic/apm-rum'
	import type { ComponentType } from 'react'
	export const withTransaction: <T>(
		name: string,
		eventType: 'page',
		callback: (tr: Transaction, props: T) => any = () => {
		}
	) => <T>(component: ComponentType<T>) => ComponentType<T>
}
