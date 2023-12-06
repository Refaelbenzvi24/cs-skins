export * as jsonAgg from "./jsonAgg"
import _ from "lodash"

export const addOperatorByParametersNil = <ParametersKeys extends string | number | symbol, ParametersValues, CallbackReturning>(parameters: Record<ParametersKeys, ParametersValues>, callback: (parameters: Record<ParametersKeys, Exclude<ParametersValues, null | undefined>>) => CallbackReturning) => {
	if (Object.keys (parameters).every ((key) => !_.isNil (parameters[key as keyof typeof parameters]) && !_.isEmpty (parameters[key as keyof typeof parameters]))) {
		return callback (parameters as Record<ParametersKeys, Exclude<ParametersValues, null | undefined>>)
	}
}
