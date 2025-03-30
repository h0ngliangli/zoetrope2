import loader from "@monaco-editor/loader"

const monaco = await loader.init()
console.log("monaco", monaco)
export const useMonaco = () => {
  return monaco
}
