import { Table, TableProps } from 'antd'
import React from 'react'
import { User } from './SearchPanel'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'

export interface Project {
  id: string,
  name: string,
  personId: string,
  pin: string,
  organization: string,
  created: number,
}

//TableProps是antd提供的组件Table所需的所有参数的集合
interface Listprops extends TableProps<Project>{
  users: User[],
}
export default function List({users , ...props}: Listprops) {

  return <Table rowKey={"id"} pagination={false} columns={[
    {
      title:'名称',
      //dataIndex:'name',   //dataIndex表示去对应的project中读取对应的name属性
      sorter:(a,b)=>a.name.localeCompare(b.name),  //排序
      render(value,project){
        return <Link to={ String(project.id) }>{project.name}</Link>
      }
    },
    {
      title:'部门',
      dataIndex:'organization',
    },
    {
      title:'负责人',
      render(value,project){
        return <span>
          {users.find((user:User)=> user.id===project.personId)?.name || '未知'}
        </span>
      }
    },
    {
      title: '创建时间',
      render(value,project){
        return <span>
          {
            //使用库dayjs处理时间
            project.created ? dayjs(project.created).format('YYYY-MM-DD'): '无'
          }
        </span>
      }
    }
  ]} 
  {...props}//将props所存储的TableProps参数展开
  />


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
