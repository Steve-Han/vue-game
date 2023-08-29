<template>
  <div class="shop" ref="shopRoot">
    <div class="content">
      <div class="grid" v-for="(v, k) in grid" :key="k">
        <div class="title" v-if="v.lv" @contextmenu.prevent="openMenu(k, $event)"
             @mouseover="showItemInfo($event, v.itemType, v)" @mouseleave="closeItemInfo"
             @touchstart.stop.prevent="openMenu(k,$event)">
          <div class="icon" :style="{ 'box-shadow': 'inset 0 0 7px 2px ' + v.quality.color }">
            <img :src="v.type.iconSrc" alt=""/>
          </div>
          <span class="info" :style="{'font-size':(parseInt(v.gold)>99999?0.18:0.22)+'rem'}">{{ v.gold }}</span>
        </div>
      </div>
    </div>
    <div class="handle">

      <div class="info">
        <span v-show="timeStart" class="timeStart">下次刷新次数获取：{{ timeo }}s</span>
        <span>剩余刷新次数：{{ refreshTime }}次。</span>
      </div>

      <div class="button" @click="goldRefreshShopItems()">10000金币刷新</div>
      <div class="button" @click="refreshShopItems()">免费刷新</div>
      <!-- <div class="button" @click="sell">一键出售</div> -->
    </div>
    <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
      <li @click="showItemInfo($event, currentItem.itemType, currentItem,'touch')"
          v-if="store.operatorSchemaIsMobile">查看
      </li>
      <li @click="buyTheEquipment()">购买</li>
    </ul>
  </div>
</template>
<script setup>
import {useStore} from '../../store'
import {ref, reactive, defineProps, watch, onMounted, inject} from "vue";

const store = useStore()

let grid = reactive(new Array(5).fill({}))
let left = ref(0)
let top = ref(0)
let visible = ref(false)
let currentItem = reactive({})
let currentItemIndex = ref("")
let refreshTime = ref(5)
let timeo = ref(60)
let timeStart = ref(false)
let timeInterval = ref(null)
let isTouch = ref(false)
let tipsFlag = ref(false)
let tipsFlagComfirm = ref(false)
let shopRoot = ref(null)

watch(visible, (value, oldValue, onCleanup) => {
  if (value) {
    document.body.addEventListener("click", this.closeMenu);
  } else {
    document.body.removeEventListener("click", this.closeMenu);
  }
})

watch(refreshTime, (value, oldValue, onCleanup) => {
  if (value < 5) {
    if (timeStart.value) {
      return
    }
    timeStart.value = true
    timeInterval.value = setInterval(() => {
      timeo.value--
      if (timeo.value <= 0) {
        refreshTime.value++
        timeo.value = 60
      }
    }, 1000)
  } else {
    timeStart.value = false
    timeo.value = 5
    clearInterval(timeInterval.value)
  }
})

onMounted(() => {
  refreshShopItems(true);
})

/**
 * 刷新商店
 * constraint 是否跳过独特装备检测强制刷新
 */
