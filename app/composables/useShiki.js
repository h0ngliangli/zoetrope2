import { codeToHtml } from "shiki"

export const shikiCodeToHtml = async (code, language) => {
  return await codeToHtml(code, { lang: language, theme: "vitesse-dark" })
}
