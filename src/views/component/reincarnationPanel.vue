<template>
  <div class="reincarnation">
    <!-- <a class="github" target="_blank" @click="navToGithub" title="源码" src="https://github.com/Couy69/vue-idle-game"></a> -->
    <div class="title">
      <p>现在转生可以获得{{ willGetreincarnationPoint }}转生点数</p>
      <div class="info">
        <p>- 转生后会失去金币与装备</p>
        <p>- 转生会获得转生点数</p>
        <p>- 转生点数根据人物等级，身上装备品质强化等级计算，持有金币与背包装备不会纳入计算</p>
      </div>
      <div class='btn-div'>
        <div class="button" @click="reincarnationConfirm">确认转生</div>
      </div>
    </div>
    <div class="content">
      <div class="info">
        <p>当前转生次数：{{ reincarnationData.count }}次</p>
        <p>剩余转生点数：{{ reincarnationData.point }}</p>
      </div>
      <div class="panel">
        <div class="item" v-for="(v,k) in attr" :key="k">
          <p>
            <img :src="v.img"><span>{{ v.showName }}：+{{ v.currentValue.toFixed(2) }}{{ v.unity }}</span>
          </p>
          <div class="group">
            <div class="button" @click="subtract(v,$event)" @mousedown="subtractDown(v,$event)"
                 @mouseup="subtractUp(v,$event)">-
            </div>
            <input type="number" min="0" disabled v-model="v.point">
            <div class="button" v-on:click="add(v,$event)" @mousedown="addDown(v,$event)" @mouseup="addUp(v,$event)">+
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {useStore} from '../../store'
import {ref, reactive, computed, onMounted} from "vue";
import S_HOLY01_PNG from '../../assets/icons/S_Holy01.png'
import ATK_PNG  from '../../assets/icons/ATK.png'
import CRIT_PNG  from '../../assets/icons/CRIT.png'
import CRITDMG_PNG  from '../../assets/icons/CRITDMG.png'
import icon_11_PNG  from '../../assets/icons/icon_11.png'
import S_BLOC_PNG  from '../../assets/icons/S_BLOC.png'
import S_EVA_PNG  from '../../assets/icons/S_EVA.png'

const store = useStore()

let reincarnationPoint = ref(100)
let reinCount = ref(0)
let willGetreincarnationPoint = ref(0)
let subtractTimer1 = ref(0)
let subtractTimer2 = ref(0)
let addTimer1 = ref(0)
let addTimer2 = ref(0)
let attr = reactive([
  {
    name: 'HP',
    showName: '生命值',
    img: S_HOLY01_PNG ,
    oldValue: 0,
    point: 0,
    unity: '',
    currentValue: 0,
    maxPoint: null,
  }, {
    name: 'ATK',
    showName: '攻击力',
    img: ATK_PNG ,
    oldValue: 0,
    point: 0,
    unity: '',
    currentValue: 0,
    maxPoint: null,
  }, {
    name: 'CRIT',
    showName: '暴击率',
    img: CRIT_PNG,
    oldValue: 0,
    point: 0,
    unity: '%',
    currentValue: 0,
    maxPoint: 500,
  }, {
    name: 'CRITDMG',
    showName: '暴击伤害',
    img: CRITDMG_PNG,
    oldValue: 0,
    point: 0,
    unity: '%',
    currentValue: 0,
    maxPoint: null,
  }, {
    name: 'DEF',
    showName: '护甲',
    img: icon_11_PNG,
    oldValue: 0,
    point: 0,
    unity: '',
    currentValue: 0,
    maxPoint: null,
  }, {
    name: 'BLOC',
    showName: '格挡',
    img: S_BLOC_PNG,
    oldValue: 0,
    point: 0, unity: '',
    currentValue: 0,
    maxPoint: null,
  },
  // {
  //   name: 'GOLD',
  //   showName: '金币获取倍率',
  //   img: S_BLOC_PNG,
  //   oldValue: 0,
  //   point: 0, unity: '',
  //   currentValue: 0,
  //   maxPoint: null,
  // },
  {
    name: 'MOVESPEED',
    showName: '副本行进速度',
    img: S_EVA_PNG,
    oldValue: 0,
    point: 0, unity: 'X',
    currentValue: 0,
    maxPoint: 500,
  },
  {
    name: 'BATTLESPEED',
    showName: '副本战斗速度',
    img: S_EVA_PNG,
    oldValue: 0,
    point: 0, unity: 'X',
    currentValue: 0,
    maxPoint: 500,
  },
])

