<template>
  <div class="ring">
    <!-- <div class="btn" style="position:relative;z-index:999;">
      <button @click="createNewring">随机生成</button>
    </div> -->
    <div class="ringPanel" :style="{'box-shadow':' 0 0 5px 5px '+ring.quality.color + 'b8'}"
         v-if="JSON.stringify(ring)!='{}'">
      <div class="title">
        <div class='icon' :class="{'red-flash':ring.enchantlvl>=13,unique:ring.quality.name=='独特'}"
             :style="{'box-shadow':'inset 0 0 7px 2px '+ring.quality.color}">
          <img :src="ring.type.iconSrc" alt="">
        </div>
        <div class='name' :style="{color:ring.quality.color}">{{ ring.type.name }}
          {{ ring.enchantlvl ? '(+' + ring.enchantlvl + ')' : '' }}
        </div>
      </div>
      <div class='type'>
        <div :style="{color:ring.quality.color}">{{ ring.quality.name }}</div>
        <div>戒指</div>
      </div>
      <div class='lv'>
        <div>lv{{ ring.lv }}</div>
      </div>
      <div class="entry">
        <div v-for="v in ring.type.entry" :key="v.id">
          <!-- <div>{{v.name}} : {{v.showVal}}</div> -->
          <div>{{ v.name }} : {{ v.showVal }} <span style="color:#68d5ed"
                                                    v-if="ring.enchantlvl">(+{{
              Math.round(v.value * (1.05 ** (ring.enchantlvl) ** 1.1) - v.value)
            }})</span>
          </div>
        </div>
      </div>
      <div class="extraEntry">
        <div v-for="v in ring.extraEntry" :key="v.id">
          <div>{{ v.name }} : {{ v.showVal }}</div>
        </div>
      </div>
      <div class="des">
        <div>
          {{ ring.type.des }}
        </div>
      </div>
    </div>

  </div>
</template>
<script setup>
import equiAttributeRing from '../../assets/config/equiAttributeRing'
import handle from "../../assets/js/handle.js";
import {useStore} from '../../store'
import {ref, reactive, defineProps, watch} from "vue";

const store = useStore()

let ring = reactive({})
let qualityProbability = reactive([0.25, 0.55, 0.15, 0.05,])

//接收父组件 传过来的值！
const props = defineProps({
  item: {
    type: Object
  }
});

defineExpose({
  createNewItem
})

watch(() => props.item, () => {
  handle.setReactive(ring, handle.deepCopy(props.item))
})

function createNewItem(qualityIndex, lv) {
  var ring = {}
  ring.itemType = 'ring'
  ring.quality = qualityIndex > -1 ? equiAttributeRing.quality[qualityIndex] : createQua()
  ring.lv = lv || createLv()
  ring.type = createType(ring)
  ring.extraEntry = createExtraEntry(ring)
  return JSON.stringify(ring)
}

function createLv(Max) {
  return parseInt(Math.random() * (Max || 39)) + 1
}

function createType(ring) {
  if (ring.quality.name == '独特') {
    var index = Math.floor((Math.random() * equiAttributeRing.uniqueCategory.length));
    var type = equiAttributeRing.uniqueCategory[index], lv = ring.lv
  } else {
    var index = Math.floor((Math.random() * equiAttributeRing.category.length));
    var type = equiAttributeRing.category[index], lv = ring.lv
  }
  type.entry.map(item => {
    switch (item.type) {
      case 'ATK':
        var random = parseInt(lv * item.valCoefficient + (Math.random() * lv / 2 + 1))
        random = parseInt(random * ring.quality.qualityCoefficient)
        random = random || 1
        item.value = random
        item.showVal = '+' + random
        break;
      case 'DEF':
        var random = parseInt((lv * item.valCoefficient + (Math.random() * lv / 2 + 1)))
        random = parseInt(random * ring.quality.qualityCoefficient)
        random = random || 1
        item.value = random
        item.showVal = '+' + random
        break;
      case 'HP':
        var random = parseInt((lv * item.valCoefficient * 10 + (Math.random() * lv / 2 + 1)))
        random = parseInt(random * ring.quality.qualityCoefficient)
        random = random || 1
        item.value = random
        item.showVal = '+' + random
        break;
      case 'CRIT':
        var random = parseInt(Math.random() * 5 + 10)
        random = parseInt(random * ring.quality.qualityCoefficient * item.valCoefficient)
        item.value = random
        item.showVal = '+' + random + '%'
        break;
      case 'CRITDMG':
        var random = parseInt(Math.random() * 20 + 30)
        random = parseInt(random * ring.quality.qualityCoefficient * item.valCoefficient)
        item.value = random
        item.showVal = '+' + random + '%'
        break;
      default:
        break;
    }
  })
  return type
}

