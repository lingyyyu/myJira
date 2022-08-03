import { useEffect, useState } from "react"

export const isFalsy = (value) => value === 0 ? false : !value

//判断传入的对象是否有键值为空，为空则删除
export const cleanObject = (object) => {
    const result = { ...object }
    Object.keys(result).map((key) => {
        const value = result[key]
        if (isFalsy(value)) {
            delete result[key]
        }
    })
    return result
}

//模拟DidMount的customHook,customHook一定要以use开头
export const useMount = (callback) => {
    useEffect(() => {
        callback()
    }, [])
}

//实现延时刷新的效果的hook
export const useDebounce = (value, delay) => {
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