<script setup lang="ts">
import {ref, getCurrentInstance, onMounted, reactive,toRaw,defineExpose} from 'vue'
import {eachRight, random} from "lodash"

defineProps<{ msg: string }>()

let proxy = null
let person = reactive({
  name:'zhagnsan',
  age:12
})

defineExpose({
  person
})

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

enum BlockType {
  type1,
  type2,
}


function deepCopy(data) {
  data = JSON.stringify(data).length > 1 ? data : {}
  return JSON.parse(JSON.stringify(data))
}
function showProxy(){
  console.log(root.value.getBoundingClientRect().left)
  console.log(root.value.offsetWidth)
}

function getRandomBlock() {
  let r = random(0, 1);
  return BlockType[r]
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
    <h1>{{ (26000).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') }}
    </h1>
  <!--  <h1>{{ person }}</h1>-->

    <div class="card">
      <button type="button" @click="count++">count is {{ count }}</button>
      <p>
        Edit
        <code>components/HelloWorld.vue</code> to test HMR
      </p>
      <button type="button" @click="showProxy">showProxy</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.read-the-docs {
  color: #888;
}
</style>
