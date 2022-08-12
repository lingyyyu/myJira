import { useCallback, useState } from "react"
import { useMountedRef } from "utils"

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

    //使用监测组件的挂载状态的hook，防止在已经卸载了的组件上赋值
    const mountedRef = useMountedRef()

    const [retry,setRetry] = useState( ()=> ()=>{} )

    const setData = useCallback( (data : D) => setState({
        data,
        stat: 'success',
        error: null,
    }), [])

    const setError = useCallback( (error:Error) => setState({
        error,
        stat: 'error',
        data: null,
    }) ,[])

    //run用来触发异步请求
    //使用useCallback优化异步请求
    const run =useCallback( (promise: Promise<D>, runConfig?: {retry: () => Promise<D>}) => {
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
        //这里使用setState的函数用法，可以避免在useCallback中添加state依赖，从而造成无限循环
        setState(prevState => ({...prevState,stat:'loading'}))

        return promise.then(data => {
            if(mountedRef.current)//防止在已经卸载了的组件上赋值
                setData(data)
            return data //因为是promise，内部最好要有返回值
        }).catch(error => {
            setError(error)
            if(config.throwOnError) return Promise.reject(error)
            return error
        })
    }, [config.throwOnError, mountedRef, setData, setError])//[]useCallback需要的依赖,实际上就是函数中不是用参数传进来的,是从其它地方传进来的变量或方法
    
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