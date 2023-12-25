import dbOperators from "./dbOperators"


export * as jsonAgg from "./jsonAgg"
import _ from "lodash"
import { jsonAgg, } from "./jsonAgg"


export const addOperatorByParametersNil = <ParametersKeys extends string | number | symbol, ParametersValues, CallbackReturning>(parameters: Record<ParametersKeys, ParametersValues>, callback: (parameters: Record<ParametersKeys, Exclude<ParametersValues, null | undefined>>) => CallbackReturning) => {
	const isNotNil = Object.keys(parameters).every((key) => (!_.isNil(parameters[key as keyof typeof parameters]) && !_.isEmpty(parameters[key as keyof typeof parameters]) || _.isDate(parameters[key as keyof typeof parameters])))
	if(isNotNil){
		return callback(parameters as Record<ParametersKeys, Exclude<ParametersValues, null | undefined>>)
	}
}

export const extendedDbOperators = { ...dbOperators, ...jsonAgg }
