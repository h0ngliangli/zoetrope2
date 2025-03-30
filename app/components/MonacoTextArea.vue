<template>
  <div>
    <!-- 语言选择元素 -->
    <UDropdownMenu
      :items="[
        {
          label: 'HTML',
          onSelect: () => onSelectLanguage('html'),
        },
        {
          label: 'JavaScript',
          onSelect: () => onSelectLanguage('javascript'),
        },
        {
          label: 'JSON',
          onSelect: () => onSelectLanguage('json'),
        },
        {
          label: 'Markdown',
          onSelect: () => onSelectLanguage('markdown'),
        },
        {
          label: 'Shell',
          onSelect: () => onSelectLanguage('shell'),
        },
      ]"
    >
      <UButton
        :label="thisLanguageButtonLabel"
        icon="i-lucide-menu"
        color="neutral"
        variant="outline"
      />
    </UDropdownMenu>

    <!-- editor container -->
    <div ref="thisEditorElement" class="border" />
    <!-- debug info -->
    <DebugInfo v-model="thisDebugInfo" />
  </div>
</template>

<script setup>
const props = defineProps({
  /* 最小显示行数 */
  minrows: {
    type: Number,
    default: 3,
  },
  /* 最大显示行数, null不设限制 */
  maxrows: {
    type: [Number, null],
    default: null,
  },
  fontsize: {
    type: Number,
    default: 16,
  },
  language: {
    type: String,
    default: "markdown",
  },
})
// variables
const globalMonaco = useMonaco()
const thisLanguage = ref(props.language)
const thisEditorElement = ref(null)
let thisEditorInstance = null
const thisDebugInfo = ref(null)
const thisLanguageButtonLabel = computed(() => {
  return `语言 ${thisLanguage.value}`
})
const thisPropMinrows = computed(() => {
  if (props.minrows < 1) {
    return 1
  }
  return props.minrows
})
const lineHeight = props.fontsize * 1.5

// events
const onSelectLanguage = (newLanguage) => {
  if (thisLanguage.value === newLanguage) {
    return
  }
  thisLanguage.value = newLanguage
  if (thisEditorInstance && thisEditorInstance.getModel()) {
    globalMonaco.editor.setModelLanguage(
      thisEditorInstance.getModel(),
      thisLanguage.value
    )
  }
}

// init
onMounted(() => {
  thisEditorInstance = globalMonaco.editor.create(thisEditorElement.value, {
    bracketPairColorization: {
      enabled: true,
    },
    fontSize: props.fontsize,
    language: "markdown",
    lineDecorationsWidth: 0, // 限制行号和内容之间的宽度
    lineHeight: lineHeight, // 行高
    lineNumbers: "on", // 显示行号
    lineNumbersMinChars: 0, // 行号最小宽度
    minimap: {
      enabled: false,
    },
    renderLineHighlight: "none", // 不高亮当前行
    scrollBeyondLastLine: false,
    theme: "vs-dark",
  })
  // 初始化editor高度
  thisEditorElement.value.style.height = `${props.minrows * lineHeight}px`
  thisEditorInstance.layout()

  // 根据内容调整editor高度
  thisEditorInstance.onDidContentSizeChange(() => {
    // content height是内容全部的高度px
    const contentHeight = thisEditorInstance.getContentHeight()
    // 通过下面语句获得lineHeight
    // const lineHeight = editor.getOption(monaco.editor.EditorOption.lineHeight)
    const minHeight = thisPropMinrows.value * lineHeight
    const maxHeight =
      props.maxrows == null ? Infinity : props.maxrows * lineHeight
    console.log("maxHeight", maxHeight)
    const finalHeight = Math.min(Math.max(contentHeight, minHeight), maxHeight)
    thisEditorElement.value.style.height = `${finalHeight}px`
    thisDebugInfo.value = {
      contentHeight,
      minHeight,
      maxHeight,
      finalHeight,
    }
    thisEditorInstance.layout() // 重新布局
  })
})
</script>
