<template>
  <div class="weapon">
    <!-- <div class="btn" style="position:relative;z-index:999;">
      <button @click="createNewWeapon">随机生成</button>
    </div> -->
    <div class="weaponPanel" :style="{'box-shadow':' 0 0 5px 5px '+weapon.quality.color + 'b8'}"
         v-if="JSON.stringify(weapon) != '{}'">
      <div class="title">
        <div class='icon' :class="{'red-flash':weapon.enchantlvl>=13,unique:weapon.quality.name=='独特'}"
             :style="{'box-shadow':'inset 0 0 7px 2px '+weapon.quality.color}">
          <img :src="weapon.type.iconSrc" alt="">
        </div>
        <div class='name' :style="{color:weapon.quality.color}">{{ weapon.type.name }}
          {{ weapon.enchantlvl ? '(+' + weapon.enchantlvl + ')' : '' }}
        </div>
      </div>
      <div class='type'>
        <div :style="{color:weapon.quality.color}">{{ weapon.quality.name }}</div>
        <div>武器</div>
      </div>
      <div class='lv'>
        <div>lv{{ weapon.lv }}</div>
      </div>
      <div class="entry">
        <div v-for="v in weapon.type.entry" :key="v.id">
          <!-- <div>{{v.name}} : {{v.showVal}}</div> -->
          <div>{{ v.name }} : {{ v.showVal }} <span style="color:#68d5ed"
                                                    v-if="weapon.enchantlvl">(+{{
              Math.round(v.value * (1.05 ** (weapon.enchantlvl) ** 1.1) - v.value)
            }})</span>
          </div>
        </div>
      </div>
      <div class="extraEntry">
        <div v-for="v in weapon.extraEntry" :key="v.id">
          <div>{{ v.name }} : {{ v.showVal }}</div>
        </div>
      </div>
      <div class="des">
        <div>
          {{ weapon.type.des }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import equiAttributeWeapon from '../../assets/config/equiAttributeWeapon'
import handle from "../../assets/js/handle.js";
import {useStore} from '../../store'
import {ref, reactive, defineProps, watch, onMounted, computed} from "vue";

const store = useStore()

let weapon = reactive({})
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
  handle.setReactive(weapon, handle.deepCopy(props.item))
})

function createNewItem(qualityIndex, lv) {
  var weapon = {}
  weapon.itemType = 'weapon'
  weapon.quality = qualityIndex > -1 ? equiAttributeWeapon.quality[qualityIndex] : createQua()
  weapon.lv = lv || createLv()
  weapon.type = createType(weapon)
  weapon.extraEntry = createExtraEntry(weapon)
  return JSON.stringify(weapon)
}

function createLv(Max) {
  return parseInt(Math.random() * (Max || 39)) + 1
}

function createType(weapon) {
  if (weapon.quality.name == '独特') {
    var index = Math.floor((Math.random() * equiAttributeWeapon.uniqueCategory.length));
    var type = equiAttributeWeapon.uniqueCategory[index], lv = weapon.lv
  } else {
    var index = Math.floor((Math.random() * equiAttributeWeapon.category.length));
    var type = equiAttributeWeapon.category[index], lv = weapon.lv
  }

  type.entry.map(item => {
    switch (item.type) {
      case 'ATK':
        var random = parseInt(lv * item.valCoefficient + (Math.random() * lv / 2 + 1))
        random = parseInt(random * weapon.quality.qualityCoefficient)
        random = random || 1
        item.value = random
        item.showVal = '+' + random
        break;
      case 'DEF':
        var random = parseInt((lv * item.valCoefficient + (Math.random() * lv / 2 + 1)))
        random = parseInt(random * weapon.quality.qualityCoefficient)
        random = random || 1
        item.value = random
        item.showVal = '+' + random
        break;
      case 'HP':
        var random = parseInt((lv * item.valCoefficient * 10 + (Math.random() * lv / 2 + 1)))
        random = parseInt(random * weapon.quality.qualityCoefficient)
        random = random || 1
        item.value = random
        item.showVal = '+' + random
        break;
      case 'CRIT':
        var random = parseInt(Math.random() * 5 + 7)
        random = parseInt(random * weapon.quality.qualityCoefficient)
        item.value = random
        item.showVal = '+' + random + '%'
        break;
      case 'CRITDMG':
        var random = parseInt(Math.random() * 20 + 20)
        random = parseInt(random * weapon.quality.qualityCoefficient)
        item.value = random
        item.showVal = '+' + random + '%'
        break;
      case 'BLOC':
        var random = parseInt((lv * 0.2 * 2 + (Math.random() * lv / 2 + 1)))
        random = parseInt(random * weapon.quality.qualityCoefficient)
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
      qualityRes = equiAttributeWeapon.quality[0]
      break;
    case b[1]:
      qualityRes = equiAttributeWeapon.quality[1]
      break;
    case b[2]:
      qualityRes = equiAttributeWeapon.quality[2]
      break;
    case b[3]:
      qualityRes = equiAttributeWeapon.quality[3]
      break;
    default:
      break;
  }
  return qualityRes
}

function createExtraEntry(weapon) {
  var n = weapon.quality.extraEntryNum, extraEntry = [], lv = weapon.lv
  for (let i = 0; i < n; i++) {
    var index = Math.floor((Math.random() * extraEntry.length));
    extraEntry.push(extraEntry[index])
  }
  var b = handle.deepCopy(extraEntry)
  b.map(item => {
    switch (item.type) {
      case 'ATK':
        var random = parseInt(lv * 0.5 + (Math.random() * lv / 2 + 1))
        random = parseInt(random * weapon.quality.qualityCoefficient)
        random = random || 1
        item.value = random
        item.showVal = '+' + random
        break;
      case 'DEF':
        var random = parseInt((lv * 0.2 + (Math.random() * lv / 2 + 1)))
        random = parseInt(random * weapon.quality.qualityCoefficient)
        random = random || 1
        item.value = random
        item.showVal = '+' + random
        break;
      case 'HP':
        var random = parseInt((lv * 0.2 * 10 + (Math.random() * lv / 2 + 1)))
        random = parseInt(random * weapon.quality.qualityCoefficient)
        random = random || 1
        item.value = random
        item.showVal = '+' + random
        break;
      case 'ATKPERCENT':
        var random = parseFloat(lv * 0.11 + (Math.random() * lv / 10 + 4)).toFixed(2)
        random = parseFloat(random * weapon.quality.qualityCoefficient).toFixed(2)
        random = random || 1
        item.value = random
        item.showVal = '+' + random + '%'
        break;
      case 'DEFPERCENT':
        var random = parseFloat(lv * 0.1 + (Math.random() * lv / 10 + 4)).toFixed(2)
        random = parseFloat(random * weapon.quality.qualityCoefficient).toFixed(2)
        random = random || 1
        item.value = random
        item.showVal = '+' + random + '%'
        break;
      case 'HPPERCENT':
        var random = parseFloat(lv * 0.13 + (Math.random() * lv / 10 + 4)).toFixed(2)
        random = parseFloat(random * weapon.quality.qualityCoefficient).toFixed(2)
        random = random || 1
        item.value = random
        item.showVal = '+' + random + '%'
        break;
      case 'CRIT':
        var random = parseInt(Math.random() * 5 + 5)
        random = parseInt(random * weapon.quality.qualityCoefficient)
        item.value = random
        item.showVal = '+' + random + '%'
        break;
      case 'CRITDMG':
        var random = parseInt(Math.random() * 12 + 20)
        random = parseInt(random * weapon.quality.qualityCoefficient)
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

.weaponPanel {
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
