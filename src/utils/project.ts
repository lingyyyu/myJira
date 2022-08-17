import { useCallback, useEffect } from "react"
import { useQuery } from "react-query"
import { Project } from "screens/projectList/List"
import { cleanObject } from "utils"
import { useHttp } from "./http"
import { useAsync } from "./use-async"

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
export const useEditProject = () => {
  const {run, ...asyncResult} = useAsync()
  const client = useHttp()
  const mutate = (params: Partial<Project>) => {
    run(client(`projects/${params.id}`, {
      data: params,
      method: 'PATCH'
    }))
  }

  return {
    mutate,
    ...asyncResult
  }
}

//添加Project数据的自定义钩子
//注意参数不要直接传入，不然hook会无法在函数中调用。我们将在mutate中传入参数，使用时先将mutate解构出来,这样就可以在所有地方使用hook
export const useAddProject = () => {
  const {run, ...asyncResult} = useAsync()
  const client = useHttp()
  const mutate = (params: Partial<Project>) => {
    run(client(`projects/${params.id}`, {
      data: params,
      method: 'POST'
    }))
  }

  return {
    mutate,
    ...asyncResult
  }
}