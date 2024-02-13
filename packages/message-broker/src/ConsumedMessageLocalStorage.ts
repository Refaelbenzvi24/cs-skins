import { AsyncLocalStorage } from "node:async_hooks";
import type logger from "@acme/logger"


interface MessageLocalStorageStore {
	traceparent?: string
}

export default class MessageLocalStorage {
	private static asyncLocalStorage = new AsyncLocalStorage<MessageLocalStorageStore>()

	static getStore(){
		return MessageLocalStorage.asyncLocalStorage.getStore()
	}

	static setStore(store: any){
		MessageLocalStorage.asyncLocalStorage.enterWith(store)
	}

	static run<T extends Promise<unknown>>({ traceparent }: MessageLocalStorageStore, callback: () => T){
		return MessageLocalStorage.asyncLocalStorage.run({ traceparent }, callback)
	}
}