onMounted(() => {
  caculateWillGetreincarnationPoint()

  for (let i in reincarnationAttribute.value) {
    let item = reincarnationAttribute.value[i]
    switch (i) {
      case 'HP':
        var p = attr.filter(({name}) => name == 'HP')[0];
        p.oldValue = p.currentValue = item
        p.hasPoint = item / 10
        break;
      case 'ATK':
        var p = attr.filter(({name}) => name == 'ATK')[0];
        p.oldValue = p.currentValue = item
        p.hasPoint = item / 3
        break;
      case 'CRIT':
        var p = attr.filter(({name}) => name == 'CRIT')[0];
        p.oldValue = p.currentValue = item
        p.hasPoint = item / 0.1
        break;
      case 'CRITDMG':
        var p = attr.filter(({name}) => name == 'CRITDMG')[0];
        p.oldValue = p.currentValue = item
        p.hasPoint = item / 1
        break;
      case 'DEF':
        var p = attr.filter(({name}) => name == 'DEF')[0];
        p.oldValue = p.currentValue = item
        p.hasPoint = item / 2
        break;
      case 'BLOC':
        var p = attr.filter(({name}) => name == 'BLOC')[0];
        p.oldValue = p.currentValue = item
        p.hasPoint = item / 2
        break;
      case 'MOVESPEED':
        var p = attr.filter(({name}) => name == 'MOVESPEED')[0];
        p.oldValue = p.currentValue = Number((-(item / 0.06 * 0.01)).toFixed(2))
        p.hasPoint = -(item / 0.06)
        // item.currentValue = Number((item.point * 0.01).toFixed(2))
        // data.MOVESPEED = -(item.point * 0.06)
        break;
      case 'BATTLESPEED':
        var p = attr.filter(({name}) => name == 'BATTLESPEED')[0];
        p.oldValue = p.currentValue = Number((-(item / 3 * 0.01)).toFixed(2))
        p.hasPoint = -(item / 3)
        // item.currentValue = Number((item.point * 0.01).toFixed(2))
        // data.BATTLESPEED = -(item.point * 3)
        break;
      default:
        break;
    }
  }
  reincarnationPoint.value = reincarnationData.value.point
  reinCount.value = reincarnationData.value.count
})


let reincarnationData = computed(() => {
  return store.reincarnation
})

let reincarnationAttribute = computed(() => {
  return store.reincarnationAttribute
})


function reincarnationConfirm() {
  if (store.playerAttribute.lv <= 30) {
    store.set_sys_info({
      msg: `
              等级这么低就先别转了吧，超过lv:30再来看看
            `,
      type: 'warning'
    });
    return
  }
  this.$message({
    message: `你将获得${willGetreincarnationPoint.value}转生点数，同时你的金币和装备都会消失。`,
    title: '提示',
    closeBtnText: '算了',
    confirmBtnText: '转了转了',
    onClose: () => {
      clearPlayerInfo()
      store.set_player_rein({
        count: reinCount.value + 1,
        point: willGetreincarnationPoint.value + reincarnationPoint.value
      })
      willGetreincarnationPoint.value = 0
      reinCount.value = reincarnationData.value.count
      reincarnationPoint.value = reincarnationData.value.point
    }
  })
}

function clearPlayerInfo() {
  store.reset_player_gold(0)
  store.reset_player_equi({})
  var backpackPanel = this.findBrothersComponents(this, 'backpackPanel', false)[0]
  backpackPanel.clear()
  var p = this.findComponentUpward(this, 'index')
  p.createdDungeons(true)
}

