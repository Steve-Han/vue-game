<template>
  <div class="dungeons">
    <div class="progress-bar"></div>
    <div class="icon-bar">
      <div class="player" :style="{left:left+'%','backgroundPosition':parseInt(left%4)*32+'px 96px'}">
        <!-- <img src="../../assets/icons/map/player-s.png" alt=""> -->
        <!-- :style="{background-position:}" -->
      </div>
      <div class="monster" v-for="(v,k) in dungeons.eventType" :key="k"
           :style="{left:(100/dungeons.eventNum)*(k+1)+'%'}">
        <img :src="'./icons/map/'+v.type+'.png'" alt="">
      </div>
    </div>
  </div>
</template>
<script setup>
import assist from '../../assets/js/assist';
import handle from "../../assets/js/handle.js";
import {useStore} from '../../store'
import {ref, reactive, computed, inject} from "vue";

const store = useStore()

let left = ref(0)
let pro = ref(0)
let timeOut = ref(0)
let battleComTime = ref(0)
let nextEvent = ref(1)
let battleTime = ref(2000)
let moveTime = ref(50)
let dungeons = reactive({
  battleTime: 2000,
  name: '史莱姆森林',
  time: '60',
  id: '1',
  eventNum: '5',
  lv: 1,
  eventType: [{
    name: '小史莱姆', type: 'monster',
    eventType: 'battle',
    attribute: {
      HP: 20,
      ATK: 1,
    },
    trophy: {
      gold: 30,
      equip: [
        1, 0, 0, 0
      ],
    }
  }, {
    name: '小史莱姆', type: 'monster', eventType: 'battle',
    attribute: {
      HP: 20,
      ATK: 1,
    },
    trophy: {
      gold: 30,
      equip: [
        0.2, 0.1, 0.05, 0
      ],
    }
  }, {
    name: '小史莱姆',
    type: 'monster', eventType: 'battle',
    attribute: {
      HP: 20,
      ATK: 1,
    },
    trophy: {
      gold: 30,
      equip: [
        0.2, 0.1, 0.05, 0
      ],
    }
  }, {
    name: '小史莱姆',
    type: 'monster', eventType: 'battle',
    attribute: {
      HP: 20,
      ATK: 1,
    },
    trophy: {
      gold: 30,
      equip: [
        0.2, 0.1, 0.05, 0
      ],
    }
  }, {
    name: '史莱姆王',
    type: 'boss', eventType: 'battle',
    attribute: {
      HP: 40,
      ATK: 2,
    },
    trophy: {
      gold: 30,
      equip: [
        0.25, 0.55, 0.15, 0.05
      ],
    }
  },]
})

let reincarnationAttribute = computed(() => {
  return store.reincarnationAttribute
})

function evenHandle() {
  let startEnent = () => {
    if (this.left >= this.nextEvent * 100 / this.dungeons.eventNum) {
      this.evenInExecution()
      this.nextEvent++
      if (this.nextEvent <= this.dungeons.eventNum) {
        this.timeOut = setTimeout(() => {
          this.pro = setInterval(() => {
            startEnent()
          }, this.moveTime + this.reincarnationAttribute.MOVESPEED)
        }, this.battleTime + this.reincarnationAttribute.BATTLESPEED)
      } else {
        setTimeout(() => {
          this.eventEnd()
        }, this.battleTime + this.reincarnationAttribute.BATTLESPEED)
      }

      clearInterval(this.pro)
    }

    this.left += 0.5
  }
  this.eventBegin()
  this.pro = setInterval(() => {
    startEnent()
  }, this.moveTime + this.reincarnationAttribute.MOVESPEED)
}

function eventBegin() {
  store.set_sys_info({
    msg: "你已进入" + (this.dungeons.type == "endless" ? '无尽（lv' + this.dungeons.lv + '）' : this.dungeons.name),
    type: 'warning'
  });
  if (this.dungeons.name == '黑色火山') {
    store.set_sys_info({
      msg: "似乎这就是最后的挑战了",
      type: 'battle'
    });
    store.set_sys_info({
      msg: "加油吧",
      type: 'battle'
    });
  }
}

