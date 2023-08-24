import {createRouter, createWebHistory} from 'vue-router'
import index from './views/index.vue'

const router = createRouter({
    history: createWebHistory(),
    mode: 'hash',
    base: import.meta.env,
    routes: [{
        path: '/',
        name: 'index',
        component: index
    }
    ]
});


/**
 * 重写路由的push方法
 */
const routerPush = router.push
router.push = function push(location) {
    return routerPush.call(this, location).catch(error => error)
}

export default router