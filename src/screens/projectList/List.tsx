import { Table } from 'antd'
import React from 'react'
import { User } from './SearchPanel'

interface Project {
  id: string,
  name: string,
  personId: string,
  pin: string,
  organization: string,
}
interface Listprops {
  list: Project[],
  users: User[],
}
export default function List(props: Listprops) {
  const { list, users } = props

  return <Table pagination={false} columns={[
    {
      title:'名称',
      dataIndex:'name',   //dataIndex表示去对应的project中读取对应的name属性
      sorter:(a,b)=>a.name.localeCompare(b.name)  //排序
    },
    {
      title:'负责人',
      render(value,project){
        return <span>
          {users.find((user:User)=> user.id===project.personId)?.name || '未知'}
        </span>
      }
    }
  ]} dataSource={list}/>
  //dataSource是数据源


  // return (
  //   <table>
  //     <thead>
  //       <tr>
  //         <th>名称</th>
  //         <th>负责人</th>
  //       </tr>
  //     </thead>
  //     <tbody>
  //       {
  //         list.map((project) => <tr key={project.id}>
  //           <td>{project.name}</td>
  //           <td>{users.find(user => user.id === project.personId)?.name || '未知'}</td>
  //         </tr>)
  //       }
  //     </tbody>
  //   </table>
  // )
}
