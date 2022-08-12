import { useCallback, useEffect } from "react"
import { Project } from "screens/projectList/List"
import { cleanObject } from "utils"
import { useHttp } from "./http"
import { useAsync } from "./use-async"

//查寻Projects数据的自定义钩子
export const useProjects = (param?: Partial<Project>) => {
    //使用自定义hook来取代list，isLoading，error这些state
  const {run, ...result}=useAsync<Project[]>()
    //获取自定义的ajax请求hook
  const client=useHttp()

  const fetchProjects = useCallback( () => client('projects',{data: cleanObject(param || {})}) , [param,client])
  
  useEffect(() => {
    //自定义hook，useAsync中的run方法
    //使用自定义hook,client发送ajax请求
    run( fetchProjects(),{
      retry: fetchProjects
    })

  }, [param, run, fetchProjects])
  
  return result
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