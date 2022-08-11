import { useMemo } from "react"
import { URLSearchParamsInit, useSearchParams } from "react-router-dom"
import { cleanObject } from "utils"


//返回页面url中，指定键的参数值
export const useUrlQueryParam = <K extends string>(keys:K[]) => {
    //解构名字可自定
    const [searchParams, setSearchParam] = useSearchParams()
    return [
        //用useMemo解决重复渲染
        useMemo(() => keys.reduce( (prev,key) => {
                //.get(name)获取键为name的param参数
                return {...prev, [key]: searchParams.get(key) || ''}
            } , {} as {[key in K] : string}),
            [searchParams]
        ),
        //setSearchParam
        (params: Partial<{[key in K] : unknown}>) => {
            //Object.fromEntries与Object.entries正好相反。Object.entries是转对象为数组，Object.fromEntries是转数组为对象
            const o = cleanObject({...Object.fromEntries(searchParams), ...params}) as URLSearchParamsInit
            return setSearchParam(o)
        }
    ]as const
    //ts   as const能将返回类型规定成原始对象
}