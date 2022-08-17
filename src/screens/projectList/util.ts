import { useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { useProject } from "utils/project"
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
    const [{editingProjectId}, setEditingProjectId] = useUrlQueryParam(['editingProjectId'])
    const {data: editingProject, isLoading} = useProject(Number(editingProjectId))//这里的isLoading是query自带的返回值

    const [_,setUrlParams] = useSearchParams()

    const open = () => setProjectCreate({projectCreate: true})
    const close = () => {
        //这两个只能执行一个，不能两个一起执行
        projectCreate ? setProjectCreate({projectCreate: undefined}) : setEditingProjectId({editingProjectId: undefined})
        //另一种方法
        //setUrlParams({projectCreate:'',editingProjectId:''})
    }
    const startEdit = (id:number) => setEditingProjectId({editingProjectId: id})

    return{
        projectModalOpen: projectCreate === 'true' || Boolean(editingProject),//url中的数据都是字符串
        open,
        close,
        startEdit,
        editingProject,
        isLoading
     }
}