<template>
  <div class="equiment">
    <div class="equimentPanel" v-if="JSON.stringify(equiment)!='{}'">
      <cTooltip placement="bottom">
        <template v-slot:content>
          <div class="panel-title">- 强化 i -</div>
        </template>
        <template v-slot:tip>
          <p class="info">* 花费金币强化装备</p>
          <p class="info">* 强化装备会加强装备的基础属性</p>
          <p class="info">* 强化等级越高成功率越低</p>
          <p class="info">* 强化等级高于5时强化失败可能会降低强化等级</p>
          <p class="info">* 强化概率：6级80%，7级65%，8级45%，9级30%，10级以后20%</p>
        </template>
      </cTooltip>

      <div class="title">

        <div class='icon' :class="{'red-flash':equiment.enchantlvl>=13}"
             :style="{'box-shadow':'inset 0 0 7px 2px '+equiment.quality.color}">
          <img :src="equiment.type.iconSrc" alt="">
        </div>
        <div class='name' :style="{color:equiment.quality.color}">{{ equiment.type.name }}
          {{ equiment.enchantlvl ? '(+' + equiment.enchantlvl + ')' : '' }}
        </div>
      </div>
      <div class="entry">
        <div class="old">
          <div v-for="v in equiment.type.entry" :key="v.id">
            <div>{{ v.name }} : + {{ Math.round(v.value * (1.05 ** (equiment.enchantlvl) ** 1.1)) }}</div>
          </div>
        </div>
        <div class="arror">➡</div>
        <div class="new">
          <div v-for="v in equiment.type.entry" :key="v.id">
            <div>{{ Math.round(v.value * (1.05 ** (equiment.enchantlvl + 1) ** 1.1)) }} <span
                class="set"> ⬆({{
                Math.round(v.value * (1.05 ** (equiment.enchantlvl + 1) ** 1.1) - Math.round(v.value * (1.05 ** (equiment.enchantlvl) ** 1.1)))
              }})</span>
            </div>
          </div>
        </div>
      </div>
      <div class="btn-group" v-if='!autoStrengModel'>
        <p>需要金币：<span :class="{'red':userGold<strengthenNeedGold}">{{ strengthenNeedGold }}</span></p>
        <div class="button" @click="startStreng()">强化至+{{ parseInt(equiment.enchantlvl) + 1 }}</div>
      </div>
      <div class="btn-group" v-if='!autoStrengModel'>
        <p>自动强化目标等级：</p>
        <p><input type="number" placeholder="目标等级" max="15" min="5" v-model="autoStrengLv"></p>
        <div class="button" @click="startAutoStreng">自动强化</div>
      </div>
      <div class="btn-group" v-if='autoStrengModel'>
        <p>自动强化中...</p>
        <div class="button" @click="stopAutoStreng">中断自动强化</div>
      </div>
      <cTooltip placement="bottom">
        <template v-slot:content>
          <div class="panel-title">- 词条重铸 i -</div>
        </template>
        <template v-slot:tip>
          <p class="info">* 花费金币重铸装备词条</p>
          <p class="info">* 重铸时词条颜色与百分比值显示了该词条的等级</p>
        </template>
      </cTooltip>

      <div class="extraEntry">
        <div class="extraEntry-item" v-for="(v,k) in equiment.extraEntry" :key="v.id" @click="recastTheEquiment(v,k)"
             @mouseover="changeRecastStatus(v,k,true)" @mouseleave="changeRecastStatus(v,k,false)">
          <button class="btn btn-snake-border" :class="qualityClass">
            <div class="btn-borders">
              <div class="border-top"></div>
              <div class="border-right"></div>
              <div class="border-bottom"></div>
              <div class="border-left"></div>
            </div>
            <div v-if="v.recastStatus" class="recast-info"><span
                :class="{red:userGold<recastNeedGold}"></span>点击花费{{ recastNeedGold }}金币重铸
            </div>
            <div v-else>{{ v.name }} : {{ v.showVal }} <span style="font-size:.12rem;margin-left:.06rem"
                                                             v-if="v.EntryLevel"> ({{ v.EntryLevel }})</span></div>
          </button>

        </div>
      </div>
    </div>

  </div>
