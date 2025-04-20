<template>
  <div class="flex flex-col h-screen">
    <header
      class="bg-gray-800 text-white p-1 flex flex-row items-center gap-4 pl-4"
    >
      <ULink to="/add" :disabled="!loggedIn">
        新建
        <ShortcutHere keys="shift_n" @keydown="navigateTo({ path: '/add' })" />
      </ULink>
      <ULink to="/exec" :disabled="!loggedIn">
        练习
        <ShortcutHere keys="shift_e" @keydown="navigateTo({ path: '/exec' })" />
      </ULink>
      <UInput
        ref="refInputKw"
        v-model="refKw"
        class="w-32"
        placeholder="关键字或id"
        :disabled="!loggedIn"
        @keydown.enter="onEdit"
      >
        <!-- search 快捷键 -->
        <template v-if="refKw.length == 0" #trailing>
          <ShortcutHere
            keys="/"
            @keydown="
              () => {
                console.log('search', refInputKw)
                refInputKw.inputRef.focus()
              }
            "
          />
        </template>
      </UInput>
      <div class="flex flex-row items-center gap-2 ml-auto">
        <UButton v-if="!loggedIn" @click="login()">登陆</UButton>
        <UDropdownMenu
          v-else
          :items="[
            {
              label: '退出',
              icon: 'i-lucide-log-out',
              onSelect: ()=>{logout()},
            },
          ]"
        >
          <UAvatar :src="loggedIn ? `/api/avatar` : null" />
        </UDropdownMenu>
      </div>
    </header>
    <main class="flex-grow p-4">
      <slot />
    </main>
  </div>
</template>

<script setup>
const { loggedIn, clear } = useUserSession()

const refKw = ref("")
const refInputKw = ref(null)
const router = useRouter()

const login = async () => {
  await navigateTo('/api/auth/google', { external: true })
  // window.location.href = "/api/auth/google"
}

const logout = async () => {
  await clear()
  router.replace("/")
}

const onEdit = async () => {
  let kw = refKw.value
  refKw.value = ""
  if (!kw) {
    return
  }
  kw = kw.trim()
  const id = Number.parseInt(kw)
  if (Number.isInteger(id)) {
    // 直接跳转到编辑页面
    navigateTo({ path: `/edit/${id}` })
    return
  }
  // 直接跳转到搜索页面
  // const encoded = encodeURIComponent(q)
  // console.log("encoded", encoded)
  await navigateTo({ path: `/search/${kw}` })
}
</script>
