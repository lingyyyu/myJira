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

//控制ProjectModal开关的hook，使用param来进行控制，但注意由于用到了url param，整个被控制的内容必须包裹在<BrowserRouter>路由组件中
export const useProjectModal = () => {
    const [{projectCreate}, setProjectCreate] = useUrlQueryParam(['projectCreate'])

    const open = () => setProjectCreate({projectCreate: true})
    const close = () => setProjectCreate({projectCreate: undefined})

    return{
        projectModalOpen: projectCreate === 'true',//url中的数据都是字符串
        open,
        close
     }
}