</template>
<script setup>
import cTooltip from '../uiComponent/tooltip.vue'
import handle from '../../assets/js/handle';
import {useStore} from '../../store'
import {ref, reactive, watch, onMounted, computed, defineExpose, inject} from "vue";

const store = useStore()

let equiment = reactive({})
let strengTime = ref(null) //刷新副本计时器
let strengTimeO = ref(60) //刷新副本时间间隔 单位：S
let autoStrengModel = ref(false)
let autoStrengLv = ref(12)
let autoStrengTime = ref(null)
let recast = ref(false)
let qualityClass = ref('')
let qualityProbability = reactive([0.25, 0.55, 0.15, 0.05,])
let quality = reactive([{
  name: '破旧',
  qualityCoefficient: 0.7,
  probability: '0.25',
  color: '#a1a1a1',
  extraEntryNum: 1,
}, {
  name: '普通',
  qualityCoefficient: 1,
  probability: '0.55',
  color: '#fff', extraEntryNum: 2,
}, {
  name: '神器',
  qualityCoefficient: 1.5,
  probability: '0.15',
  color: '#ff00ff', extraEntryNum: 3,
}, {
  name: '史诗',
  qualityCoefficient: 2,
  probability: '0.05',
  color: '#f78918', extraEntryNum: 4,
}])

defineExpose({
  stopAutoStreng
})

onMounted(() => {
  strengTime.value = setInterval(() => {
    strengTimeO.value--
    if (strengTimeO.value <= 0) {
      clearInterval(strengTime.value)
      strengTime.value = 0
      strengTimeO.value = 60
    }
  }, 1000)
})

let userGold = computed(() => {
  return store.playerAttribute.GOLD
})
let item = computed(() => {
  return store.needStrengthenEquipment
})
let strengthenNeedGold = computed(() => {
  var a = parseInt((parseInt(equiment.lv) + 1) * (1.1 ** (equiment.enchantlvl) ** 1.1) * (10 + parseInt(equiment.lv) / 5)) + 100
  return a
})
let recastNeedGold = computed(() => {
  var a = parseInt(parseInt(equiment.lv) * equiment.quality.qualityCoefficient * (200 + 10 * parseInt(equiment.lv)) / 4)
  return a
})

watch(item, (value, oldValue, onCleanup) => {
  handle.setReactive(equiment, handle.deepCopy(item.value))
  if (!equiment.enchantlvl) {
    equiment['enchantlvl'] = 0
  }
})

function changeRecastStatus(v, k, status) {
  // 设置是否处于重置状态中
  qualityClass.value = ''
  v.recastStatus = status
  equiment.extraEntry[k] = v
}

// 强化装备
function startStreng(auto) {
  if (strengTime.value && equiment.enchantlvl >= 12) {
    store.set_sys_info({
      msg: `
          刷新页面时需要等待60S才能强化+12以上，仍需等待${strengTimeO.value}秒。
        `,
      type: 'wrning'
    });
    autoStrengModel.value = false
    clearInterval(autoStrengTime.value)
    return
  }
  // 自动强化需要金币倍率
  var ra = auto ? 2 : 1
  var needGold = strengthenNeedGold.value * 1  //ra
  if (store.playerAttribute.GOLD < needGold) {
    stopAutoStreng()
    store.set_sys_info({
      msg: `
              钱不够啊，强化啥呢。
            `,
      type: "warning",
    });
    return
  }
  let lv = equiment.enchantlvl
  let probabilityOfSuccess = 1
  if (lv <= 5) {
    probabilityOfSuccess = 1
  } else if (lv == 6) {
    probabilityOfSuccess = 0.8
  } else if (lv == 7) {
    probabilityOfSuccess = 0.65
  } else if (lv == 8) {
    probabilityOfSuccess = 0.45
  } else if (lv == 9) {
    probabilityOfSuccess = 0.3
  } else {
    probabilityOfSuccess = 0.2
  }
  let r = Math.random()
  if (r < probabilityOfSuccess) {
    // 强化成功
    lv++
  } else {
    // 强化失败
    if (lv >= 5) {
      lv = lv - 1
    }
  }

  store.set_player_gold(-parseInt(needGold));

  changeTheEquimentByLv(lv)
  changeTheEquiment()
}

