import { useQuery } from "react-query"
import { TaskType } from "types/task-type"
import { useHttp } from "./http"

//查寻task-type列表的自定义钩子(useQuery版本)
export const useTaskTypes = () => {   
    //获取自定义的ajax请求hook
    const client=useHttp()
  
    //useQuery的第一个参数queryKey可以是元组类型，当元组里面的值变化的时候，useQuery会重新触发
    return useQuery<TaskType[],Error>( ['taskTypes'] , () => client('taskTypes') )
  }