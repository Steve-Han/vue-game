<template>
  <div class="armor">
    <!-- <div class="btn" style="position:relative;z-index:999;">
      <button @click="createNewarmor">随机生成</button>
    </div> -->
    <div class="armorPanel" :style="{'box-shadow':' 0 0 5px 5px '+armor.quality.color + 'b8'}"
         v-if="JSON.stringify(armor)!='{}'">
      <div class="title">
        <div class='icon' :class="{'red-flash':armor.enchantlvl>=13,unique:armor.quality.name=='独特'}"
             :style="{'box-shadow':'inset 0 0 7px 2px '+armor.quality.color}">
          <img :src="armor.type.iconSrc" alt="">
        </div>
        <div class='name' :style="{color:armor.quality.color}">{{ armor.type.name }}
          {{ armor.enchantlvl ? '(+' + armor.enchantlvl + ')' : '' }}
        </div>
      </div>
      <div class='type'>
        <div :style="{color:armor.quality.color}">{{ armor.quality.name }}</div>
        <div>防具</div>
      </div>
      <div class='lv'>
        <div>lv{{ armor.lv }}</div>
      </div>
      <div class="entry">
        <div v-for="v in armor.type.entry" :key="v.id">
          <!-- <div>{{v.name}} : {{v.showVal}}</div> -->
          <div>{{ v.name }} : {{ v.showVal }} <span style="color:#68d5ed"
                                                    v-if="armor.enchantlvl">(+{{
              Math.round(v.value * (1.05 ** (armor.enchantlvl) ** 1.1) - v.value)
            }})</span>
          </div>
        </div>
      </div>
      <div class="extraEntry">
        <div v-for="v in armor.extraEntry" :key="v.id">
          <div>{{ v.name }} : {{ v.showVal }}</div>
        </div>
      </div>
      <div class="des">
        <div>
          {{ armor.type.des }}
        </div>
      </div>
    </div>

  </div>
</template>
<script setup name="armorPanel">
import equiAttributeArmor_ from '../../assets/config/equiAttributeArmor'
import handle from "../../assets/js/handle.js";
import {reactive, watch, watchEffect, defineProps} from "vue";

let armor = reactive({})
let qualityProbability = reactive([0.25, 0.55, 0.15, 0.05,])
let equiAttributeArmor = equiAttributeArmor_();

//接收父组件 传过来的值！
const props = defineProps({
  item: {
    type: Object
  }
});

defineExpose({
  createNewItem
})

watch( () => props.item, () => {
  handle.setReactive(armor, handle.deepCopy(props.item))
})

function createNewItem(qualityIndex, lv) {
  var armor = {}
  armor.itemType = 'armor'
  armor.quality = qualityIndex > -1 ? equiAttributeArmor.qualityArmor[qualityIndex] : createQua()
  armor.lv = lv || createLv()
  armor.type = createType(armor)
  armor.extraEntry = createExtraEntry(armor)
  return JSON.stringify(armor)
}

function createLv(Max) {
  return parseInt(Math.random() * (Max || 39)) + 1
}

