import QueryString from "qs"
import * as auth from 'auth-provider'
import { useAuth } from "context/auth-context"

const apiURL = process.env.REACT_APP_API_URL

interface Config extends RequestInit {
    token?: string,
    data?: object,
}

export const http = async (endpoint: string, { data, token, headers, ...customConfig }: Config ={} ) => {
    const config = {
        method: "GET",//只是默认为get，如果customConfig中还传入了method则会把get覆盖
        headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': data ? 'application/json' : '',
        },
        ...customConfig
    }

    if (config.method.toUpperCase() === 'GET') {
        endpoint += `?${QueryString.stringify(data)}`
    }
    else {
        config.body = JSON.stringify(data || {})
    }
    return window.fetch(`${apiURL}/${endpoint}`, config)
        .then(async response => {
            if (response.status === 401) {
                await auth.logout()
                return Promise.reject({ message: '请重新登录' })
            }
            const data = await response.json()
            //fetch 并不会对401 ，500等异常状态抛出异常，必须手动抛出异常
            //如果使用axios的话会自动在返回状态不为2xx时抛出异常状态
            if (response.ok) {
                return data
            } else {
                return Promise.reject(data)
            }
        })
}

//发送ajax请求的hook，发送请求时会获取context中保存的user信息
export const useHttp = () => {
    const { user } = useAuth()
    //Parameters<typeof http>, ts中的Utility Types
    //从函数类型的参数中使用的类型构造一个元组类型Type
    return (...[endpoint, config]: Parameters<typeof http>) => http(endpoint, { ...config, token: user?.token })
}