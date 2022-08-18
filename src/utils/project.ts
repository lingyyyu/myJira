import { useCallback, useEffect } from "react"
import { QueryKey, useMutation, useQuery, useQueryClient } from "react-query"
import { Project } from "types/Project"
import { useProjectsSearchParams } from "screens/projectList/util"
import { cleanObject } from "utils"
import { useHttp } from "./http"
import { useAsync } from "./use-async"
import { useEditConfig, useAddConfig, useDeleteConfig} from "./use-optimistic-options"

//react-query中，get请求用useQuery，其它请求用useMutation



//查寻Projects数据的自定义钩子(useAsync版本)
// export const useProjects = (param?: Partial<Project>) => {   
//   //获取自定义的ajax请求hook
//   const client=useHttp()

//   //使用自定义hook来取代list，isLoading，error这些state
//   const {run, ...result}=useAsync<Project[]>()
  
//   const fetchProjects = useCallback( () => client('projects',{data: cleanObject(param || {})}) , [param,client])
  
//   useEffect(() => {
//     //自定义hook，useAsync中的run方法
//     //使用自定义hook,client发送ajax请求
//     run( fetchProjects(),{
//       retry: fetchProjects
//     })

//   }, [param, run, fetchProjects])
  
//   return result
// }

//查寻Projects数据的自定义钩子(useQuery版本)
export const useProjects = (param?: Partial<Project>) => {   
  //获取自定义的ajax请求hook
  const client=useHttp()

  //useQuery的第一个参数可以是元组类型，当元组里面的值变化的时候，useQuery会重新触发
  return useQuery<Project[],Error>( ['projects', param] , () => client('projects',{data:param}) )
}


//编辑Project数据的自定义钩子
//注意参数不要直接传入，不然hook会无法在函数中调用。我们将在mutate中传入参数，使用时先将mutate解构出来,这样就可以在所有地方使用hook
// export const useEditProject = () => {
//   const {run, ...asyncResult} = useAsync()
//   const client = useHttp()
//   const mutate = (params: Partial<Project>) => {
//     run(client(`projects/${params.id}`, {
//       data: params,
//       method: 'PATCH'
//     }))
//   }

//   return {
//     mutate,
//     ...asyncResult
//   }
// }

//useMutation版本
//QueryKey从外部传入，这样更有通用性
export const useEditProject = (queryKey: QueryKey) => {
  const client = useHttp()
  
  //useMutation第一个参数是回调函数，第二个参数主要用来控制成功之后的操作
  return useMutation( (params: Partial<Project>) => client(`projects/${params.id}` , {
      method:'PATCH',
      data:params
    }),
    useEditConfig(queryKey)
  )
}


//添加Project数据的自定义钩子
export const useAddProject = (queryKey: QueryKey) => {
  const client = useHttp()

  return useMutation( (params: Partial<Project>) => 
    client(`projects`, {
      data: params,
      method: 'POST'
    }), 
    useAddConfig(queryKey)
  )

}


//删除Project数据的自定义钩子
export const useDeleteProject = (queryKey: QueryKey) => {
  const client = useHttp()

  return useMutation( ({id}: {id:number}) => 
    client(`projects/${id}`, {
      method: 'DELETE'
    }), 
    useDeleteConfig(queryKey)
  )
}

//查询单个project项数据
export const useProject = (id?:number) => {
  const client = useHttp()
  return useQuery<Project>(
    ['project',{id}],
    () => client(`projects/${id}`),
    {
      //useQuery的第三个参数是配置参数，这里意思是只有当id有值时才触发useQuery
      enabled: Boolean(id)
    }
  )
}