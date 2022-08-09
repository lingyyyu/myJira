import { useEffect } from "react";
import { User } from "screens/projectList/SearchPanel";
import { cleanObject } from "utils";
import { useHttp } from "./http";
import { useAsync } from "./use-async";

export const useUsers = (param?: Partial<User>) => {
    const {run, ...result}=useAsync<User[]>()
    //获取自定义的ajax请求hook
  const client=useHttp()

  useEffect(() => {
    //自定义hook，useAsync中的run方法
    //使用自定义hook,client发送ajax请求
    run( client('users',{data: cleanObject(param || {})}) )
  }, [param])
  
  return result
}