function evenInExecution() {
  var event = dungeons.eventType[nextEvent.value - 1]
  switch (event.eventType) {
    case 'battle':
      store.set_sys_info({
        msg: `
              你遭遇了${event.name}(lv${this.dungeons.lv}),正在战斗中...
            `,
        type: 'battle'
      });
      battleComTime.value = setTimeout(() => {
        this.battleCom(event)
      }, battleTime.value + reincarnationAttribute.value.BATTLESPEED)
      break;

    default:
      break;
  }

}

function forcedToStopEvent() {
  clearInterval(pro.value)
  clearTimeout(timeOut.value)
  clearTimeout(battleComTime.value)
  pro.value = 0
  left.value = 0
  nextEvent.value = 1
  dungeons = {}
}


let reChallenge_p = inject("reChallenge");
let eventBegin_p = inject('eventBegin');
let reEChallenge_p = inject('reEChallenge');
let upEChallenge_p = inject('upEChallenge');
let showEndlessDungeonsInfo_p = inject('showEndlessDungeonsInfo');
let dungeons_p = inject('dungeons');
let inDungeons_p = inject('inDungeons');
let endlessLv_p = inject('endlessLv');

function eventEnd() {
  setTimeout(() => {
    // this.battleCom(event)
    if (dungeons.type == "endless") {
      store.set_sys_info({
        msg: `
                挑战成功，可以挑战下一层了
              `,
        type: "win",
      });
      store.set_endless_lv(store.playerAttribute.endlessLv + 1);
      store.set_player_curhp('full');
    } else {
      store.set_sys_info({
        msg: `
                副本探索成功！
              `,
        type: "win",
      });
    }

    //todo 兄弟组件间通讯的方法
    let backpackPanel = assist().findBrothersComponents(this, 'backpackPanel', false)[0]

    if (dungeons.name == '黑色火山' && !store.playerAttribute.endlessLv) {

      store.set_sys_info({
        msg: "击败了最后的boss，你通关了！",
        type: 'warning'
      });
    }

    if (dungeons.lv >= 10 && !store.playerAttribute.endlessLv) {
      store.set_sys_info({
        msg: "开启了无尽挑战，可点击地图右上角副本图标进入",
        type: 'warning'
      });
      store.set_sys_info({
        msg: "试试你的极限吧",
        type: 'warning'
      });
      store.set_endless_lv(1)
    }
    this.forcedToStopEvent()
    let backpackPanelSign = backpackPanel.itemNum / backpackPanel.grid.length < 0.8
    if (reChallenge_p && backpackPanelSign) {
      eventBegin_p()
    } else if (reEChallenge_p && dungeons_p.type == 'endless') {
      store.set_endless_lv(store.playerAttribute.endlessLv - 1);
      eventBegin_p()
    } else if (upEChallenge_p && dungeons_p.type == 'endless') {
      endlessLv_p.value = store.playerAttribute.endlessLv
      dungeons_p.lv = store.playerAttribute.endlessLv
      showEndlessDungeonsInfo_p()
      eventBegin_p()
    } else {
      dungeons_p = {}
      inDungeons_p.value = false
    }

  }, 100)
}

