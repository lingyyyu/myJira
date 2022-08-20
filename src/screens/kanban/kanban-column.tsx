import { Kanban } from "types/Kanban";
import { useTasks } from "utils/task";
import { useTaskTypes } from "utils/task-type";
import { useKanbansQueryKey, useTasksModal, useTasksSearchParams } from "./util";
import taskIcon from 'assets/task.svg'
import bugIcon from 'assets/bug.svg'
import styled from "@emotion/styled";
import { Button, Card, Dropdown, Menu, Modal } from "antd";
import CreateTask from "./create-task";
import { Task } from "types/Task";
import Mark from "components/mark";
import { Row } from "components/lib";
import { useDeleteKanban } from "utils/kanban";
import React from "react";
import Drop, { Drag, DropChild } from "components/drag-and-drop";

//根据任务类型显示图标（任务||bug）
const TaskTypeIcon = ({id}: {id: number}) => {
    //获取所有任务类型
    const {data: taskTypes} = useTaskTypes()
    const name = taskTypes?.find((taskType) => taskType.id===id)?.name
    if(!name) {
        return null
    }
    return <img alt="task-icon" src={name === 'task' ? taskIcon : bugIcon} style={{width:'1.6rem'}}/>
}

const TaskCard = ({task}: {task: Task}) => {
    //通过调用useTasksModal的hook来改变editingTaskId，实现模态框的显示和隐藏
    const {startEdit} = useTasksModal()
    const {name: keyword} = useTasksSearchParams()
    //点击时生成对应模态框的editingTaskId
    return <Card onClick={() => startEdit(task.id)} style={{marginBottom:'0.5rem', cursor:'pointer'}} key={task.id}> 
        <p>
            <Mark keyword={keyword} name={task.name}/>
        </p>
        <TaskTypeIcon id={task.typeId}/>
    </Card>
}


//渲染每个看板对应的任务
export const KanbanColumn = React.forwardRef<HTMLDivElement, {kanban:Kanban}>( ({kanban, ...props}, ref) => {
    const {data: allTasks} = useTasks(useTasksSearchParams())
    const tasks = allTasks?.filter(task => task.kanbanId === kanban.id)
    
    return <Container {...props} ref={ref}>
        <Row between={true}>
            <h3>{kanban.name}</h3>
            <More kanban={kanban} key={kanban.id}/>
        </Row>
        <TasksContainer>
            <Drop type="ROW" direction="vertical" droppableId={String(kanban.id)}>
                <DropChild>
                {
                    tasks?.map( (task,taskIndex) => (
                        <Drag key={task.id} index={taskIndex} draggableId={'task'+task.id}>
                            <div>
                                <TaskCard key={task.id} task={task}/>
                            </div>
                        </Drag>
                    ))
                }
                </DropChild>
            </Drop>
            <CreateTask kanbanId={kanban.id}/>
        </TasksContainer>
    </Container>
} )

//删除看板的方法
const More = ({kanban}: {kanban: Kanban}) => {
    const {mutateAsync} = useDeleteKanban(useKanbansQueryKey())
    const startEdit = () => {
        //Modal是对话框
        Modal.confirm({
            okText:'确定',
            cancelText:'取消',
            title:'确定删除看板吗',
            onOk(){
                //由于用了异步方法，所以要返回出来
                return mutateAsync({id: kanban.id})
            }
        })
    }
    //下拉菜单
    const overlay = <Menu>
        <Menu.Item>
            <Button type="link" onClick={startEdit}>删除</Button>
        </Menu.Item>
    </Menu>
    return <Dropdown overlay={overlay}>
        <Button type="link">...</Button>
    </Dropdown>
}


export const Container = styled.div`
min-width: 27rem;
border-radius: 6px;
background-color: rgb(244,245,247);
display: flex;
flex-direction: column;
padding: 0.7rem 0.7rem 1rem;
margin-right: 1.5rem;
`

const TasksContainer = styled.div`
overflow: scroll;
flex: 1;
::-webkit-scrollbar{
    display: none;
}
`