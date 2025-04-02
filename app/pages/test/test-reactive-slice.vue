<!-- eslint-disable vue/html-self-closing -->
<!--这里主要测试基于reactive变量中的内容生成子集是否仍然是reactive -->

<template>
  <div>
    <div>rcommon的内容</div>
    <div>{{ rcommon }}</div>
    <div>rcommon2的内容</div>
    <div>{{ rcommon2 }}</div>
    <div>r1的内容</div>
    <div>{{ r1 }}</div>
    <div>r2的内容</div>
    <div>{{ r2 }}</div>
    <div>r1.common</div>
    <input v-model="r1.common" type="text" class="border" />
    <div>r2.common</div>
    <input v-model="r2.common" type="text" class="border" />
    <div>r1.common2_a</div>
    <input v-model="r1.common2_a" type="text" class="border" />
    <div>结论</div>
    <p>r1.common和r2.common共享r0, 可以实现共享.</p>
    <p>r1.common2_a和r2.common2_b共享rcommon2, 但是rcommon2的没有发生改变.</p>
    <p>尽量不要共享reactive.</p>
  </div>
</template>

<script setup>
const rcommon = ref(0)
const rcommon2 = reactive({
  a: 1,
  b: 2,
})
const r1 = reactive({
  a: 1,
  common: rcommon,
  common2_a: rcommon2.a,
})
const r2 = reactive({
  common: rcommon,
  common2_b: rcommon2.b,
  c: 3,
})
</script>
