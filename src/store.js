import {defineStore} from 'pinia'
import handle from './assets/js/handle'

var initial_weapon = {
        "lv": 1,
        itemType: 'weapon',
        "quality": {
            name: '破旧',
            qualityCoefficient: 0.7,
            probability: '0.25',
            color: '#a1a1a1',
            extraEntryNum: 1,
        },
        "type": {
            "name": "新手短剑",
            "des": "新手菜鸡使用的短剑",
            "iconSrc": "./icons/W_Sword001.png",
            "entry": [{
                "valCoefficient": 0.9,
                "value": 1,
                "showVal": "+1",
                "type": "ATK",
                "name": "攻击力"
            }]
        },
        "extraEntry": [{
            "value": 1,
            "showVal": "+1",
            "type": "ATK",
            "name": "攻击力"
        }]
    },
    initial_armor = {
        "lv": 1,
        itemType: 'armor',
        "quality": {
            name: '破旧',
            qualityCoefficient: 0.7,
            probability: '0.25',
            color: '#a1a1a1',
            extraEntryNum: 1,
        },
        "type": {
            "name": "新手布衣",
            "des": "新手菜鸡穿的普通衣物",
            "iconSrc": "./icons/A_A3.png",
            "entry": [{
                "valCoefficient": 0.9,
                "value": 1,
                "showVal": "+1",
                "type": "DEF",
                "name": "防御力"
            }]
        },
        "extraEntry": [{
            "type": "HP",
            "value": 10,
            "showVal": "+10",
            "name": "生命值"
        },]
    },
    initial_neck = {
        "lv": 1,
        itemType: 'neck',
        "quality": {
            name: '破旧',
            qualityCoefficient: 0.7,
            probability: '0.25',
            color: '#a1a1a1',
            extraEntryNum: 1,
        },
        "type": {
            "name": "新手项坠",
            "des": "一个普通的指环",
            "iconSrc": "./icons/Ac_3.png",
            "entry": [{
                "valCoefficient": 0.9,
                "value": 20,
                "showVal": "+20",
                "type": "HP",
                "name": "生命值"
            }]
        },
        "extraEntry": [{
            "type": "CRIT",
            "value": 10,
            "showVal": "+10%",
            "name": "暴击率"
        }]
    },
    initial_ring = {
        "lv": 1,
        itemType: 'ring',
        "quality": {
            name: '破旧',
            qualityCoefficient: 0.7,
            probability: '0.25',
            color: '#a1a1a1',
            extraEntryNum: 1,
        },
        "type": {
            "name": "新手指环",
            "des": "一个普通的指环",
            "iconSrc": "./icons/Ac_10.png",
            "entry": [{
                "valCoefficient": 0.9,
                "value": 20,
                "showVal": "+20",
                "type": "HP",
                "name": "生命值"
            }]
        },
        "extraEntry": [{
            "type": "CRIT",
            "value": 10,
            "showVal": "+10%",
            "name": "暴击率"
        }]
    };


