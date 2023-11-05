import { createI18nServer } from "next-international/server";
import { translations } from "~/locales/translations"

export const { getI18n, getScopedI18n, getStaticParams } = createI18nServer(translations);
