<script setup lang="ts">
import {ref, getCurrentInstance, onMounted, reactive,toRaw,defineExpose} from 'vue'
import {eachRight, random} from "lodash"

defineProps<{ msg: string }>()

let proxy = null
let person = ref({
  name:'zhagnsan',
  age:12
})

defineExpose({
  person
})

function showProxy(e){
  person.value = {}
}

function showProxy1(e){
  person.value.name = e.target.value
}

let root = ref(null)

// 更改 message 的值，data是从子组件传过来的
function changeMessage(data) {
  console.log(data)
}

function changeMsg(data){
  changeMessage(data)
}

onMounted(()=>{
  proxy = getCurrentInstance()
})


function deepCopy(data) {
  data = JSON.stringify(data).length > 1 ? data : {}
  return JSON.parse(JSON.stringify(data))
}

const count = ref(0)

const board: Array<Array<number>> = [];

for (let i = 0; i < 9; i++) {
  board[i] = []
  for (let j = 0; j < 9; j++) {
    board[i][j] = Math.random() * 10
  }
}

</script>

<template>
  <div ref="root">
    <!--数据双向绑定-->
    <span>{{ person }}</span>

    <div class="card">
      <button type="button" @click="count++">count is {{ count }}</button>
      <p>
        Edit
        <code>components/HelloWorld.vue</code> to test HMR
      </p>
      <button type="button" @click="showProxy($event)">showProxy</button>
      <button type="button" @click="showProxy1($event)">showProxy</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.read-the-docs {
  color: #888;
}
</style>
