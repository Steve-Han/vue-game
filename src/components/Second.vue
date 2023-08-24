<script setup lang="ts">
import {ref, getCurrentInstance, onMounted, reactive,toRaw,defineExpose, defineEmits} from 'vue'
import {eachRight, random} from "lodash"

defineProps<{ msg: string }>()

let proxy = ref(1)

// 注册一个自定义事件名，向上传递时告诉父组件要触发的事件。
const emit = defineEmits(['changeMsg'])

function handleClick() {
  // 参数1：事件名
  // 参数2：传给父组件的值
  emit('changeMsg', '鲨鱼辣椒')
}

</script>

<template>
  <h1>{{ proxy }}</h1>
  <button @click="handleClick">子组件的按钮</button>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
