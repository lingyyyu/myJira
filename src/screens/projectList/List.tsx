import { Dropdown, Menu, Modal, Table, TableProps } from 'antd'
import React from 'react'
import { User } from "../../types/User"
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'
import { Pin } from 'components/pin'
import { useDeleteProject, useEditProject } from 'utils/project'
import { ButtonNoPadding } from 'components/lib'
import { useProjectModal, useProjectsQueryKey } from './util'
import { Project } from '../../types/Project'

//TableProps是antd提供的组件Table所需的所有参数的集合
interface Listprops extends TableProps<Project>{
  users: User[],
  refresh?: ()=> void,
}
export default function List({users , ...props}: Listprops) {

  //使用编辑Project数据的自定义钩子
  const {mutate} = useEditProject( useProjectsQueryKey() )

  const pinProject = (id:number) => (pin:boolean) => mutate({id,pin})



  return <Table rowKey={"id"} pagination={false} columns={[
    {
      //星星
      //渲染标题星星
      title: <Pin checked={true} disabled={true}/>,
      //渲染每个选项的星星
      render(value, project){
        return <Pin checked={project.pin} onCheckedChange={ async (pin) => {
          //调用修改project的自定义hook
          await mutate({id:project.id, pin})
          if(props?.refresh)
          {
            //调用传过来的刷新页面的方法
            props.refresh()
          }
        } }/>
      }
    },
    {
      title:'名称',
      //dataIndex:'name',   //dataIndex表示去对应的project中读取对应的name属性
      sorter:(a,b)=>a.name.localeCompare(b.name),  //排序
      render(value,project){
        return (
          //加上 / 表示绝对路径，不加 / 表示从当前路由开始的相对路径。下面2种写法都行
          //<Link to={String(project.id)}>{project.name}</Link>
          <Link to={`/projects/${String(project.id)}`}>{project.name}</Link>
        )
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
    },
    {
      render(value, project){
        return <More project={project}/>
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

const More = ({project} : {project: Project}) => {
  const {startEdit} = useProjectModal()
  const editProject = (id:number) => () => startEdit(id)
  const {mutate: deleteProject} = useDeleteProject(useProjectsQueryKey())
  
  const confirmDeleteProject = (id: number) => {
    //Modal前缀代表antd中的confirm
    Modal.confirm({
      title:'确定删除这个项目吗？',
      content: '点击确定删除',
      okText: '确定',
      onOk(){
        deleteProject({id})
      }
    })
  }

  return <Dropdown overlay={<Menu>
    <Menu.Item onClick={editProject(project.id)} key={'edit'}>
      编辑
    </Menu.Item>
    <Menu.Item onClick={ () => confirmDeleteProject(project.id) } key={'delete'}>
      删除
    </Menu.Item>
  </Menu>}>
    <ButtonNoPadding type='link'>...</ButtonNoPadding>
  </Dropdown>
}
