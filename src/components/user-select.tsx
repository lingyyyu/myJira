import React from 'react'
import { useUsers } from 'utils/user'
import IdSelect from './id-select'

//负责人的选择栏
//接收IdSelect的其余参数
export default function UserSelect(props:React.ComponentProps<typeof IdSelect>) {
    //将data取别名为users
    const{data : users}=useUsers()

  return (
    <IdSelect options={users || []} {...props} />
  )
}
