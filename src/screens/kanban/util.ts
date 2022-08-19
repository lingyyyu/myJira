import { useMemo } from "react"
import { useLocation } from "react-router-dom"
import { useProject } from "utils/project"
import { useUrlQueryParam } from "utils/url"

export const useProjectIdInUrl = () => {
    const {pathname} = useLocation()
    //用正则表达式取出路由路径projects/id   中的id,用括号包裹住的部分会成为数组中的第二个参数
    const id=pathname.match(/projects\/(\d+)/)?.[1]
    return Number(id)
}

//返回当前projectid对应的project数据
export const useProjectInUrl = () => useProject(useProjectIdInUrl())

//返回当前kanban对应的project
export const useKanbanSearchParams = () => ({projectId: useProjectIdInUrl()})
//将当前kanban对应的projectid作为queryKey来区分存储
export const useKanbansQueryKey = () => ['kanbans', useKanbanSearchParams()]


export const useTasksSearchParams = () => {
    const [param, setParam] = useUrlQueryParam([
        'name',
        'typeId',
        'processorId',
        'tagId'
    ])
    //返回当前task对应的project
    const projectId = useProjectIdInUrl()
    return useMemo( () => ({
        projectId,
        typeId: Number(param.typeId) || undefined,
        processorId: Number(param.processorId) || undefined,
        tagId: Number(param.tagId) || undefined,
        name: param.name
    }) ,[projectId,param])
}
//将当前task对应的projectid作为queryKey来区分存储
export const useTasksQueryKey = () => ['tasks', useTasksSearchParams()]