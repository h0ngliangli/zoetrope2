<template>
  <div class="p-4 flex flex-col gap-2">
    <div>提问: {{ refModel.q }}</div>
    <div>标签: {{ refModel.tags }}</div>
    <div>
      <UFormField>
        <template #label>
          答案
          <UKbd>Ctrl</UKbd>+<UKbd>Enter</UKbd>
        </template>
        <MonacoTextArea
          ref="refEditor"
          v-model:text="refModel.userA"
          v-model:language="refModel.alang"
        />
      </UFormField>
    </div>

    <div>
      <UButton
        class="m-2"
        :loading="refLoading"
        @click="loadFlashcard({ reload: false })"
      >
        下一题
        <UKbd>enter</UKbd>
      </UButton>

      <UButton class="m-2" trailing-icon="i-lucide-arrow-right" @click="onEdit">
        编辑 {{ refModel.id }}
        <UKbd>E</UKbd>
      </UButton>
    </div>
    <div>
      <div>附注: <UKbd>N</UKbd></div>
      <UCollapsible v-model:open="refShowNote" :unmount-on-hide="false">
        <template #content>
          <div ref="refNote" class="markdown">&nbsp;</div>
        </template>
      </UCollapsible>
    </div>

    <!-- <DebugInfo v-model="refModel" /> -->
  </div>
</template>

<script setup>
import markdownit from "markdown-it"
import shiki from "@shikijs/markdown-it"

// vars
const md = markdownit()
const router = useRouter()
const refModel = reactive({
  id: 0,
  q: "",
  a: "",
  alang: "plaintext",
  userA: "",
  tags: "",
  note: "",
})
const refTest = ref("test")
const refA = useTemplateRef("refA")
const refResult = ref(null)
const refLoading = ref(false)
const refShowNote = ref(false)
const refShowDebug = ref(false)
const refNote = ref(null)
const refEditor = useTemplateRef("refEditor")

//
const loadFlashcard = async ({ reload = false }) => {
  refLoading.value = true
  refShowNote.value = false
  refResult.value = null
  let response = null
  if (reload && refModel.id !== 0) {
    console.log("reloading ", refModel.id)
    response = await $fetch(`/api/get/${refModel.id}`)
  } else {
    console.log("getting a new random question")
    response = await $fetch("/api/get/random")
  }
  if (response.ok) {
    console.log(response.data)
    refModel.id = response.data.id
    refModel.q = response.data.q
    refModel.userA = ""
    refModel.alang = response.data.alang || "plaintext"
    refModel.a = response.data.a
    refModel.tags = response.data.tags
    refModel.note = response.data.note
    refTest.value = refModel
    onFocus()
    if (refModel.note) {
      console.log("refNote", refNote)
      refNote.value.innerHTML = md.render(refModel.note)
    } else {
      refNote.value.innerHTML = "(空)"
      refShowNote.value = true
    }
  } else {
    showErrorToast(response.message)
  }
  setTimeout(() => {
    refLoading.value = false
  }, 1000)
}

const onCheckA = async (event) => {
  if (event.ctrlKey && event.key === "Enter") {
    console.log("ctrl + enter pressed")
    // effect of checking answer
    await playCheckEffect()
    if (refModel.userA === refModel.a) {
      console.log("correct")
      refResult.value = true
    } else {
      console.log("wrong")
      refResult.value = false
    }
  }
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const playCheckEffect = async () => {
  for (let i = 0; i < 2; i++) {
    onFocus()
    await wait(100)
    onBlur()
    await wait(100)
  }
}

const onBlur = () => {
  refA.value.textareaRef.blur()
}

const onFocus = () => {
  refEditor.value.focus()
}

const onEdit = () => {
  if (refModel.id === 0) {
    return
  }
  router.push(`/edit/${refModel.id}`)
}

const init = async () => {
  // 使用shikijs作为markdown的代码高亮
  md.use(
    await shiki({
      theme: "vitesse-dark",
    })
  )
  // 监听键盘事件
  // TODO: 这里的事件监听有点问题
  // 它在production模式下没有生效, 原因可能是没有被编译到js中
  // 这里暂时通过执行输出的结果让编译器认为它被使用了
  const _ = defineShortcuts({
    enter: () => {
      loadFlashcard({ reload: false })
    },
    a: () => {
      refEditor.value.focus()
    },
    n: () => {
      refShowNote.value = !refShowNote.value
    },
    d: () => {
      refShowDebug.value = !refShowDebug.value
    },
    e: () => {
      onEdit()
    },
  })
  console.log("defined shortcuts", _)
}

onMounted(async () => {
  await init()
  loadFlashcard({ reload: true })
})
</script>
