import axios from 'axios'
import qs from 'qs'
import {Message} from 'antd';
// import {getCookie} from '../tool/tool';

const baseurl = '';
export default {
    get: function(url, data, error) {
        // 解决 ie浏览器，360兼容模式get请求缓存问题
        data.clearCookie= (new Date()).getTime() + Math.random();

        const options = {
            method: 'get',
            url: url, //
            baseURL: baseurl,
            timeout: 1000*30,//请求超时时间
            params: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        };
        return axios(options).then(res => {
            if (res && res.status === 200 && res.data) {
                if (res.data.response_code - 0 === 0) {
                    return res.data;
                } else {
                    Message.error(error || '数据请求错误');
                    return false;
                }

            } else {
                Message.error(error || '数据请求失败');
                return false;
            }
        }, () => {
            Message.error('网络异常,' + (error || '数据请求异常'));
            return false;
        }).catch(err => {
            Message.error('网络异常,' + (error || '数据请求异常'));
            return false;
        });

    },
    put: async function(url, params, error) {
        const options = {
            method: 'put',
            url: url,
            baseURL: baseurl,
            timeout: 1000*30,//请求超时时间
            data: qs.stringify(params),
            // headers: {
            //     'Content-Type': 'application/x-www-form-urlencoded',
            // }
        };
        return axios(options).then(res => {
            if (res && res.status === 200 && res.data) {
                if (res.data.response_code - 0 === 0) {
                    return res.data;
                } else {
                    Message.error(error || '数据修改失败');
                    return false;
                }

            } else {
                Message.error(error || '数据修改失败');
                return false;
            }
        }, () => {
            Message.error('网络异常,' + (error || '数据修改失败'));
            return false;
        }).catch(err => {
            Message.error('网络异常,' + (error || '数据修改失败'));
            return false;
        });
    },
    post: (url, params, error) => {
        let contentType = 'application/x-www-form-urlencoded';
        const options = {
            method: 'post',
            url: url,
            baseURL: baseurl,
            timeout: 1000*30,//请求超时时间
            data: qs.stringify(params), // qs.stringify(params)
            headers: {
                'Content-Type': contentType, // 'application/x-www-form-urlencoded',
            }
        };
        return axios(options).then(res => {
            console.log(res);
            if (res && res.status === 200 && res.data) {
                if (res.data.response_code - 0 === 0 || res.data.response_code - 0 === 200) {
                    return res.data;
                } else {
                    Message.error(error || '添加或导入数据失败');
                    return false;
                }

            } else {
                Message.error(error || '添加或导入数据失败');
                return false;
            }
        }, () => {
            Message.error('网络异常,'+ (error || '添加或导入数据失败'));
            return false;
        }).catch(err => {
            Message.error('网络异常,'+ (error || '添加或导入数据失败'));
            return false;
        });
    },
    delete: (url, params) => {
        const options = {
            method: 'delete',
            url: url,
            baseURL: baseurl,
            timeout: 1000*30,//请求超时时间
            data: qs.stringify(params), // qs.stringify(params)
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded', // application/x-www-form-urlencoded
            },
        };
        return axios(options).then(res => {
            if (res && res.status === 200 && res.data) {
                if (res.data.response_code - 0 === 0) {
                    return res.data;
                } else {
                    Message.error('删除失败');
                    return false;
                }

            } else {
                Message.error('删除失败');
                return false;
            }
        }, () => {
            Message.error('网络异常,删除失败');
            return false;
        }).catch(err => {
            Message.error('网络异常,删除失败');
            return false;
        });
    },
}
