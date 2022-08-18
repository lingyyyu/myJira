import { QueryKey, useQueryClient } from "react-query";

//生成react-Query的第三个参数的配置（自动刷新以及乐观更新）
//增删改查具有共同代码，只有在 return callback(target, old) 处具有不同
export const useConfig = (queryKey: QueryKey, callback: (target: any, old?: any[]) => any[] ) => {
    const queryClient= useQueryClient()
    return {
        //成功后刷新projects查询结果         queryClient.invalidateQueries 使得匹配的查询失效并重新获取
      onSuccess: () => queryClient.invalidateQueries(queryKey),

      //实现乐观更新的代码onMutate，onError
      async onMutate(target: any){    
        const previousItems = queryClient.getQueryData(queryKey) //通过queryKey获取缓存的数据
        //更新query缓存
        queryClient.setQueryData(queryKey, (old?: any[]) => {
            //找到对应的数据项后执行传入的回调函数操作
            return callback(target, old)
        })
        return {previousItems}
      },
      //乐观更新的错误回滚机制
      onError(err: any, newItem: any, context: any){
        queryClient.setQueryData(queryKey, context.previousItems)
      }
    }
}

export const useDeleteConfig = (queryKey: QueryKey) => useConfig(queryKey, (target, old) => old?.filter(item => item.id !== target.id) || [])

export const useEditConfig = (queryKey: QueryKey) => useConfig(queryKey, (target, old) => old?.map(item => item.id === target.id ? {...item, ...target} : item) || [])

export const useAddConfig = (queryKey: QueryKey) => useConfig(queryKey, (target, old) => old ? [...old, target] : [])