import { useQuery } from "react-query"
import { Kanban } from "types/Kanban"
import { useHttp } from "./http"
import { QueryKey, useMutation } from 'react-query'
import { useEditConfig, useAddConfig, useDeleteConfig, useReorderKanbanConfig} from "utils/use-optimistic-options"

//查寻kanban列表的自定义钩子(useQuery版本)
export const useKanbans = (param?: Partial<Kanban>) => {   
    //获取自定义的ajax请求hook
    const client=useHttp()
  
    //useQuery的第一个参数queryKey可以是元组类型，当元组里面的值变化的时候，useQuery会重新触发
    return useQuery<Kanban[],Error>( ['kanbans', param] , () => client('kanbans',{data:param}) )
}

export const useAddKanban = (queryKey: QueryKey) => {
  const client = useHttp()

  return useMutation( (params: Partial<Kanban>) => 
    client(`kanbans`, {
      data: params,
      method: 'POST'
    }), 
    useAddConfig(queryKey)
  )

}

export const useDeleteKanban = (queryKey: QueryKey) => {
  const client = useHttp()

  return useMutation( ({id}: {id:number}) => 
    client(`kanbans/${id}`, {
      method: 'DELETE'
    }), 
    useDeleteConfig(queryKey)
  )
}

export interface SortProps {
  //要重新排序的item
  fromId: number,
  //目标item
  referenceId: number,
  //放在目标item的前还是后
  type: 'before'|'after',
  fromKanbanId?: number,
  toKanbanId?: number
}
//持久化拖拽内容
export const useReorderKanban = (queryKey: QueryKey) => {
  const client = useHttp()
  return useMutation(
    (params: SortProps) => {
      return client('kanbans/reorder' , {
        data: params,
        method: 'POST'
      })
    },
    //乐观更新
    useReorderKanbanConfig(queryKey)
  )
}