function startAutoStreng() {
  autoStrengModel.value = true
  autoStrengTime.value = setInterval(() => {
    startStreng(true)
    if (equiment.enchantlvl == autoStrengLv.value) {
      stopAutoStreng()
      store.set_sys_info({
        msg: `
              自动强化完成了，去看看你的装备吧。
            `,
        type: "win",
      });
    }
  }, 150)
}

function stopAutoStreng() {
  autoStrengModel.value = false
  clearInterval(autoStrengTime.value)
}

// 重铸装备
function recastTheEquiment(v, k) {
  if (store.playerAttribute.GOLD < recastNeedGold.value) {
    store.set_sys_info({
      msg: `
              钱不够啊，重铸啥呢。
            `,
      type: "warning",
    });
    return
  }
  let newEntry = handle.createRandomEntry(equiment.lv, equiment.quality.qualityCoefficient)
  equiment.extraEntry[k] = newEntry
  store.set_player_gold(-parseInt(recastNeedGold.value));
  var a = parseInt(equiment.extraEntry[k].EntryLevel)
  if (a < 25) {
    qualityClass.value = 'D'
  } else if (a < 50 && a >= 25) {
    qualityClass.value = 'C'
  } else if (a < 70 && a >= 50) {
    qualityClass.value = 'B'
  } else if (a < 90 && a >= 70) {
    qualityClass.value = 'A'
  } else {
    qualityClass.value = 'S'
  }
  changeTheEquiment()
}

//根据强化等级变动装备
function changeTheEquimentByLv(lv) {
  equiment.enchantlvl = lv
}

let backpackPanelRef = inject('backpackPanelRef');
let saveGame_p = inject('saveGame');

//修改成功时保存这个装备
function changeTheEquiment() {
  saveGame_p(false)
  equiment.locked = true;
  backpackPanelRef.value.grid[backpackPanelRef.value.currentItemIndex.value] = handle.deepCopy(equiment)
}

</script>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
}

.equimentPanel {
  color: #f1f1f1;
  width: 4rem;
  height: auto;
  background: rgba(0, 0, 0, 0.8);
  border: #393839;
  border-radius: 0.05rem;
  padding: 0 0.16rem;
  box-sizing: border-box;

  .title {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 0.1rem;

    .icon {
      width: 0.5rem;
      height: 0.5rem;
      background: #000;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.04rem;
    }

    .name {
      height: 0.46rem;
      margin-left: 0.2rem;
      line-height: 0.46rem;
    }
  }

  .type {
    padding: 0.1rem;
    display: flex;
    width: 100%;
    align-content: center;
    justify-content: space-between;
  }

  .lv {
    padding-right: 0.1rem;
    display: flex;
    width: 100%;
    align-content: center;
    justify-content: flex-end;
  }

  .entry {
    width: 100%;
    padding: 0.2rem 0.3rem;
    display: flex;
    justify-content: space-around;
    font-size: 0.18rem;
    align-items: center;

    div {
      text-align: left;

      & > div {
        height: 0.26rem;
      }

      .set {
        color: #2fe20f;
        margin-left: 0.1rem;
      }
    }
  }

  .extraEntry {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    padding-left: 0.2rem;
    padding-bottom: 0.1rem;
    color: #68d5ed;

    div {
      display: flex;
      justify-content: center;

      & > div {
        display: flex;
        justify-content: center;
      }
    }
  }
}

.des {
  color: #777;
  font-size: 0.12rem;
  margin-top: 0.1rem;
  text-align: left;
  text-indent: 0.24rem;
}

.btn-group {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.08rem;
  background: #000;
}

$blue: #ccc;
.extraEntry-item {
  border-radius: 4px;
  margin: 0.03rem;

  &:hover {
    // box-shadow: 0 0 2px 2px #6094b1;
  }
}

