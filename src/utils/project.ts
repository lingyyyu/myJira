import { useEffect } from "react"
import { Project } from "screens/projectList/List"
import { cleanObject } from "utils"
import { useHttp } from "./http"
import { useAsync } from "./use-async"

export const useProjects = (param?: Partial<Project>) => {
    //使用自定义hook来取代list，isLoading，error这些state
  const {run, ...result}=useAsync<Project[]>()
    //获取自定义的ajax请求hook
  const client=useHttp()

  useEffect(() => {
    //自定义hook，useAsync中的run方法
    //使用自定义hook,client发送ajax请求
    run( client('projects',{data: cleanObject(param || {})}) )

  }, [param])
  
  return result
}