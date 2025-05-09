import axios from 'axios';
import {ElMessage, ElMessageBox} from 'element-plus';
import {Session} from '@/utils/storage';

// 配置新建一个 axios 实例
const service = axios.create({
    baseURL: import.meta.env.VITE_API_URL as any,
    timeout: 50000,
    headers: {'Content-Type': 'application/json'},
});

// 添加请求拦截器
service.interceptors.request.use(
    (config: any) => {
        // 在发送请求之前做些什么 token
        if (Session.get('token')) {
            config.headers!['Authorization'] = `${Session.get('token')}`;
        }
        return config;
    },
    (error) => {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);

// 添加响应拦截器
service.interceptors.response.use(
    (response) => {
        // 对响应数据做点什么
        const res = response.data;
        if (res.code && res.code !== 200) {
            // `token` 过期或者账号已在别处登录
            if (res.code === 401 || res.code === 4001) {
                Session.clear(); // 清除浏览器全部临时缓存
                ElMessageBox.alert('你已被登出，请重新登录', '提示', {})
                    .then(() => {
                        // 弹窗确认后的回调逻辑
                        // 可以在此处执行跳转到登录页的操作
                        window.location.href = '/';
                    })
                    .catch(() => {
                        // 弹窗取消后的回调逻辑
                        // 可以根据需要进行处理
                    });
            } else if ((res.code === 403)) {
                ElMessage.error(res.msg)
            } else if (res.code === 400) {
                ElMessage.error(res.msg)
            } else if (res.code === 4003) {
                ElMessage.error(res.msg); // 显示错误信息
                setTimeout(() => {
                    window.location.href = '/'; // 去登录页
                }, 2000); // 延迟两秒后执行重定向
                Session.clear(); // 清除浏览器全部临时缓存
            }
            return Promise.reject(service.interceptors.response);
        } else {
            return response.data;
        }
    },
    (error) => {
        // 对响应错误做点什么
        if (error.message.indexOf('timeout') != -1) {
            ElMessage.error('网络超时');
        } else if (error.message == 'Network Error') {
            ElMessage.error('网络连接错误');
        } else {
            if (error.response.data) ElMessage.error(error.response.statusText);
            else ElMessage.error('接口路径找不到');
        }
        return Promise.reject(error);
    }
);

// 导出 axios 实例
export default service;