.btn {
  width: 100%;
  position: relative;
  padding: 0.1rem 0.3rem;
  font-family: Lato, sans-serif;
  font-size: 0.15rem;
  line-height: 0.15rem;

  color: #d8e8e8;
  text-decoration: none;
  background-color: #101010;
  border: transparent;
  outline: transparent;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  overflow: hidden;
  border-radius: 4px;
  transition: 0.2s;

  &:hover {
    box-shadow: inset 0 0 7px 7px #53a28ec9;

    .btn-borders {
      display: flex !important;
    }
  }

  &.D:hover {
    box-shadow: inset 0 0 7px 7px #a1a1a1a2;
  }

  &.C:hover {
    box-shadow: inset 0 0 7px 7px #ffffffa2;
  }

  &.B:hover {
    box-shadow: inset 0 0 7px 7px #ff00ffa2;
  }

  &.A:hover {
    box-shadow: inset 0 0 7px 7px #f78918a2;
  }

  &.S:hover {
    box-shadow: inset 0 0 7px 7px #ff0000a2;
  }

  .btn-text {
    color: $blue;
  }

  &-snake-border {
    .btn-borders {
      display: none !important;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;

      .border-top {
        position: absolute;
        top: 0;
        width: 100%;
        height: 2px;
        background: linear-gradient(to right, transparent, $blue);
        animation: moveHorizontally 2s linear infinite;
      }

      .border-right {
        position: absolute;
        right: 0;
        width: 2px;
        height: 100%;
        background: linear-gradient(to bottom, transparent, $blue);
        animation: moveVertically 2s 1s linear infinite;
      }

      .border-bottom {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 2px;
        background: linear-gradient(to left, transparent, $blue);
        animation: moveHorizontally 2s linear reverse infinite;
      }

      .border-left {
        position: absolute;
        left: 0;
        width: 2px;
        height: 100%;
        background: linear-gradient(to top, transparent, $blue);
        animation: moveVertically 2s 1s linear reverse infinite;
      }
    }
  }
}

@keyframes moveHorizontally {
  from {
    transform: translateX(-100%);
  }

  to {
    transform: translateX(100%);
  }
}

@keyframes moveVertically {
  from {
    transform: translateY(-100%);
  }

  to {
    transform: translateY(100%);
  }
}

.cameraPosition {
  height: calc(100%);
  padding: 20px;
  background: #1a1b1d;
  font-family: "Noto Sans", "Source Sans Pro", "Avenir", Helvetica, Arial,
  sans-serif !important;
}

.base-title {
  color: #04e2ff;
  font-size: 20px;
  transform: scale(0.8);
}

.breathLight {
  width: 300px;
  height: 10px;
  background: linear-gradient(
          90deg,
          #04e2ff 0%,
          #0267ff 25%,
          #04e2ff 50%,
          #0267ff 75%,
          #04e2ff 100%
  );
  border-radius: 10px;
  box-shadow: 0 0 2px 1px #cecece4f;
  background-size: 200% 200%;
  animation: lineRGB linear 3s infinite;
}

.el-header-light-line {
  position: absolute;
  bottom: 0;
  width: 100%;
  background: linear-gradient(
          90deg,
          #04e2ff 0%,
          #0267ff 25%,
          #04e2ff 50%,
          #0267ff 75%,
          #04e2ff 100%
  );
  background-size: 200% 200%;
  height: 2px;
  animation: lineRGB linear 3s infinite;
}

.el1 {
  top: 0;
  left: 0;
}

.el2 {
  width: 2px;
  height: 100%;
  top: 0;
  left: 0;
}

.el3 {
  width: 2px;
  height: 100%;
  top: 0;
  right: 0;
}

.el4 {
  left: 0;
  bottom: 0;
}

@keyframes lineRGB {
  0% {
    background-position: 100% 0%;
  }
  50% {
    background-position: 50% 100%;
  }
  100% {
    background-position: 0% 0%;
  }
}

.recast-info {
  font-size: 0.14rem;
  color: #04e2ff;
}

.red {
  color: red;
}
</style>
