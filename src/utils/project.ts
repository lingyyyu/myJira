import { useCallback, useEffect } from "react"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { Project } from "screens/projectList/List"
import { useProjectsSearchParams } from "screens/projectList/util"
import { cleanObject } from "utils"
import { useHttp } from "./http"
import { useAsync } from "./use-async"

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
export const useEditProject = () => {
  const client = useHttp()
  const queryClient = useQueryClient()
  const [searchParams] = useProjectsSearchParams()
  const queryKey = ['projects',searchParams] //存储的queryKey本身就是一个元组
  
  //useMutation第一个参数是回调函数，第二个参数主要用来控制成功之后的操作
  return useMutation( (params: Partial<Project>) => client(`projects/${params.id}` , {
      method:'PATCH',
      data:params
    }),{
      //成功后刷新projects查询结果         queryClient.invalidateQueries 使得匹配的查询失效并重新获取
      onSuccess: () => queryClient.invalidateQueries(queryKey),

      //实现乐观更新的代码onMutate，onError（比较复杂，可以不写）
      async onMutate(target){    
        const previousItems = queryClient.getQueryData(queryKey) //通过queryKey获取缓存的数据
        //更新query缓存
        queryClient.setQueryData(queryKey, (old?: Project[]) => {
          //找到对应的project后覆盖数据
          return old?.map(project => project.id === target.id ? {...project , ...target} : project ) || []
        })
        return {previousItems}
      },
      //乐观更新的错误回滚机制
      onError(err, newItem, context){
        queryClient.setQueryData(queryKey, (context as { previousItems:Project[] }).previousItems)
      }
      
    }
  )
}


//添加Project数据的自定义钩子
export const useAddProject = () => {
  const client = useHttp()
  const queryClient = useQueryClient()

  return useMutation( (params: Partial<Project>) => 
    client(`projects`, {
      data: params,
      method: 'POST'
    }), {
      onSuccess: () => queryClient.invalidateQueries('projects')
    }
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