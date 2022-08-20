import styled from '@emotion/styled'
import { Spin } from 'antd'
import Drop, { Drag, DropChild } from 'components/drag-and-drop'
import { ScreenContainer } from 'components/lib'
import React, { useCallback } from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { useDocumentTitle } from 'utils'
import { useKanbans, useReorderKanban } from 'utils/kanban'
import { useReorderTask, useTasks } from 'utils/task'
import CreateKanban from './create-kanban'
import { KanbanColumn } from './kanban-column'
import { SearchPanel } from './search-panel'
import TaskModal from './task-modal'
import { useKanbanSearchParams, useKanbansQueryKey, useProjectInUrl, useTasksQueryKey, useTasksSearchParams } from './util'

//渲染看板
export default function Kanban() {
  useDocumentTitle('看板列表')

  const {data: currentProject} = useProjectInUrl()
  const {data: kanbans, isLoading: kanbanIsLoading} = useKanbans(useKanbanSearchParams())
  const {isLoading: taskIsLoading} = useTasks(useTasksSearchParams())
  const isLoading = taskIsLoading || kanbanIsLoading

  const onDragEnd = useDragEnd()
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <ScreenContainer>
        <h1>{currentProject?.name}看板</h1>
        <SearchPanel/>
        {
          isLoading ? <Spin size='large'/> :  (
            <ColumnsContainer>
              {/* 用Drop包裹住需要拖拽的地方
              类型：列，方向：水平，droppableId：可以随意命名 */}
              <Drop type='COLUMN' direction='horizontal' droppableId='kanban'>
                <DropChild style={{display:'flex'}}>
                {
                  kanbans?.map( (kanban,index) => (
                    <Drag key={kanban.id} draggableId={'kanban'+ kanban.id} index={index}>
                      <KanbanColumn kanban={kanban} key={kanban.id}/>
                    </Drag>
                  ))
                }
                </DropChild>
              </Drop>
              <CreateKanban/>
            </ColumnsContainer>
          )
        }
        <TaskModal/>
      </ScreenContainer>
    </DragDropContext>
  )
}

//拖拽完毕后调用的钩子(将拖拽后的顺序存入数据库)
export const useDragEnd = () => {
  const {data:kanbans} = useKanbans(useKanbanSearchParams())
  const {mutate: reorderKanban} = useReorderKanban(useKanbansQueryKey())
  const {mutate: reorderTask} = useReorderTask(useTasksQueryKey())
  const {data: allTasks=[] } = useTasks(useTasksSearchParams())
  return useCallback( ({source, destination, type}: DropResult) => {
    if(!destination){
      return
    }
    //拖拽看板
    if (type === 'COLUMN'){
      const fromId = kanbans?.[source.index].id
      const toId = kanbans?.[destination.index].id
      if(!fromId || !toId || fromId === toId){
        return
      }
      //目标的下标大于原始下标时放目标后面，否则放目标前面
      const type = destination.index > source.index ? 'after' : 'before'
      reorderKanban({fromId, referenceId:toId ,type})
    }
    //拖拽任务
    if(type === 'ROW'){
      const fromKanbanId = +source.droppableId
      const toKanbanId = +destination.droppableId
      const fromTask = allTasks?.filter(task => task.kanbanId === fromKanbanId)[source.index]
      const toTask = allTasks.filter(task => task.kanbanId === toKanbanId)[destination.index]
      if(fromTask?.id === toTask?.id){
        return
      }
      reorderTask({
        fromId: fromTask?.id,
        referenceId: toTask?.id,
        fromKanbanId,
        toKanbanId,
        type: fromKanbanId === toKanbanId && destination.index > source.index ? 'after' : 'before'
      })
    }
  } , [kanbans, reorderKanban , allTasks, reorderTask])
}

export const ColumnsContainer = styled('div')`
  display: flex;
  overflow-x: scroll;
  flex: 1;
`