// 计算战斗过程
function battleCom(event) {
  let playerAttribute = store.playerAttribute.attribute,
      battleTime,
      healthRecoverySpeed = store.playerAttribute.healthRecoverySpeed,
      reducedDamage = store.playerAttribute.attribute.REDUCDMG,
      playerDPS = playerAttribute.DPS,
      playerBLOC = playerAttribute.BLOC.value,
      monsterAttribute = handle.deepCopy(event.attribute), //HP: 100,ATK: 1,
      p = assist().findComponentUpward(this, 'index')

  var playerDeadTime = (playerAttribute.CURHP.value + playerBLOC) / reducedDamage / monsterAttribute.ATK,
      monsterDeadTime = (monsterAttribute.HP / playerDPS)

  // 战斗获胜
  if (monsterDeadTime < playerDeadTime) {
    battleTime = monsterDeadTime
    var takeDmg = -battleTime * Number(monsterAttribute.ATK)
    takeDmg = parseInt(takeDmg * reducedDamage)
    takeDmg = takeDmg + playerBLOC
    takeDmg = takeDmg > -1 ? -1 : takeDmg
    store.set_player_curhp(takeDmg)

    if (dungeons.type == 'endless') {
      store.set_sys_info({
        msg: `
              击杀了${event.name}(无尽层数：${this.dungeons.lv})，受到了${Math.abs(takeDmg)}点伤害
            `,
        type: 'win'
      });
    } else {
      store.set_sys_info({
        msg: `
              击杀了${event.name}(lv${this.dungeons.lv})，受到了${Math.abs(takeDmg)}点伤害
            `,
        type: 'win'
      });
    }
    // 计算战利品获取
    this.caculateTrophy(event)
    // 副本战斗成功时提升玩家等级
    if (dungeons.lv > store.playerAttribute.lv && event.type == 'boss') {
      store.set_sys_info({
        msg: `
              你升级了，可以刷新出更高等级的副本了。
            `,
        type: 'win'
      });
      store.set_player_lv(dungeons.lv)
    }
    // 高难度副本只可以挑战一次
    if (dungeons.difficulty != 1) {
      p.dungeonsArr = p.dungeonsArr.filter(({id}) => id !== dungeons.id);
    }
  } else {
    // 玩家死亡
    store.set_player_curhp('dead')
    clearInterval(pro.value)
    clearTimeout(timeOut.value)
    pro.value = 0
    timeOut.value = 0
    left.value = 0
    nextEvent.value = 1
    p.inDungeons.value = false
    dungeons = {}
    var takeDmg = monsterDeadTime * Number(monsterAttribute.ATK)
    takeDmg = parseInt(takeDmg * reducedDamage)
    takeDmg = takeDmg - playerBLOC
    takeDmg = takeDmg < 1 ? 1 : takeDmg
    store.set_sys_info({
      msg: `
              战斗失败！受到了${takeDmg}点伤害
            `,
      type: 'warning'
    });
    store.set_sys_info({
      msg: `
              你可以尝试强化或者重铸装备之后在来挑战哦
            `,
      type: 'warning'
    });
  }
}

