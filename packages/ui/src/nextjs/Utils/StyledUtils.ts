export const shouldForwardProp = <T extends object>(props: (keyof T)[]) => (propName: keyof T) => {
	return ![...props, 'theme'].includes(propName)
}
