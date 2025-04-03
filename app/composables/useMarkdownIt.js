import markdownit from "markdown-it"
import shiki from "@shikijs/markdown-it"

const md = markdownit()
md.use(
  await shiki({
    theme: "vitesse-dark",
  })
)

export const useMarkdownIt_render2Html = (text) => {
  const html = md.render(text)
  return html
}
