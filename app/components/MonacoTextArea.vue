<!-- 
  这个组件是一个基于 Monaco Editor 的文本编辑器，支持多种编程语言的语法高亮和自动补全功能。
  用法:
  <MonacoTextArea
    v-model="yourModel"
    minrows="3"
    maxrows="10"
    fontsize="16"
    language="javascript"
  />
-->
<template>
  <div>
    <USelectMenu
      v-if="!props.hideLanguage"
      v-model="modelLanguage"
      value-key="label"
      :items="initLanguageItems()"
      placeholder="语言"
      class="w-36 m-1"
    />

    <!-- 编辑器容器 -->
    <div ref="refEditorContainer" class="monaco" />
    <!-- debug info -->
    <!-- <DebugInfo v-model="thisDebugInfo" /> -->
  </div>
</template>

<script setup>
const props = defineProps({
  /* 最小显示行数 */
  minrows: {
    type: Number,
    default: 3,
  },
  /* 最大显示行数, 当控件高度达到最大行数之后就不再增长. null不设限制 */
  maxrows: {
    type: [Number, String, null],
    default: null,
  },
  /* 编辑器字体大小(px) */
  fontSize: {
    type: [Number, String],
    default: 16,
  },
  /* 编辑器语言 */
  language: {
    type: String,
    default: "plaintext",
  },
  /* 隐藏语言栏 */
  hideLanguage: {
    type: Boolean,
    default: false,
  },
})

// variables

// model存储编辑器文本
// eslint-disable-next-line vue/require-prop-types
const modelText = defineModel("text", {
  default: "",
})
// eslint-disable-next-line vue/require-prop-types
const modelLanguage = defineModel("language", {
  default: "plaintext",
})
// monaco库入口
const monaco = useMonaco()
// 变量指向monaco.editor.create()的返回对象
let monacoEditor = null
// ref变量指向编辑器容器
const refEditorContainer = ref(null)
// 计算属性: 最小行数
const compMinrows = computed(() => {
  if (props.minrows < 1) {
    return 1
  }
  return props.minrows
})
// 计算属性: 最大行数
const compMaxrows = computed(() => {
  if (props.maxrows == null) {
    return Infinity
  }
  return Math.max(compMinrows.value, props.maxrows)
})
// 常数: 行高
const lineHeight = props.fontSize * 1.5
// ref变量: 调试信息
const thisDebugInfo = ref(null)

// functions
// 语言列表
const initLanguageItems = () => {
  const languages = [
    ...[
      "html",
      "javascript",
      "json",
      "markdown",
      "plaintext",
      "python",
      "sql",
      "typescript",
      "css",
      "csharp",
      "java",
      "shell",
    ].sort(),
  ]
  return languages.map((language) => ({
    label: language,
  }))
}

// 根据内容调整editor高度
const autoAjustEditorHeight = (event) => {
  if (!monacoEditor) {
    return
  }
  if (event && !event.contentHeightChanged) {
    // 如果内容高度没有变化，则不调整高度
    return
  }
  if (refEditorContainer.value == null) {
    return
  }
  const contentHeight = event
    ? event.contentHeight
    : monacoEditor.getContentHeight()
  // 通过下面语句获得lineHeight
  // const lineHeight = editor.getOption(monaco.editor.EditorOption.lineHeight)
  const minHeight = compMinrows.value * lineHeight
  const maxHeight = compMaxrows.value * lineHeight
  const finalHeight = Math.min(Math.max(contentHeight, minHeight), maxHeight)
  refEditorContainer.value.style.height = `${finalHeight}px`
  thisDebugInfo.value = {
    contentHeight,
    minHeight,
    maxHeight,
    finalHeight,
  }
  monacoEditor.layout() // 重新布局
}

// 案件处理: 当按下esc键时，blur
const blurOnEsc = (event) => {
  // console.log("event.code", event.code)
  if (event.code === "Escape") {
    // monacoEditor.blur()
    document.activeElement.blur()
  }
}

// 将用户输入的焦点设置在当前编辑器上
const focus = () => {
  if (monacoEditor) {
    monacoEditor.focus()
  }
}

defineExpose({
  focus,
})

// init
onMounted(() => {
  // 设置语言
  if (modelLanguage.value === "") {
    modelLanguage.value = props.language
  }
  monacoEditor = useMonaco_CreateEditor(refEditorContainer.value, {
    fontSize: props.fontsSize,
    language: modelLanguage.value,
    lineHeight: lineHeight,
  })
  // 显示所有支持的语言
  // console.log(
  //   "monaco.languages.getLanguages()",
  //   monaco.languages.getLanguages()
  // )
  // 事件处理
  // 设置事件响应函数(根据内容调整editor高度)
  monacoEditor.onDidContentSizeChange(autoAjustEditorHeight)
  // 监听editor内容变化 更新model
  monacoEditor.onDidChangeModelContent(() => {
    const content = monacoEditor.getValue()
    modelText.value = content
  })
  // 监听model内容变化 更新editor
  watch(modelText, (newValue) => {
    if (monacoEditor.getValue() !== newValue) {
      monacoEditor.setValue(newValue)
    }
  })
  watch(modelLanguage, (newValue) => {
    console.log("modelLanguage", newValue)
    if (monacoEditor.getModel()) {
      monaco.editor.setModelLanguage(monacoEditor.getModel(), newValue)
    }
  })

  // 设置文本
  monacoEditor.setValue(modelText.value)
  // 初始化editor高度
  autoAjustEditorHeight()

  // 监听Keyboard事件
  monacoEditor.onKeyDown(blurOnEsc)
  // 监听focus事件
  monacoEditor.onDidFocusEditorText(() => {
    //console.log("editor focus")
  })
  // 监听blur事件
  monacoEditor.onDidBlurEditorText(() => {
    //console.log("editor blur")
  })

  // 通过ResizeObserver监听编辑器容器大小变化
  const observer = new ResizeObserver((_) => {
    if (!monacoEditor) {
      return
    }
    console.log("editor container resize")
    monacoEditor.layout()
  })
  observer.observe(refEditorContainer.value)
})
</script>

<style scoped>
.monaco:focus-within {
  @apply ring-2 ring-(--ui-primary) rounded-(--ui-radius);
}
</style>
