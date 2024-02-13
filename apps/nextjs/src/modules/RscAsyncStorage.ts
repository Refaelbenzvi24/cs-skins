import { AsyncLocalStorage } from "node:async_hooks"


interface RscLocalStorageStore {
}

export default class RscAsyncStorage {
	private static asyncLocalStorage = new AsyncLocalStorage<RscLocalStorageStore>()

	static getStore(){
		return RscAsyncStorage.asyncLocalStorage.getStore()
	}

	static run<T extends Promise<unknown>>({}: RscLocalStorageStore, callback: () => T){
		return RscAsyncStorage.asyncLocalStorage.run({}, callback)
	}
}
