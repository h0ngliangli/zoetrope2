<!--
    查询页面,拥有输入框,查询按钮,查询结果展示区域
    * 输入框: 用于输入查询内容
    * 查询按钮: 点击后触发查询
    * 查询结果展示区域: 显示查询结果
    * 结果列表: 显示查询结果的列表
    * 点击结果:跳转到edit页面
-->
<template>
  <div>
    <div id="查询栏" class="flex flex-row gap-2">
      <UFormField class="flex-1">
        <template #label>
          查询
          <UKbd>Enter</UKbd>
        </template>
        <UInput
          v-model="refModel.query"
          class="w-full"
          autofocus
          @keydown.enter="onSearch"
        />
        <template v-if="refModel.queryStatus === false" #error>
          <UInput v-model="refModel.query" class="w-full" readonly />
          <div class="text-red-500">查询失败</div>
        </template>
        <template v-if="refModel.queryStatus === true" #help>
          <span class="text-(--ui-success)">查询成功!</span>
        </template>
      </UFormField>
      <UButton class="m-2" :loading="refModel.loading" @click="onSearch">
        查询
      </UButton>
      <!-- <UButton
              class="m-2"
              trailing-icon="i-lucide-arrow-right"
              @click="onEdit"
            >
              编辑 {{ refModel.id }}
              <UKbd>E</UKbd>
            </UButton> -->
    </div>
    <div id="查询结果">
      <UPagination v-model:page="page" :total="refModel.queryDataLength" />
      <div id="查询结果grid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <UCard v-for="(item, index) in computedPagedResult" :key="index">
          <template #header>
            {{ item.q }}
          </template>
        </UCard>
      </div>
    </div>
    <div>
      <DebugInfo v-model="refModel" />
    </div>
  </div>
</template>

<script setup>
const refModel = reactive({
  query: "",
  loading: false,
  queryStatus: null, // null, true, false
  queryData: [],
  queryDataLength: 0,
  page: 1,
})

const onSearch = async () => {
  if (!refModel.query) {
    return
  }
  refModel.loading = true
  refModel.queryStatus = null
  try {
    const response = await $fetch(`/api/search/${refModel.query}`)
    if (response.ok) {
      refModel.queryData = response.data
      refModel.queryDataLength = response.data.length
      refModel.queryStatus = true
      refModel.page = 1
    } else {
      refModel.queryStatus = false
    }
  } catch (error) {
    console.error("Error:", error)
    refModel.queryStatus = false
  } finally {
    refModel.loading = false
  }
}

const funcGeneratePagedResult = () => {
  const startIndex = (refModel.page - 1) * 10
  const endIndex = startIndex + 10
  return refModel.queryData.slice(startIndex, endIndex)
}

const computedPagedResult = computed(() => funcGeneratePagedResult())
</script>
