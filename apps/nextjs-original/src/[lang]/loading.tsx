"use client"

import useTranslation from "next-translate/useTranslation"

export default function Loading() {
	const { t } = useTranslation ()
	return <p>{t`loading`}</p>
}
