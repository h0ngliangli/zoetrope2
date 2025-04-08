<template>
  <div class="flex flex-col gap-2">
    <div class="text-lg m-auto" style="max-width: 80%">
      <MarkdownPreview v-model="refModel.q" />
    </div>
    <div class="m-auto"><TagsText :text="refModel.tags" /></div>
    <div>
      <MonacoTextArea
        ref="refEditor"
        v-model:text="refModel.userA"
        v-model:language="refModel.alang"
        maxrows="15"
      />
    </div>
    <div v-if="refResult === true" class="text-(--ui-success)">回答正确</div>
    <div v-else-if="refResult === false" class="text-(--ui-error)">
      回答错误
    </div>
    <MonacoTextArea
      v-show="refShowA"
      v-model:text="refModel.a"
      v-model:language="refModel.alang"
      hide-language
      maxrows="15"
      readonly
    />
    <div class="flex flex-row gap-2">
      <UButton @click="onCheckA">提交(s)</UButton>
      <UButton :loading="refLoading" @click="loadFlashcard({ reload: false })">
        下一题(shift_n)
      </UButton>

      <UButton trailing-icon="i-lucide-arrow-right" @click="onEdit">
        编辑 {{ refModel.id }}(e)
      </UButton>
    </div>
    <div>
      <div @click="toggleRefShowNote">
        附注:
        <!-- n-n 在production模式下不work -->
        <ShortcutHere keys="n" @keydown="toggleRefShowNote" />
      </div>
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
const route = useRoute()
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
const refResult = ref(null)
const refLoading = ref(false)
const refShowA = ref(false)
const refShowNote = ref(false)
const refNote = ref(null)
const refEditor = useTemplateRef("refEditor")

//
const loadFlashcard = async ({ reload = false }) => {
  refLoading.value = true
  refShowA.value = false
  refModel.userA = ""
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
    // 这里直接调用会导致monaco editor无法接受任何输入, 可能的原因是因为
    // monaco editor还没有完全加载完成 就算用nextTick也不行
    // 这里使用setTimeout来解决这个问题
    // onFocus()
    // nextTick(onFocus)
    // setTimeout(() => {
    //   onFocus()
    // }, 500)
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

const onCheckA = () => {
  if (refModel.userA.trim() === refModel.a.trim()) {
    refResult.value = true
  } else {
    refResult.value = false
  }
  refShowA.value = true
}

const onFocus = () => {
  refEditor.value.focus()
}

const toggleRefShowNote = () => {
  refShowNote.value = !refShowNote.value
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
    a: () => {
      onFocus()
    },
    e: () => {
      onEdit()
    },
    shift_n: () => {
      loadFlashcard({ reload: false })
    },
    s: () => {
      onCheckA()
    },
  })
  console.log("defined shortcuts", _)

  if (Number.isInteger(Number.parseInt(route.params.id))) {
    refModel.id = Number.parseInt(route.params.id)
    loadFlashcard({ reload: true })
  } else {
    // 如果是新建卡片，直接赋值
    refModel.id = 0
    loadFlashcard({ reload: false })
  }
}

// 根据refModel.id的变化，自动跳转到url
watch(
  () => refModel.id,
  (newId, _) => {
    router.replace(`/exec/${newId}`)
  }
)

onMounted(async () => {
  await init()
})
</script>
