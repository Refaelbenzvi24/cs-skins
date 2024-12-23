"use client"

import i18next from "i18next"
import { useEffect, useState } from "react"
import type { UseTranslationOptions } from "react-i18next";
import { initReactI18next, useTranslation as useTranslationOrg } from "react-i18next"
import { useCookies } from "react-cookie"
import resourcesToBackend from "i18next-resources-to-backend"
import LanguageDetector from "i18next-browser-languagedetector"
import { getOptions, languages, cookieName } from "./settings"


const runsOnServerSide = typeof window === "undefined"

// on client side the normal singleton is ok
void i18next
	.use (initReactI18next)
	.use (LanguageDetector)
	.use (resourcesToBackend ((language: string, namespace: string) => import(`../../../locales/${language}/${namespace}.yaml`)))
	.init ({
		...getOptions (),
		lng:               undefined,
		detection:         {
			order: ["path", "htmlTag", "cookie", "navigator"],
		},
		returnEmptyString: true,
		preload:           runsOnServerSide ? languages : []
	})

export const getClientLanguage = () => {
	return i18next.language
}
export const useTranslation = (lng: string = getClientLanguage (), ns?: string | string[], options?: UseTranslationOptions<never>) => {
	// const [cookies, setCookie] = useCookies ([cookieName])
	const ret = useTranslationOrg (ns, options)
	const { i18n } = ret
	if (runsOnServerSide && lng && i18n.resolvedLanguage !== lng) {
		void i18n.changeLanguage (lng)
	} else {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const [activeLng, setActiveLng] = useState (i18n.resolvedLanguage)
		// eslint-disable-next-line react-hooks/rules-of-hooks
		useEffect (() => {
			if (activeLng === i18n.resolvedLanguage) return
			setActiveLng (i18n.resolvedLanguage)
		}, [activeLng, i18n.resolvedLanguage])
		// eslint-disable-next-line react-hooks/rules-of-hooks
		useEffect (() => {
			if (!lng || i18n.resolvedLanguage === lng) return
			void i18n.changeLanguage (lng)
		}, [lng, i18n])
		// eslint-disable-next-line react-hooks/rules-of-hooks
		// useEffect (() => {
		// 	if (cookies.i18next === lng) return
		// 	setCookie (cookieName, lng, { path: "/" })
		// }, [lng, cookies.i18next, setCookie])
	}
	return {
		t:     ret.t,
		i18n:  i18n,
		ready: ret.ready
	}
}