//战利品计算
function caculateTrophy(event) {
  var items = []
  var lv = dungeons.lv
  // 获取独特装备
  if (event.type == 'boss' && dungeons.type != 'endless') {
    var randow = 1 - 0.02 * ((dungeons.difficulty - 1) * 2 + 1)
    if (Math.random() > randow) {
      var random = Math.random()
      if (random <= 0.3 && random > 0) {
        var b = assist().findBrothersComponents(this, 'weaponPanel', false)[0]
        var item = b.createNewItem(4, parseInt(lv + Math.random() * 6))
        items.push(JSON.parse(item))
      } else if (random <= 0.5 && random > 0.3) {
        var b = assist().findBrothersComponents(this, 'armorPanel', false)[0]
        var item = b.createNewItem(4, parseInt(lv + Math.random() * 6))
        items.push(JSON.parse(item))
      } else if (random <= 0.75 && random > 0.5) {
        var b = assist().findBrothersComponents(this, 'ringPanel', false)[0]
        var item = b.createNewItem(4, parseInt(lv + Math.random() * 6))
        items.push(JSON.parse(item))
      } else {
        var b = assist().findBrothersComponents(this, 'neckPanel', false)[0]
        var item = b.createNewItem(4, parseInt(lv + Math.random() * 6))
        items.push(JSON.parse(item))
      }

    }
  }
  var trophy = event.trophy
  var equip = [0.25, 0.25, 0.25, 0.25]
  var equip = trophy.equip
  var equipQua = -1;
  var r = Math.random()
  if (r <= equip[0]) {
    // 获得破旧装备
    equipQua = 0
  } else if (r < equip[1] + equip[0] && r >= equip[0]) {
    // 获得普通装备
    equipQua = 1
  } else if (r < equip[2] + equip[1] + equip[0] && r >= equip[1] + equip[0]) {
    // 获得神器装备
    equipQua = 2
  } else if (r < equip[3] + equip[2] + equip[1] + equip[0] && r >= equip[2] + equip[1] + equip[0]) {
    // 获得史诗装备
    equipQua = 3
  } else {
    // 未获得装备
  }
  //获得装备时
  if (equipQua != -1) {
    // this.createEquip(equipQua,lv)
    var index = Math.floor((Math.random() * 4));
    if (index == 0) {
      var b = assist().findBrothersComponents(this, 'weaponPanel', false)[0]
      var item = b.createNewItem(equipQua, lv)
    } else if (index == 1) {
      var b = assist().findBrothersComponents(this, 'armorPanel', false)[0]
      var item = b.createNewItem(equipQua, lv)
    } else if (index == 2) {
      var b = assist().findBrothersComponents(this, 'ringPanel', false)[0]
      var item = b.createNewItem(equipQua, lv)
    } else {
      var b = assist().findBrothersComponents(this, 'neckPanel', false)[0]
      var item = b.createNewItem(equipQua, lv)
    }
    items.push(JSON.parse(item))
    var backpackPanel = assist().findBrothersComponents(this, 'backpackPanel', false)[0]
    var goldObtainRatio = 1
    if (dungeons.type == 'endless') {
      var endlessLv = store.playerAttribute.endlessLv
      goldObtainRatio = 1.5
      items = []
    }
    store.set_sys_info({
      msg: `
              获得了:金币${parseInt(event.trophy.gold * goldObtainRatio)}
            `,
      type: 'trophy',
      equip: items
    });
    store.set_player_gold(parseInt(event.trophy.gold * goldObtainRatio));
    if (dungeons.type == 'endless') {
      return
    }
    items.map(item => {
      // 当开启了自动出售并且新获得的装备品质低于史诗时，自动出售
      if (backpackPanel.autoSell[equipQua] && item.quality.name != "独特") {
        var gold = item.lv * item.quality.qualityCoefficient * 30
        store.set_player_gold(parseInt(gold));
        store.set_sys_info({
          msg: `
                自动出售装备获得金币：${parseInt(gold)}
              `,
          type: 'trophy',
        });
      } else {
        for (let i = 0; i < backpackPanel.grid.length; i++) {
          if (JSON.stringify(backpackPanel.grid[i]).length < 3) {
            backpackPanel.grid[i] = item
            break;
          }
        }
      }
    })
  } else {
    //金币获取倍率
    var goldObtainRatio = 1
    if (dungeons.type == 'endless') {
      var endlessLv = store.playerAttribute.endlessLv
      goldObtainRatio = 2.6
    }
    store.set_sys_info({
      msg: `
              获得了:金币${parseInt(event.trophy.gold * goldObtainRatio)}
            `,
      type: 'trophy',
      equip: []
    });
    store.set_player_gold(parseInt(event.trophy.gold * goldObtainRatio));
  }
}

</script>
<style lang="scss" scoped>
.dungeons {
  width: 100%;
  height: 100%;
  position: relative;

  .progress-bar {
    position: absolute;
    bottom: 5px;
    left: 10px;
    right: 10px;
    border: 1px solid #fff;
  }

  .icon-bar {
    margin: 0 30px;
    width: calc(100% - 60px);
    height: 100%;
    position: relative;

    & > div {
      position: absolute;
      height: 34px;
      width: 34px;
      top: 50%;
      transform: translate(-50%, -50%);
      display: flex;

      img {
        height: 34px;
        width: 34px;
      }
    }

    .player {
      z-index: 2;
      height: 48px;
      width: 32px;
      // background-position: -0px 96px !important;
      background-repeat: no-repeat;
      background: url(../../assets/icons/map/player-s.png);
    }

    .monster {
      left: 20%;
    }
  }
}
</style>
