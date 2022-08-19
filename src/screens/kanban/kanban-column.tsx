import { Kanban } from "types/Kanban";
import { useTasks } from "utils/task";
import { useTaskTypes } from "utils/task-type";
import { useTasksSearchParams } from "./util";
import taskIcon from 'assets/task.svg'
import bugIcon from 'assets/bug.svg'
import styled from "@emotion/styled";
import { Card } from "antd";
import CreateTask from "./create-task";

//根据任务类型显示图标（任务||bug）
const TaskTypeIcon = ({id}: {id: number}) => {
    //获取所有任务类型
    const {data: taskTypes} = useTaskTypes()
    const name = taskTypes?.find((taskType) => taskType.id===id)?.name
    if(!name) {
        return null
    }
    return <img src={name === 'task' ? taskIcon : bugIcon} style={{width:'1.6rem'}}/>
}


//渲染每个看板对应的任务
export const KanbanColumn = ({kanban}: {kanban:Kanban}) => {
    const {data: allTasks} = useTasks(useTasksSearchParams())
    const tasks = allTasks?.filter(task => task.kanbanId === kanban.id)
    return <Container>
        <h3>{kanban.name}</h3>
        <TasksContainer>
        {
            tasks?.map(task => (<Card style={{marginBottom:'0.5rem'}} key={task.id}>
                <div>{task.name}</div> 
                <TaskTypeIcon id={task.typeId}/>
            </Card>))
        }
            <CreateTask kanbanId={kanban.id}/>
        </TasksContainer>
    </Container>
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