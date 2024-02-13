import type {default as apmElastic} from "elastic-apm-node"

export default class GlobalHelpers {
	static apm?: typeof apmElastic

	static setApmInstance(apm: typeof apmElastic | undefined){
		GlobalHelpers.apm = apm
	}
}