export const useStore = defineStore("store", {
    state: () => ({
        operatorSchemaIsMobile: false,
        needStrengthenEquipment: {}, //设定当前需要强化的装备
        sysInfo: [{
            type: '',
            msg: "欢迎你勇士，点击地图上的副本开始战斗。"
        }, {
            type: '',
            msg: "菜单栏可以刷新当前世界副本。"
        }],
        reincarnationAttribute: {
            'HP': 0,
            'ATK': 0,
            'CRIT': 0,
            'CRITDMG': 0,
            'DEF': 0,
            'BLOC': 0,
            'MOVESPEED': 0,
            'BATTLESPEED': 0,
        },
        reincarnation: {
            count: 0,
            point: 0,
        },
        playerAttribute: {
            lv: 1,
            GOLD: 0,
            healthRecoverySpeed: 1,
            endlessLv: 0,
            attribute: {
                CURHP: {
                    value: 0,
                    showValue: '',
                },
                MAXHP: {
                    value: 0,
                    showValue: '',
                },
                ATK: {
                    value: 0,
                    showValue: '',
                },
                DEF: {
                    value: 0,
                    showValue: '',
                },
                REDUCDMG: { //根据护甲计算的减伤比例
                    value: 0,
                    showValue: '',
                },
                CRIT: {
                    value: 0,
                    showValue: '',
                },
                CRITDMG: {
                    value: 0,
                    showValue: '',
                },
                BLOC: {
                    value: 0,
                    showValue: '0',
                },
                EVA: {
                    value: 0,
                    showValue: '',
                },
            },
            weapon: initial_weapon,
            armor: initial_armor,
            ring: initial_ring,
            neck: initial_neck,
        }
    }),
    actions: {
        set_player_weapon(data) {
            this.playerAttribute.weapon = data
            this.set_player_attribute(data)
        },
        set_player_armor(data) {
            this.playerAttribute.armor = data
            this.set_player_attribute(data)
        },
        set_player_ring(data) {
            this.playerAttribute.ring = data
            this.set_player_attribute(data)
        },
        set_player_neck(data) {
            this.playerAttribute.neck = data || initial_neck
            this.set_player_attribute(data)
        },
        set_player_rein_attribute(data) {
            this.reincarnationAttribute = data
            this.set_player_attribute(data)
        },
        set_player_rein(data) {
            this.reincarnation = data
        },
        set_player_attribute(data) {
            var p = this.playerAttribute
            var warpon = p.weapon,
                armor = p.armor,
                ring = p.ring,
                neck = p.neck,
                entry = [],
                chp = this.playerAttribute.attribute.CURHP.value,
                mhp = this.playerAttribute.attribute.MAXHP.value,
                rA = this.reincarnationAttribute,
                hpP;
            if (chp && mhp) {
                hpP = chp / mhp
            }

            var attribute = {
                CURHP: {
                    value: 0,
                    showValue: '',
                },
                MAXHP: {
                    value: 0 + rA.HP,
                    showValue: '',
                },
                ATK: {
                    value: 0 + rA.ATK,
                    showValue: 0 + rA.ATK,
                },
                DEF: {
                    value: 0 + rA.DEF,
                    showValue: 0 + rA.DEF,
                },
                CRIT: {
                    value: 0 + rA.CRIT,
                    showValue: '+' + 0 + rA.CRIT + '%',
                },
                CRITDMG: {
                    value: 0 + rA.CRITDMG,
                    showValue: '+' + 0 + rA.CRITDMG + '%',
                },
                EVA: {
                    value: 0,
                    showValue: '',
                },
                BLOC: {
                    value: 0 + rA.BLOC,
                    showValue: 0 + rA.BLOC,
                },
            }


            let warponStrEntry = handle.deepCopy(warpon.type.entry)
            let armorStrEntry = handle.deepCopy(armor.type.entry)
            let ringStrEntry = handle.deepCopy(ring.type.entry)
            let neckStrEntry = handle.deepCopy(neck.type.entry)
            handle.CalculateStrAttr(warponStrEntry, warpon.enchantlvl || 0)
            handle.CalculateStrAttr(armorStrEntry, armor.enchantlvl || 0)
            handle.CalculateStrAttr(ringStrEntry, ring.enchantlvl || 0)
            handle.CalculateStrAttr(neckStrEntry, neck.enchantlvl || 0)

            entry = [].concat(warponStrEntry).concat(warpon.extraEntry).concat(armorStrEntry).concat(armor.extraEntry).concat(ringStrEntry).concat(ring.extraEntry).concat(neckStrEntry).concat(neck.extraEntry)

            // 命中几率初始为100%，用来计算最终的闪避几率
            let HitChance = 1
            entry.map(item => {
                switch (item.type) {
                    case 'ATK':
                        attribute.ATK.value += Number(item.value)
                        attribute.ATK.showValue = '+' + (attribute.ATK.value)
                        break;
                    case 'DEF':
                        attribute.DEF.value += Number(item.value)
                        attribute.DEF.showValue = '+' + (attribute.DEF.value)
                        break;
                    case 'HP':
                        attribute.MAXHP.value += Number(item.value)
                        attribute.MAXHP.showValue = '+' + (attribute.MAXHP.value)
                        break;
                    case 'CRIT':
                        attribute.CRIT.value += Number(item.value)
                        attribute.CRIT.showValue = '+' + attribute.CRIT.value + '%'
                        break;
                    case 'CRITDMG':
                        attribute.CRITDMG.value += Number(item.value)
                        attribute.CRITDMG.showValue = '+' + attribute.CRITDMG.value + '%'
                        break;
                    case 'EVA':
                        HitChance = HitChance * (1 - item.value / 100)
                        break;
                    case 'BLOC':
                        attribute.BLOC.value += Number(item.value)
                        attribute.BLOC.showValue = (attribute.BLOC.value)
                        break;
                    default:
                        break;
                }
            })
            var ATKPERCENT = 0,
                DEFPERCENT = 0,
                HPPERCENT = 0,
                BLOCPERCENT = 0
            entry.map(item => {
                switch (item.type) {
                    case 'ATKPERCENT':
                        ATKPERCENT += Number(item.value)
                        break;
                    case 'DEFPERCENT':
                        DEFPERCENT += Number(item.value)
                        break;
                    case 'HPPERCENT':
                        HPPERCENT += Number(item.value)
                        break;
                    case 'BLOCPERCENT':
                        BLOCPERCENT += Number(item.value)
                        break;
                    default:
                        break;
                }
            })
            attribute.ATK.value = parseInt(attribute.ATK.value * (100 + ATKPERCENT) / 100)
            attribute.ATK.showValue = '+' + (attribute.ATK.value)
            attribute.DEF.value = parseInt(attribute.DEF.value * (100 + DEFPERCENT) / 100)
            attribute.DEF.showValue = '+' + (attribute.DEF.value)
            attribute.MAXHP.value = parseInt(attribute.MAXHP.value * (100 + HPPERCENT) / 100)
            attribute.MAXHP.showValue = '+' + (attribute.MAXHP.value)
            attribute.BLOC.value = parseInt(attribute.BLOC.value * (100 + BLOCPERCENT) / 100)
            attribute.BLOC.showValue = '+' + (attribute.BLOC.value)
            attribute.EVA.value = ((1 - HitChance) * 100).toFixed(1)
            attribute.EVA.showValue = ((1 - HitChance) * 100).toFixed(1) + '%'

            // console.log(vueInstance.$store.state)
            attribute.MAXHP.value += 200
            if (hpP) {
                attribute.CURHP.value = parseInt(attribute.MAXHP.value * hpP)
                attribute.CURHP.showValue = '+' + (attribute.CURHP.value)
            } else {
                attribute.CURHP = handle.deepCopy(attribute.MAXHP)
            }

            // 初始暴击伤害150%
            attribute.CRITDMG.value += 150

            var atk = attribute.ATK.value,
                crit = attribute.CRIT.value,
                critdmg = attribute.CRITDMG.value
            // 暴击率最多100%
            if (crit > 100) {
                crit = 100
            }
            attribute.DPS = parseFloat((1 - crit / 100) * atk * 1 + crit / 100 * (critdmg) / 100 * atk * 1)
            var armor = attribute.DEF.value

            //承受伤害比例
            // attribute.REDUCDMG = 1 - 0.06 * armor / (1 + (0.06 * armor))
            attribute.REDUCDMG = 1 - 0.05 * armor / (1 + (0.0525 * armor))

            // state.playerAttribute.attribute=attribute
            //this.set_player_attribute(attribute)
            this.playerAttribute.attribute = attribute
        },
        set_sys_info(data) {
            this.sysInfo.push(data);
            var time = +new Date()
            var date = new Date(time + 8 * 3600 * 1000); // 增加8小时
            this.sysInfo[this.sysInfo.length - 1].time = date.toJSON().substr(11, 8).replace('T', ' ')
            if (this.sysInfo.length > 50) {
                this.sysInfo.shift()
            }
        },
        clear_sys_info(data) {
            this.sysInfo.splice(1, this.sysInfo.length)
        },
        set_player_gold(data) {
            this.playerAttribute.GOLD += parseInt(data);
        },
        reset_player_gold(data) {
            this.playerAttribute.GOLD = parseInt(data);
        },
        reset_player_equi() {
            this.set_player_weapon(initial_weapon)
            this.set_player_armor(initial_armor)
            this.set_player_ring(initial_ring)
            this.set_player_neck(initial_neck)
            this.set_player_lv(1)
        },
        set_endless_lv(data) {
            this.playerAttribute.endlessLv = parseInt(data) < 1 ? 1 : parseInt(data);
        },
        set_player_lv(data) {
            data = data < 1 ? 1 : data
            this.playerAttribute.lv = parseInt(data || 1);
        },
        set_operator_schema(data) {
            this.operatorSchemaIsMobile = data;
        },
        set_need_strengthen_equipment(data) {
            this.needStrengthenEquipment = data;
        },
        set_player_curhp(data) {
            var CURHP = this.playerAttribute.attribute.CURHP,
                MAXHP = this.playerAttribute.attribute.MAXHP
            if (data == 'dead') {
                CURHP.value = 1
            } else if (data == 'full') {
                CURHP.value = MAXHP.value
            } else {
                CURHP.value += Number(data);
                CURHP.value = parseInt(CURHP.value)
                if (CURHP.value > MAXHP.value) {
                    CURHP.value = MAXHP.value
                }
            }
        }
    },
})