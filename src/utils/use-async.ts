import { useCallback, useReducer, useState } from "react"
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

//确认组件是否还在挂载，确认仍然还在挂载后才进行useReducer的异步操作Dispatch
const useSafeDispatch = <T>(dispatch: (...args:T[])=>void) => {
    //使用监测组件的挂载状态的hook，防止在已经卸载了的组件上赋值
    const mountedRef = useMountedRef()
    return useCallback( (...args:T[])=>(mountedRef.current ? dispatch(...args) : void 0) ,[dispatch,mountedRef])
}

//自定义异步操作hook
export const useAsync = <D>(initialState?: State<D>, initialConfig?: typeof defaultConfig)=>{
    const config = {...defaultConfig, ...initialConfig}

    //用usereducer改写useAsync
    //实际上usereducer能实现的，usestate也能实现
    //useReducer适合管理多个之前会互相影响的状态
    //useState适合管理单个状态
    //action可以自定义。这里的action不是传统的action，而是相当于传过来的更新的setState的值。
    //这里的action利用了dispatch传过来的action会自动更新的原理，直接利用展开语法覆盖更新了state的属性
    const [state, dispatch] = useReducer( (state:State<D>,action:Partial<State<D>>)=>({...state , ...action}) ,{
        ...defaultInitialState,
        ...initialState
    })

    const safeDispatch = useSafeDispatch(dispatch)

    const [retry,setRetry] = useState( ()=> ()=>{} )

    const setData = useCallback( (data : D) => safeDispatch({
        data,
        stat: 'success',
        error: null,
    }), [safeDispatch])

    const setError = useCallback( (error:Error) => safeDispatch({
        error,
        stat: 'error',
        data: null,
    }) ,[safeDispatch])

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
        
        safeDispatch({stat:'loading'})

        return promise.then(data => {
            setData(data)
            return data //因为是promise，内部最好要有返回值
        }).catch(error => {
            setError(error)
            if(config.throwOnError) return Promise.reject(error)
            return error
        })
    }, [config.throwOnError, setData, setError, safeDispatch])//[]useCallback需要的依赖,实际上就是函数中不是用参数传进来的,是从其它地方传进来的变量或方法
    
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