import styled from '@emotion/styled'
import { Spin } from 'antd'
import Drop, { Drag, DropChild } from 'components/drag-and-drop'
import { ScreenContainer } from 'components/lib'
import React from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import { useDocumentTitle } from 'utils'
import { useKanbans } from 'utils/kanban'
import { useTasks } from 'utils/task'
import CreateKanban from './create-kanban'
import { KanbanColumn } from './kanban-column'
import { SearchPanel } from './search-panel'
import TaskModal from './task-modal'
import { useKanbanSearchParams, useProjectInUrl, useTasksSearchParams } from './util'

//渲染看板
export default function Kanban() {
  useDocumentTitle('看板列表')

  const {data: currentProject} = useProjectInUrl()
  const {data: kanbans, isLoading: kanbanIsLoading} = useKanbans(useKanbanSearchParams())
  const {isLoading: taskIsLoading} = useTasks(useTasksSearchParams())
  const isLoading = taskIsLoading || kanbanIsLoading

  return (
    <DragDropContext onDragEnd={() => {}}>
      <ScreenContainer>
        <h1>{currentProject?.name}看板</h1>
        <SearchPanel/>
        {
          isLoading ? <Spin size='large'/> :  (
            //用Drop包裹住需要拖拽的地方
            //类型：列，方向：水平，droppableId：可以随意命名
            <Drop type='COLUMN' direction='horizontal' droppableId='kanban'>
              <ColumnsContainer>
              {
                kanbans?.map( (kanban,index) => (
                  <Drag key={kanban.id} draggableId={'kanban'+ kanban.id} index={index}>
                    <KanbanColumn kanban={kanban} key={kanban.id}/>
                  </Drag>
                ))
              }
              <CreateKanban/>
              </ColumnsContainer>
            </Drop>
          )
        }
        <TaskModal/>
      </ScreenContainer>
    </DragDropContext>
  )
}

export const ColumnsContainer = styled(DropChild)`
  display: flex;
  overflow-x: scroll;
  flex: 1;
`