function refreshShopItems(constraint) {
  tipsFlag.value = !constraint && grid.find(item => {
    return item.quality && item.quality.name == '独特'
  })
  if (tipsFlagComfirm.value) {
    if (tipsFlag.value && !constraint) {
      tipsFlagComfirm.value = true
      this.$message({
        message: '刷到了独特装备哦，不看看嘛？',
        closeBtnText: '看看',
        confirmBtnText: '辣鸡我不要',
        onCancle: () => {
          tipsFlagComfirm.value = false
        },
        onClose: () => {
          tipsFlagComfirm.value = false
          refreshShopItems(true)
        }
      })
      return
    }
    if (refreshTime.value > 5) {
      refreshTime.value = 5
    }
    if (refreshTime.value < 1) {
      store.set_sys_info({
        msg: `
              刷新次数不够了，等等吧。
            `,
        type: "warning",
      });
      return
    }
    refreshTime.value--
    grid.fill({}, 0 ,grid.length)
    var wlv = Number(store.playerAttribute.weapon.lv);
    var alv = Number(store.playerAttribute.armor.lv);
    var ringlv = Number(store.playerAttribute.ring.lv);
    var necklv = Number(store.playerAttribute.neck.lv);
    for (let i = 0; i < 5; i++) {
      var lv = Math.floor(store.playerAttribute.lv + Math.random() * 3);
      //装备等级最高200
      // lv = lv > 200 ? 200 : lv
      createShopItem(lv);
    }
  }
}
  /**
   * 金币刷新商店
   * constraint 是否跳过独特装备检测强制刷新
   */
  function goldRefreshShopItems(constraint) {
    tipsFlag.value = !constraint && grid.find(item => {
      return item.quality && item.quality.name == '独特'
    })
    if (tipsFlagComfirm.value) {
      return
    }
    if (tipsFlag.value && !constraint) {
      tipsFlagComfirm.value = true
      this.$message({
        message: '刷到了独特装备哦，不看看嘛？',
        closeBtnText: '看看',
        confirmBtnText: '辣鸡我不要',
        onCancle: () => {
          tipsFlagComfirm.value = false
        },
        onClose: () => {
          tipsFlagComfirm.value = false
          goldRefreshShopItems(true)
        }
      })
      return
    }
    if (store.playerAttribute.GOLD < 10000) {
      store.set_sys_info({
        msg: `
              钱不够啊，想啥呢。
            `,
        type: "warning",
      });
    } else {
      store.set_player_gold(-10000);
      grid.fill({}, 0 , grid.length)
      var wlv = Number(store.playerAttribute.weapon.lv);
      var alv = Number(store.playerAttribute.armor.lv);
      var ringlv = Number(store.playerAttribute.ring.lv);
      var necklv = Number(store.playerAttribute.neck.lv);
      for (let i = 0; i < 5; i++) {
        var lv = Math.floor(store.playerAttribute.lv + Math.random() * 3);
        createShopItem(lv);
      }
    }
  }

