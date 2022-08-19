import { QueryKey, useMutation, useQuery } from "react-query"
import { Task } from "types/Task"
import { useDebounce } from "utils"
import { useHttp } from "./http"
import { useDeleteConfig, useEditConfig, useAddConfig } from "./use-optimistic-options"

//查寻task列表的自定义钩子(useQuery版本)
export const useTasks = (param?: Partial<Task>) => {   
    //获取自定义的ajax请求hook
    const client=useHttp()
    //使用useDebounce来限制输入查询频率
    const debouncedParam = {...param, name: useDebounce(param?.name, 200)}
  
    //useQuery的第一个参数queryKey可以是元组类型，当元组里面的值变化的时候，useQuery会重新触发
    return useQuery<Task[],Error>( ['tasks', debouncedParam] , () => client('tasks',{data:debouncedParam}) )
}

export const useTask = (id?:number) => {
  const client = useHttp()
  return useQuery<Task>(
    ['task',{id}],
    () => client(`tasks/${id}`),
    {
      //useQuery的第三个参数是配置参数，这里意思是只有当id有值时才触发useQuery
      enabled: Boolean(id)
    }
  )
}

export const useEditTask = (queryKey:QueryKey) => {
  const client = useHttp()
  return useMutation(
    (params: Partial<Task>) => 
      client(`tasks/${params.id}`, {
        method: 'PATCH',
        data: params,
      }),
    useEditConfig(queryKey)
  )
}

export const useAddTask = (queryKey: QueryKey) => {
  const client = useHttp()

  return useMutation( (params: Partial<Task>) => 
    client(`tasks`, {
      data: params,
      method: 'POST'
    }), 
    useAddConfig(queryKey)
  )
}

export const useDeleteTask = (queryKey: QueryKey) => {
  const client = useHttp()

  return useMutation( ({id}: {id:number}) => 
    client(`tasks/${id}`, {
      method: 'DELETE'
    }), 
    useDeleteConfig(queryKey)
  )
}