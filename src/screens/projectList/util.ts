import { useMemo } from "react"
import { useUrlQueryParam } from "utils/url"

export function useProjectsSearchParams(){
    const [param, setParam] = useUrlQueryParam(['name','personId'])

    return [
        //这里虽然param已经经过了useMemo，但返回时又创造出了新的对象，还需要对新的对象useMemo
        //{...param, personId: Number(param.personId) || undefined},
        useMemo(() => ({...param, personId: Number(param.personId) || undefined}), [param]),
        setParam
    ]as const
} 