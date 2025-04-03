import markdownit from "markdown-it"
import shiki from "@shikijs/markdown-it"

const md = markdownit()
md.use(
  await shiki({
    theme: "vitesse-dark",
  })
)

export const useMarkdownIt_render2Html = (text) => {
  console.log("rendering markdown", text)
  const html = md.render(text)
  console.log("rendered html", html)
  return html
}