function caculateWillGetreincarnationPoint() {
  let lv = store.playerAttribute.lv, lvPoint
  lvPoint = lv >= 20 ? Math.floor((lv - 20) ** 1.1 / 2.1) : 0

  let weapon = store.playerAttribute.weapon, weaponPonit
  var wlv = weapon.lv, elv = weapon.enchantlvl || 0, q = weapon.quality.qualityCoefficient
  if (wlv >= 20) {
    weaponPonit = Math.floor(((wlv - 20) / 10) ** 1.1 * (0.1 * elv ** 1.5 + 1) * q / 3.5)
  } else {
    weaponPonit = 0
  }

  let armor = store.playerAttribute.armor, armorPonit
  var wlv = armor.lv, elv = armor.enchantlvl || 0, q = armor.quality.qualityCoefficient
  if (wlv >= 20) {
    armorPonit = Math.floor(((wlv - 20) / 10) ** 1.1 * (0.1 * elv ** 1.5 + 1) * q / 3.5)
  } else {
    armorPonit = 0
  }

  let ring = store.playerAttribute.ring, ringPonit
  var wlv = ring.lv, elv = ring.enchantlvl || 0, q = ring.quality.qualityCoefficient
  if (wlv >= 20) {
    ringPonit = Math.floor(((wlv - 20) / 10) ** 1.1 * (0.1 * elv ** 1.5 + 1) * q / 3.5)
  } else {
    ringPonit = 0
  }

  let neck = store.playerAttribute.neck, neckPonit
  var wlv = neck.lv, elv = neck.enchantlvl || 0, q = neck.quality.qualityCoefficient
  if (wlv >= 20) {
    neckPonit = Math.floor(((wlv - 20) / 10) ** 1.1 * (0.1 * elv ** 1.5 + 1) * q / 3.5)
  } else {
    neckPonit = 0
  }
  willGetreincarnationPoint.value = parseInt((lvPoint + weaponPonit + armorPonit + ringPonit + neckPonit) * 1.2)
}

function subtract(v, e) {
  let num = 1
  if (e.shiftKey) {
    num = 10
  }
  if (v.point >= num) {
    v.point = v.point - num
    reincarnationPoint.value = reincarnationPoint.value + num
  }
  store.set_player_rein({
    count: reinCount.value,
    point: reincarnationPoint.value
  })
  this.caculateAttr()
}

function subtractDown(v, e) {
  var flag = false;
  var stop;
  subtractTimer1.value = setTimeout(() => {
    flag = true;
    subtractTimer2.value = setInterval(() => {
      this.subtract(v, e)
    }, 50)
  }, 500);
}

function subtractUp(v) {
  clearTimeout(subtractTimer1.value)
  clearInterval(subtractTimer2.value)
}

function addDown(v, e) {
  var flag = false;
  var stop;
  addTimer1.value = setTimeout(() => {
    flag = true;
    addTimer2.value = setInterval(() => {
      this.add(v, e)
    }, 50)
  }, 500);
}

function addUp(v) {
  clearTimeout(addTimer1.value)
  clearInterval(addTimer2.value)
}

function add(v, e) {
  console.log(v)
  let num = 1
  if (e.shiftKey) {
    num = 10
  }

  if (v.maxPoint && v.point + num + v.hasPoint > v.maxPoint) {
    store.set_sys_info({
      msg: `
              该项最多加点至${v.maxPoint}
            `,
      type: 'warning'
    });
    return
  }
  if (reincarnationPoint.value >= num) {
    v.point = v.point + num
    reincarnationPoint.value = reincarnationPoint.value - num
  }
  store.set_player_rein({
    count: reinCount.value,
    point: reincarnationPoint.value
  })
  this.caculateAttr()
}

