import { useState } from "react"

interface State<D>{
    error: Error | null,
    data: D | null,
    stat: 'idle' | 'loading' | 'error' | 'success'
}

const defaultInitialState: State<null> ={
    stat:'idle',
    data:null,
    error:null
}

const defaultConfig = {
    throwOnError: false
}

//自定义异步操作hook
export const useAsync = <D>(initialState?: State<D>, initialConfig?: typeof defaultConfig)=>{
    const config = {...defaultConfig, ...initialConfig}
    const [state, setState] = useState<State<D>>({
        ...defaultInitialState,
        ...initialState
    })
    const [retry,setRetry] = useState( ()=> ()=>{} )

    const setData = (data : D) => setState({
        data,
        stat: 'success',
        error: null,
    })

    const setError = (error:Error) => setState({
        error,
        stat: 'error',
        data: null,
    })

    //run用来触发异步请求
    const run = (promise: Promise<D>, runConfig?: {retry: () => Promise<D>}) => {
        //没有.then方法就代表不是promise
        if(!promise || !promise.then){
            throw new Error('请传入 Promise 类型数据')
        }
        //调用retry时会重新跑一遍run，让state状态刷新
        //注意必须用高阶函数存储函数，不然会无限循环
        setRetry( ()=> ()=> {
            if(runConfig?.retry){
                run(runConfig?.retry(), runConfig)
            }
        } )

        setState({...state,stat:'loading'})
        return promise.then(data => {
            setData(data)
            return data //因为是promise，内部最好要有返回值
        }).catch(error => {
            setError(error)
            if(config.throwOnError) return Promise.reject(error)
            return error
        })
    }

    
    
    
    return{
        isIdle: state.stat === 'idle',
        isLoading: state.stat === 'loading',
        isError: state.stat === 'error',
        isSuccess: state.stat === 'success',
        run,
        setData,
        setError,
        retry,
        ...state
    }
}