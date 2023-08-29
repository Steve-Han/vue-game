<script setup lang="ts">
import {ref, getCurrentInstance, onMounted, reactive, toRaw} from 'vue'
import {eachRight, random} from "lodash"

defineProps<{ msg: string }>()

let isDanger = ref(true);
let proxy = null
let person = ref({
  name: 'zhagnsan',
  age: 12
})

let stu = reactive({
  name: '哈哈',
  age: 123
})

let grid = reactive(new Array(32).fill({}))

defineExpose({
  person
})

function showProxy(e) {
  isDanger.value = !isDanger.value;
  //先清空stu的属性
  //clear(stu)
  //再设置
  Object.assign(stu, {'trick': 'joke'})
}


function showProxy1(e) {
  console.log('showProxy1')
}

let root = ref(null)

// 更改 message 的值，data是从子组件传过来的
function changeMessage(data) {
  console.log(data)
}

function changeMsg(data) {
  changeMessage(data)
}

onMounted(() => {
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

function contextmenu(event) {
  let number = parseInt("123");
  console.log(number)
}

</script>

<template>
  <div ref="root" @contextmenu.prevent="contextmenu"> <!--阻止右键的默认行为-->
    <!--数据双向绑定-->
    <span>{{ stu }}</span>

    <div class="card">
      <button type="button" @click="count++">count is {{ count }}</button>
      <p>
        Edit
        <code>components/HelloWorld.vue</code> to test HMR
      </p>
      <button type="button" @click="showProxy($event)">showProxy</button>
      <button type="button" @click="showProxy1($event)">showProxy1</button>
    </div>
    <a href="https://baidu.com">Click me...</a>
  </div>
</template>

<style lang="scss" scoped>
$list :white, grey, green, red , blue, #aaa;
$map :(1:white, 2:grey, 3:green, 4:blue);

a{
  color: nth($list,6);
}

.error{
  background-color: red;
  border: 1px black solid;
}

.danger{
  @extend .error;
  color: red;
}

</style>