function caculateAttr() {
  var data = {
    'HP': 0,
    'ATK': 0,
    'CRIT': 0,
    'CRITDMG': 0,
    'DEF': 0,
    'BLOC': 0,
    'MOVESPEED': 0,
    'BATTLESPEED': 0,
  }
  this.attr.map(item => {
    switch (item.name) {
      case 'HP':
        item.currentValue = item.point * 10 + item.oldValue
        data.HP = item.currentValue
        break;
      case 'ATK':
        item.currentValue = item.point * 3 + item.oldValue
        data.ATK = item.currentValue
        break;
      case 'CRIT':
        item.currentValue = Number((item.point * 0.1).toFixed(1)) + item.oldValue
        data.CRIT = item.currentValue
        break;
      case 'CRITDMG':
        item.currentValue = item.point * 1 + item.oldValue
        data.CRITDMG = item.currentValue
        break;
      case 'DEF':
        item.currentValue = item.point * 2 + item.oldValue
        data.DEF = item.currentValue
        break;
      case 'BLOC':
        item.currentValue = item.point * 2 + item.oldValue
        data.BLOC = item.currentValue
        break;
      case 'MOVESPEED':
        item.currentValue = Number((item.point * 0.01).toFixed(2)) + item.oldValue
        data.MOVESPEED = -((item.point + item.hasPoint) * 0.06)
        break;
      case 'BATTLESPEED':
        item.currentValue = Number((item.point * 0.01).toFixed(2)) + item.oldValue
        data.BATTLESPEED = -((item.point + item.hasPoint) * 3)
        break;
      default:
        break;
    }
  })
  store.set_player_rein_attribute(data)
}

</script>
<style lang="scss" scoped>
.reincarnation {
  padding: 0.1rem;
  width: 5rem;

  .title {
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid #ccc;

    .info {
      padding-left: 0.2rem;

      p {
        color: #999;
        font-size: 0.12rem;
        margin: 0rem;
      }
    }

    p {
      margin: 0.1rem;
      font-size: 0.16rem;
    }

    .btn-div {
      padding: 0.1rem;
      display: flex;
      justify-content: flex-end;
      padding-right: 0.3rem;
    }
  }

  .content {
    padding: 0.1rem;

    .info {
      padding: 0.04rem;
      display: flex;
      justify-content: space-between;
    }

    .panel {
      padding: 0.05rem 0;

      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.06rem;

        p {
          display: flex;
          align-items: center;

          img {
            width: 0.25rem;
            height: 0.25rem;
          }

          span {
            margin-left: 0.06rem;
          }
        }

        .group {
          display: flex;
          justify-content: space-between;

          input {
            width: 0.8rem;
          }

          .button {
          }
        }
      }
    }
  }
}

.fb {
  width: 54px;
  height: 50px;
  line-height: 100px;
  border-radius: 10%;
  overflow: hidden;
  position: relative;
  // background: rgba(0, 0, 0, 0.1);
  z-index: 10;

  i {
    color: #ccc;
    font-size: 24px;
    font-weight: bold;
  }

  .content {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .fb-content {
    width: calc(100% - 4px);
    height: calc(100% - 4px);
    position: absolute;
    top: 2px;
    left: 2px;
    background: #061b21;
    border-radius: 8%;
    display: flex;
    z-index: 2;
  }

  &::after {
    content: "";
    position: absolute;
    display: inline-block;
    background-color: #3e94ce;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    animation: bgmove 2s linear infinite;
    @keyframes bgmove {
      0% {
        top: 0;
        left: 0;
        width: 100%;
        height: 5px;
      }
      25% {
        top: 0;
        left: 0;
        width: 5px;
        height: 100%;
      }
      50% {
        top: calc(100% - 5px);
        left: 0;
        width: 100%;
        height: 5px;
      }
      75% {
        top: 0px;
        left: calc(100% - 5px);
        width: 5px;
        height: 100%;
      }
      100% {
        top: 0;
        left: 0;
        width: 100%;
        height: 5px;
      }
    }
  }

  &::before {
    content: "";
    padding: 50%;
    position: absolute;
    top: -25%;
    left: -25%;
    bottom: -25%;
    right: -25%;
    transform-origin: center center;
    transform: rotate(30deg) scale(2);
    background: conic-gradient(
            #3e94ce,
            #3e94ce8a,
            rgba(0, 0, 0, 0.06),
            rgba(0, 0, 0, 0.06)
    );
    animation: rotate 2s linear infinite;
    @keyframes rotate {
      100% {
        transform: rotate(-330deg) scale(2);
      }
    }
  }
}
</style>
