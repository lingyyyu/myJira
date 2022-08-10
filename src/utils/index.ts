import { useEffect, useRef, useState } from "react"

export const isFalsy = (value: unknown) => value === 0 ? false : !value

export const isVoid = (value: unknown) => value === undefined || value === null || value === ''

//判断传入的对象是否有键值为空，为空则删除
//如果参数直接传入object:object，ts会直接将object识别成null。所以类型要用{[key : string]: unknown}键值对取代object
export const cleanObject = (object: {[key : string]: unknown}) => {
    const result = { ...object }
    Object.keys(result).map((key) => {
        const value = result[key]
        if (isVoid(value)) {
            delete result[key]
        }
    })
    return result
}

//模拟DidMount的customHook,customHook一定要以use开头
export const useMount = (callback: () => void) => {
    useEffect(() => {
        callback()
    }, [])
}

//实现延时刷新的效果的hook
export const useDebounce = <V>(value: V, delay?: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        //每次在value值变化以后，设置一个定时器
        const timeout = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)
        //每次在上一次useEffect处理完后运行。或者当你再次触发useEffect时，会执行上一次useEffect里return的函数
        return () => { clearTimeout(timeout) }
    }, [value, delay])

    return debouncedValue
}



interface useArrayReturn<T> {
    value: Array<T>
    add: (item: T) => void
    removeIndex: (index: number) => void
    clear: () => void
}
//实现数组api的钩子
export const useArray = <T>(objArr: T[]): useArrayReturn<T> => {
    const [value, setValue] = useState(objArr)
    const add = (item: T) => {
        setValue([...value, item])
    }
    const removeIndex = (index: number) => {
        const copy = [...value]
        copy.splice(index, 1)
        setValue(copy)
    }
    const clear = () => { setValue([]) }
    return {
        value,
        add,
        removeIndex,
        clear
    }
}

//自定义改变标题的hook
export const useDocumentTitle = (title: string , keepOnUnmount:boolean = true) => {
    //useRef
    //返回一个可变的 ref 对象，该对象只有个 current 属性，初始值为传入的参数( initialValue )
    //当更新 current 值时并不会 re-render ，这是与 useState 不同的地方
    //返回的 ref 对象在组件的整个生命周期内保持不变
    const oldTitle = useRef(document.title).current
    
    useEffect(()=>{
        document.title=title
    },[title])

    //页面卸载时退回旧title
    useEffect(()=>{
        return ()=>{
            if(!keepOnUnmount){
                document.title = oldTitle
            }
        }
    },[keepOnUnmount, oldTitle])
}

//重置路由的方法
export const resetRoute = () => window.location.href = window.location.origin