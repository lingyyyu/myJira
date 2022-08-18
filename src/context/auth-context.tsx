import React, { ReactNode, useState } from "react"
import * as auth from 'auth-provider'
import { User } from "screens/projectList/SearchPanel"
import { http } from "utils/http"
import { useMount } from "utils"
import { useAsync } from "utils/use-async"
import { FullPageErrorFallback, FullPageLoading } from "components/lib"
import { useQueryClient } from "react-query"


interface AuthForm {
    username: string
    password: string
}

//初始化用户，存在token时维持用户登录状态
const bootstrapUser=async ()=>{
    let user=null
    //查看localStorage中是否存在token
    const token=auth.getToken()
    //存在token时，将token发送请求给服务器获得user的信息
    if(token){
        const data=await http('me',{token})
        user=data.user
    }
    return user
}

const AuthContext = React.createContext<{
    user: User | null,
    register: (form: AuthForm) => Promise<void>,
    login: (form: AuthForm) => Promise<void>,
    logout: () => Promise<void>,
} | undefined>(undefined)

AuthContext.displayName = 'AuthContext'

export const AuthProvider = ({children}:{children:ReactNode}) => {
    //const [user, setUser] = useState<User | null>(null)
    const {data: user, error, isLoading, isIdle, isError, run, setData: setUser} = useAsync<User | null>()
    const queryClient = useQueryClient()

    const login = (form: AuthForm) => auth.login(form).then(setUser)  //then(setUser)  等价于  then(user=>setUser(user))
    const register = (form: AuthForm) => auth.register(form).then(setUser)
    const logout = () => auth.logout().then(() => {
        setUser(null)
        queryClient.clear()//登出时清除queryClient的缓存
    })

    useMount(()=>{
        run(bootstrapUser())
    })

    if(isIdle || isLoading){
        return <FullPageLoading/>
    }

    if(isError){
        return <FullPageErrorFallback error={error}/>
    }

    return <AuthContext.Provider children={children} value={{ user, login, register, logout }} />
}

export const useAuth = () => {
    const context = React.useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth必须在AuthProvider中使用')
    }
    return context
}