let backpackPanelRef = inject('backpackPanelRef');
let weaponPanelRef = inject('weaponPanelRef');
let armorPanelRef = inject('armorPanelRef');
let ringPanelRef = inject('ringPanelRef');
let neckPanelRef = inject('neckPanelRef');
let showItemInfo_p = inject('showItemInfo');
let weaponShow_p = inject('weaponShow');
let armorShow_p = inject('armorShow');
let ringShow_p = inject('ringShow');
let neckShow_p = inject('neckShow');

  function createShopItem(lv) {
    var equip = [0.4, 0.342, 0.25, 0.008];
    // var equip = [0.4, 0.30, 0.25, 0.05];
    // var equip = [0, 0, 0,1];
    var equipQua = -1;
    var r = Math.random();
    if (r <= equip[0]) {
      // 获得普通装备
      equipQua = 1;
    } else if (r < equip[1] + equip[0] && r >= equip[0]) {
      // 获得神器装备
      equipQua = 2;
    } else if (
        r < equip[2] + equip[1] + equip[0] &&
        r >= equip[1] + equip[0]
    ) {
      // 获得史诗装备
      equipQua = 3;
    } else if (
        r < equip[3] + equip[2] + equip[1] + equip[0] &&
        r >= equip[2] + equip[1] + equip[0]
    ) {
      // 获得独特装备
      equipQua = 4;
    } else {
      // 未获得装备
    }
    if (equipQua != -1) {
      // this.createEquip(equipQua,lv)
      var index = Math.floor(Math.random() * 4);
      if (index == 0) {
        var item = weaponPanelRef.value.createNewItem(equipQua, lv);
      } else if (index == 1) {
        var item = armorPanelRef.value.createNewItem(equipQua, lv);
      } else if (index == 2) {
        var item = ringPanelRef.value.createNewItem(equipQua, lv);
      } else {
        var item = neckPanelRef.value.createNewItem(equipQua, lv);
      }
      item = JSON.parse(item);
      item.gold = parseInt(item.lv * item.quality.qualityCoefficient * (250 + 20 * item.lv))
      for (let i = 0; i < grid.length; i++) {
        if (JSON.stringify(grid[i]).length < 3) {
          grid[i] = item;
          break;
        }
      }
    }
  }

  function openMenu(k, e) {
    currentItemIndex.value= k;
    currentItem = grid[k];
    const menuMinWidth = 105;
    const offsetLeft = shopRoot.value.getBoundingClientRect().left; // container margin left
    const offsetWidth = shopRoot.value.offsetWidth; // container width
    const maxLeft = offsetWidth - menuMinWidth; // left boundary
    var left_tem
    if (e.type == 'touchstart') {
      left_tem = e.changedTouches[0].clientX - offsetLeft + 15; // 15: margin right
    } else {
      left_tem = e.clientX - offsetLeft + 15; // 15: margin right
    }

    if (left_tem > maxLeft) {
      left.value = maxLeft;
    } else {
      left.value = left_tem;
    }

    top.value = e.offsetY;
    visible.value = true;
  }

  function closeMenu() {
    visible.value = false;
  }

  function showItemInfo($event, type, item, SchemaIsMobile) {
    if (SchemaIsMobile != 'touch' && store.operatorSchemaIsMobile) {
      return
    }
    showItemInfo_p($event, type, item);
  }

  function closeItemInfo() {
    weaponShow_p.value = armorShow_p.value = ringShow_p.value = neckShow_p.value = false;
  }

  function buyTheEquipment() {
    // var gold =
    //   this.currentItem.lv * this.currentItem.quality.qualityCoefficient * (200+5*this.currentItem.lv);
    // gold = parseInt(gold)
    if (store.playerAttribute.GOLD < currentItem.gold) {
      store.set_sys_info({
        msg: `
              钱不够啊，买啥呢。
            `,
        type: "warning",
      });
    } else {
      store.set_player_gold(-parseInt(currentItem.gold));

      for (let i = 0; i < backpackPanelRef.value.grid.length; i++) {
        if (JSON.stringify(backpackPanelRef.value.grid[i]).length < 3) {
          backpackPanelRef.value.grid[i] = currentItem
          break;
        }
      }
      grid[currentItemIndex.value] = {}
    }
  }

</script>
<style lang="scss" scoped>
.shop {
  width: 5.02rem;
  height: 3.1rem;
  display: flex;
  flex-wrap: wrap;
  padding: 0.14rem 0.14rem 0.14rem;
  justify-items: flex-start;
  align-items: flex-start;
  position: relative;
}

.handle {
  padding-top: 0.1rem;
  justify-content: flex-end;
  display: flex;
  align-items: center;
  width: 100%;
  height: 0.5rem;

  .info {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    flex: 1;
    margin-left: 0.2rem;
  }
}

.content {
  width: 100%;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.grid {
  width: 0.6rem;
  height: 0.6rem;
  border: 1px solid #ccc;
  box-shadow: inset 0 0 6px 6px rgba($color: #000000, $alpha: 0.5);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  .title {
    display: flex;
    width: 100%;
    cursor: pointer;

    .icon {
      width: 0.56rem;
      height: 0.56rem;
      background: #000;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.04rem;
    }
  }

  .info {
    position: absolute;
    bottom: -0.26rem;
    font-size: 0.24rem;
  }
}

.contextmenu {
  margin: 0;
  background: #000;
  border: 1px solid #fff;
  z-index: 3000;
  position: absolute;
  list-style-type: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #fff;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

  li {
    margin: 0;
    padding: 9px 16px;
    cursor: pointer;
    border-top: 1px solid #ccc;
    margin-top: -1px;
    font-size: 14px;
    letter-spacing: 6px;

    &:hover {
      color: #ccc;
    }
  }
}
</style>
