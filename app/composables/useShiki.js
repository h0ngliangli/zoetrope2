import { codeToHtml } from "shiki"

export const useShiki_CodeToHtml = async (code, language) => {
  return await codeToHtml(code, { lang: language, theme: "vitesse-dark" })
}
