<template>
  <div class="c-tooltip">
    <div class="c-tooltip-content" @mouseover="showTips($event)" @mouseleave="closeTips">
      <slot name="content"></slot>
    </div>
    <div class="c-tooltip-tip" :class="placement" v-if="tipsShow" :style='tipsStyle'>
      <slot name="tip"></slot>
    </div>
  </div>
</template>
<script setup>
import {ref, reactive, defineProps} from "vue";

//接收父组件 传过来的值！
const props = defineProps({
  placement: {
    type: String
  }
});


let tipsShow = ref(false)
let tipsStyle = reactive({})


function showTips(e) {
  tipsShow.value = true
}

function closeTips() {
  tipsShow.value = false
}


</script>
<style lang="scss" scoped>
.c-tooltip, .c-tooltip-content {
  position: relative;
  width: 100%;
  cursor: pointer;
}

.c-tooltip-tip {
  bottom: -.05rem;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 100%);
  min-width: 2rem;
  border: 1px solid #fff;
  border-radius: 4px;
  padding: 0.15rem;
  background: #111111;
  padding-top: 0.45rem;
  font-size: 0.12rem;
  font-weight: normal;
  z-index: 9999;
  box-shadow: 0 0 3px 3px rgba($color: #000000, $alpha: 1.0);

  .info {
    font-size: 0.12rem;
    font-weight: normal;
    margin-top: 0.05rem;
  }

  &::after {
    position: absolute;
    top: 0.05rem;
    left: 50%;
    transform: translateX(-50%);
    content: "";
    display: flex;
    width: 0.4rem;
    height: 0.4rem;
    background-image: url(../../assets/icons/tips.png);
    background-size: cover;
  }
}

.top {
  top: -0.25rem;
  transform: translate(-50%, -100%);
  bottom: initial;
}
</style>
