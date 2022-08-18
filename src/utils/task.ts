import { useQuery } from "react-query"
import { Task } from "types/Task"
import { useHttp } from "./http"

//查寻task列表的自定义钩子(useQuery版本)
export const useTasks = (param?: Partial<Task>) => {   
    //获取自定义的ajax请求hook
    const client=useHttp()
  
    //useQuery的第一个参数queryKey可以是元组类型，当元组里面的值变化的时候，useQuery会重新触发
    return useQuery<Task[],Error>( ['tasks', param] , () => client('tasks',{data:param}) )
  }