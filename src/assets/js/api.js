/**
 * axios封装
 * 请求拦截、响应拦截、错误统一处理
 */
import axios from 'axios';
import {useStore} from '../../store'

export default async function getAxiosInstance() {
    var baseURL, instance

    baseURL = 'http://couy.xyz:3001/';

    // 必须再函数内部使用
    const store = useStore()

    /**
     * 请求失败后的错误统一处理
     * @param {Number} status 请求失败的状态码
     */
    const errorHandle = (status, response) => {
        // 状态码判断
        switch (status) {
            // 401: 未登录状态，跳转登录页
            case 401:
                store.set_sys_info({
                    msg: `
          😭${response.data.msg || '服务器有点问题，请稍后重试'}
          `,
                    type: 'warning'
                });
                break;
            case 403:
                store.set_sys_info({
                    msg: `
          😭${response.data.msg || '服务器有点问题，请稍后重试'}
          `,
                    type: 'warning'
                });
                break;
            case 404:
                store.set_sys_info({
                    msg: `
          😭${response.data.msg || '服务器有点问题，请稍后重试'}
          `,
                    type: 'warning'
                });
                break;
            default:
                store.set_sys_info({
                    msg: `
          😭${response.data.msg || '服务器有点问题，请稍后重试'}
          `,
                    type: 'warning'
                });
        }
    }

    // 创建axios实例
    instance = axios.create({
        timeout: 1000 * 12 // 设置十二秒钟的请求超时限制
        // transformRequest: data => qs.stringify(data)
    });
    if (import.meta.env == 'development') {
        //开发环境
        instance.defaults.baseURL = baseURL;
    } else if (import.meta.env == 'debug') {
        //debug
        instance.defaults.baseURL = baseURL;
    } else if (import.meta.env == 'production') {
        //生产环境
        instance.defaults.baseURL = baseURL;
    }
    // 设置post请求头
    instance.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

    // 响应拦截器
    instance.interceptors.response.use(
        // 请求成功
        res => res.status === 200 ? Promise.resolve(res) : Promise.reject(res),
        // 请求失败
        error => {
            const {response} = error;
            if (response) {
                // 请求已发出，但是不在2xx的范围
                errorHandle(response.status, response);

                return Promise.reject(response);
            } else {
                store.set_sys_info({
                    msg: `
          😭${response.data.msg || '服务器有点问题，请稍后重试'}
          `,
                    type: 'warning'
                });
            }
        });

    return instance
}