function createQua() {
  var index = Math.floor((Math.random() * qualityProbability.length));
  var a = qualityProbability[index], b = qualityProbability, qualityRes
  switch (a) {
    case b[0]:
      qualityRes = equiAttributeRing.quality[0]
      break;
    case b[1]:
      qualityRes = equiAttributeRing.quality[1]
      break;
    case b[2]:
      qualityRes = equiAttributeRing.quality[2]
      break;
    case b[3]:
      qualityRes = equiAttributeRing.quality[3]
      break;
    default:
      break;
  }
  return qualityRes
}

function createExtraEntry(ring) {
  var n = ring.quality.extraEntryNum, extraEntryRes = [], lv = ring.lv
  for (let i = 0; i < n; i++) {
    var index = Math.floor((Math.random() * equiAttributeRing.extraEntry.length));
    extraEntryRes.push(equiAttributeRing.extraEntry[index])
  }
  var b = handle.deepCopy(extraEntryRes)
  b.map(item => {
    switch (item.type) {
      case 'ATK':
        var random = parseInt(lv * 0.3 + (Math.random() * lv / 2))
        random = parseInt(random * ring.quality.qualityCoefficient) + 1
        random = random || 1
        item.value = random
        item.showVal = '+' + random
        break;
      case 'DEF':
        var random = parseInt((lv * 0.2 + (Math.random() * lv / 2)))
        random = parseInt(random * ring.quality.qualityCoefficient) + 1
        random = random || 1
        item.value = random
        item.showVal = '+' + random
        break;
      case 'HP':
        var random = parseInt((lv * 0.2 * 10 + (Math.random() * lv / 2)))
        random = parseInt(random * ring.quality.qualityCoefficient) + 1
        random = random || 1
        item.value = random
        item.showVal = '+' + random
        break;
      case 'CRIT':
        var random = parseInt(Math.random() * 5 + 5)
        random = parseInt(random * ring.quality.qualityCoefficient)
        item.value = random
        item.showVal = '+' + random + '%'
        break;
      case 'CRITDMG':
        var random = parseInt(Math.random() * 12 + 20)
        random = parseInt(random * ring.quality.qualityCoefficient)
        item.value = random
        item.showVal = '+' + random + '%'
        break;
      default:
        break;
    }
  })
  extraEntryRes = b
  return extraEntryRes
}

</script>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
}

.ringPanel {
  color: #f1f1f1;
  width: 3rem;
  height: auto;
  background: rgba(0, 0, 0, 0.8);
  border: #393839;
  border-radius: 0.05rem;
  padding: 0.16rem;
  box-sizing: border-box;

  .title {
    display: flex;
    padding-bottom: 0.1rem;
    border-bottom: 1px solid #777;

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
    padding-left: 0.2rem;
    padding-bottom: 0.1rem;
    border-bottom: 1px solid #777;

    div {
      text-align: left;
    }
  }

  .extraEntry {
    width: 100%;
    padding-left: 0.2rem;
    margin-top: 0.1rem;
    padding-bottom: 0.1rem;
    color: #68d5ed;
    border-bottom: 1px solid #777;

    div {
      text-align: left;
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

.btn {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0.2rem;

  button {
    padding: 0.06rem 0.12rem;
  }
}
</style>
