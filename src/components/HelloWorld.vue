<script setup lang="ts">
import {ref, getCurrentInstance, onMounted, reactive, toRaw} from 'vue'
import {eachRight, random} from "lodash"
import {createVNode, render} from "vue";
import MessageComponent from "../views/uiComponent/message/message.vue";
import Second from "./Second.vue";

defineProps<{ msg: string }>()

let isDanger = ref(true);

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

let proxy = null

onMounted(() => {
  proxy = getCurrentInstance()
})

function showProxy(e){
// 通过getCurrentInstance().appContext访问全局属性
  console.log(proxy.appContext.config.globalProperties)
  proxy.appContext.config.globalProperties.$message({
    message: '刷到了独特装备哦，不看看嘛？',
    onCancle: () => {
      console.log('onCancle')
    },
    onClose: () => {
      console.log('onClose')
    }
  })
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

let userOnClose = function () {
  console.log('onClose')
}
let userOnCancle = function () {
  console.log('onCancle')
}
const MessageConstructor = createVNode(Second, {
  onClose:userOnClose,
  onCancle:userOnCancle
});
//创建一个空的div
let mountNode = document.createElement("div");
//render函数的作用就是将Notice组件的虚拟DOM转换成真实DOM并插入到mountNode元素里
//render(MessageConstructor, mountNode);
//然后把转换成真实DOM的Notice组件插入到body里
//document.body.appendChild(mountNode);

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