function createType(armor) {
  if (armor.quality.name == '独特') {
    var index = Math.floor((Math.random() * equiAttributeArmor.uniqueCategoryArmor.length));
    var type = equiAttributeArmor.uniqueCategoryArmor[index], lv = armor.lv
  } else {
    var index = Math.floor((Math.random() * equiAttributeArmor.categoryArmor.length));
    var type = equiAttributeArmor.categoryArmor[index], lv = armor.lv
  }
  type.entry.map(item => {
    switch (item.type) {
      case 'ATK':
        var random = parseInt(lv * item.valCoefficient + (Math.random() * lv / 2 + 1))
        random = parseInt(random * armor.quality.qualityCoefficient)
        random = random || 1
        item.value = random
        item.showVal = '+' + random
        break;
      case 'DEF':
        var random = parseInt((lv * item.valCoefficient + (Math.random() * lv / 2 + 1)))
        random = parseInt(random * armor.quality.qualityCoefficient)
        random = random || 1
        item.value = random
        item.showVal = '+' + random
        break;
      case 'HP':
        var random = parseInt((lv * item.valCoefficient * 10 + (Math.random() * lv / 2 + 1)))
        random = parseInt(random * armor.quality.qualityCoefficient)
        random = random || 1
        item.value = random
        item.showVal = '+' + random
        break;
      case 'CRIT':
        var random = parseInt(Math.random() * 5 + 5)
        random = parseInt(random * armor.quality.qualityCoefficient)
        item.value = random
        item.showVal = '+' + random + '%'
        break;
      case 'CRITDMG':
        var random = parseInt(Math.random() * 20 + 20)
        random = parseInt(random * armor.quality.qualityCoefficient)
        item.value = random
        item.showVal = '+' + random + '%'
        break;
      case 'BLOC':
        var random = parseInt((lv * 1.3 + (Math.random() * lv / 2 + 1)))
        random = parseInt(random * armor.quality.qualityCoefficient)
        random = random || 1
        item.value = random
        item.showVal = '+' + random
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
      qualityRes = equiAttributeArmor.quality[0]
      break;
    case b[1]:
      qualityRes = equiAttributeArmor.quality[1]
      break;
    case b[2]:
      qualityRes = equiAttributeArmor.quality[2]
      break;
    case b[3]:
      qualityRes = equiAttributeArmor.quality[3]
      break;
    default:
      break;
  }
  return qualityRes
}

function createExtraEntry(armor) {
  var n = armor.quality.extraEntryNum, extraEntry = [], lv = armor.lv
  for (let i = 0; i < n; i++) {
    var index = Math.floor((Math.random() * equiAttributeArmor.extraEntryArmor.length));
    extraEntry.push(equiAttributeArmor.extraEntryArmor[index])
  }
  var b = handle.deepCopy(extraEntry)
  b.map(item => {
    switch (item.type) {
      case 'ATK':
        var random = parseInt(lv * 0.3 + (Math.random() * lv / 2 + 1))
        random = parseInt(random * armor.quality.qualityCoefficient)
        random = random || 1
        item.value = random
        item.showVal = '+' + random
        break;
      case 'DEF':
        var random = parseInt((lv * 0.2 + (Math.random() * lv / 2 + 1)))
        random = parseInt(random * armor.quality.qualityCoefficient)
        random = random || 1
        item.value = random
        item.showVal = '+' + random
        break;
      case 'HP':
        var random = parseInt((lv * 0.2 * 10 + (Math.random() * lv / 2 + 1)))
        random = parseInt(random * armor.quality.qualityCoefficient)
        random = random || 1
        item.value = random
        item.showVal = '+' + random
        break;
      case 'CRIT':
        var random = parseInt(Math.random() * 5 + 5)
        random = parseInt(random * armor.quality.qualityCoefficient)
        item.value = random
        item.showVal = '+' + random + '%'
        break;
      case 'CRITDMG':
        var random = parseInt(Math.random() * 12 + 20)
        random = parseInt(random * armor.quality.qualityCoefficient)
        item.value = random
        item.showVal = '+' + random + '%'
        break;
      case 'DEFPERCENT':
        var random = parseFloat(lv * 0.12 + (Math.random() * lv / 10 + 4)).toFixed(2)
        random = parseFloat(random * armor.quality.qualityCoefficient).toFixed(2)
        random = random || 1
        item.value = random
        item.showVal = '+' + random + '%'
        break;
      case 'HPPERCENT':
        var random = parseFloat(lv * 0.11 + (Math.random() * lv / 10 + 4)).toFixed(2)
        random = parseFloat(random * armor.quality.qualityCoefficient).toFixed(2)
        random = random || 1
        item.value = random
        item.showVal = '+' + random + '%'
        break;
      default:
        break;
    }
  })
  extraEntry = b
  return extraEntry
}

</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}

.armorPanel {
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
