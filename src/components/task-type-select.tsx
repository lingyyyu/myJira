import React from 'react'
import { useTaskTypes } from 'utils/task-type'
import IdSelect from './id-select'

//任务类型的选择栏
export default function TaskTypeSelect(props:React.ComponentProps<typeof IdSelect>) {
    const {data: taskTypes} = useTaskTypes();
  return (
    <IdSelect options={taskTypes || []} {...props}/>
  )
}
