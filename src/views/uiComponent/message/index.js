import MessageComponent from './message.vue'
import { createVNode, render } from "vue";

let seed = 1  // 通过seed++来给每个实例创建不同id
let instances = []  // 用于存放所有组件实例

let Message = (options = {}) => {
    // 当调用直接传入字符串的时候，this.$message('内容')
    if (typeof options === 'string') {
        options = {
            message: options
        }
    }

    let id = 'message_' + seed++
    let userOnClose = options.onClose
    let userOnCancle = options.onCancle

    // 组件关闭的时候执行close方法
    // 主要用来数组中移出实例，并重新计算偏移量
    options.onClose = function () {
        Message.close(id, userOnClose)
    }
    options.onCancle = function () {
        Message.cancle(id, userOnCancle)
    }
    // 计算每个组件的偏移
    let verticalOffset = options.offset || 16
    instances.forEach(item => {
        verticalOffset += item.offsetHeight + 16
    })
    options.verticalOffset = verticalOffset

    const MessageConstructor = createVNode(MessageComponent, options);
    //创建一个空的div
    let mountNode = document.createElement("div");
    //render函数的作用就是将Notice组件的虚拟DOM转换成真实DOM并插入到mountNode元素里
    render(MessageConstructor, mountNode);

    // 实例id赋值
    mountNode.id = id

    instances.push(mountNode)

    //然后把转换成真实DOM的Notice组件插入到body里
    document.body.appendChild(mountNode);
    return MessageConstructor
}

Message.close = function (id, userOnClose) {
    let len = instances.length
    let index = -1
    index = instances.findIndex(item => {
        return item.id === id
    })
    if (index === -1) return
    const removedHeight = instances[index].offsetHeight
    if (typeof userOnClose === 'function') {
        userOnClose(instances[index])
    }
    //移除div
    instances[index].remove()
    instances.splice(index, 1)

    // 重新计算偏移量
    if (len <= 1 || index > instances.length - 1) return
    for (let i = index; i < len - 1; i++) {
        let dom = instances[i]
        dom.style['top'] =
            parseInt(dom.style['top'], 10) - removedHeight - 16 + 'px'
    }
}

Message.cancle = function (id, userOnCancle) {
    let len = instances.length
    let index = -1
    index = instances.findIndex(item => {
        return item.id === id
    })
    if (index === -1) return
    const removedHeight = instances[index].offsetHeight
    if (typeof userOnCancle === 'function') {
        userOnCancle(instances[index])
    }
    //移除div
    instances[index].remove()
    instances.splice(index, 1)

    // 重新计算偏移量
    if (len <= 1 || index > instances.length - 1) return
    for (let i = index; i < len - 1; i++) {
        let dom = instances[i]
        dom.style['top'] =
            parseInt(dom.style['top'], 10) - removedHeight - 16 + 'px'
    }
}

export default Message