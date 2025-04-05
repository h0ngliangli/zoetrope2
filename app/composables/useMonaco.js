import loader from "@monaco-editor/loader"

// 初始化monaco, 下载monaco package并返回package导出的monaco对象
const monaco = await loader.init()

// 返回monaco对象
export const useMonaco = () => {
  return monaco
}

// 创建monaco.editor实例. options参数参考
// https://microsoft.github.io/monaco-editor/docs.html#interfaces/editor.IStandaloneEditorConstructionOptions.html
export const useMonaco_CreateEditor = (container, options) => {
  const mergedOptions = {
    // default options
    bracketPairColorization: { enabled: true },
    fontSize: 16,
    language: "plaintext",
    lineDecorationsWidth: 0,
    lineHeight: 24,
    lineNumbers: "off",
    lineNumbersMinChars: 0,
    minimap: { enabled: false },
    renderLineHighlight: "none",
    scrollBeyondLastLine: false,
    theme: "vs-dark",
    wordWrap: "on",
    // override options
    ...options,
  }

  return monaco.editor.create(container, mergedOptions)
}
