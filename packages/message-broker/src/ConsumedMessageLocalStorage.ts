import { AsyncLocalStorage } from "node:async_hooks";
import type logger from "@acme/logger"


interface MessageLocalStorageStore {
	systemProcessId: string
	initializedAtService: typeof logger.servicesMap[number]["name"]
	sentByUser: string
}

export default class MessageLocalStorage {
	static asyncLocalStorage = new AsyncLocalStorage<MessageLocalStorageStore> ()

	static getStore() {
		return MessageLocalStorage.asyncLocalStorage.getStore ()
	}

	static setStore(store: any) {
		MessageLocalStorage.asyncLocalStorage.enterWith(store)
	}

	static run<T extends Promise<unknown>>({ systemProcessId, initializedAtService, sentByUser }: MessageLocalStorageStore, callback: () => T) {
		return MessageLocalStorage.asyncLocalStorage.run ({ systemProcessId, initializedAtService, sentByUser }, callback)
	}
}
