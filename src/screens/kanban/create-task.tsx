import { Card, Input } from 'antd'
import React, { useEffect, useState } from 'react'
import { QueryKey, useMutation } from 'react-query'
import { Task } from 'types/Task'
import { useAddTask } from 'utils/task'
import { useProjectIdInUrl, useTasksQueryKey } from './util'

//创建事务
export default function CreateTask({kanbanId}: {kanbanId: number}) {
    const [name, setName] = useState('')
    const {mutateAsync: addTask} = useAddTask(useTasksQueryKey())
    const projectId = useProjectIdInUrl()
    const [inputMode, setInputMode] = useState(false)//记录是否处于输入中的状态

    const submit = async () => {
        await addTask({projectId, name, kanbanId})
        setInputMode(false)
        setName('')
    }

    //根据聚焦切换输入状态和非输入状态
    const toggle = () => setInputMode(mode => !mode)

    useEffect(() => {
        if(!inputMode){
            setName('')
        }
    } , [inputMode])

    if(!inputMode){
        return <div onClick={toggle}>+创建事务</div>
    }

  return (
    <Card>
        <Input onBlur={toggle} placeholder={'需要做些什么'} autoFocus={true} onPressEnter={submit} value={name} onChange={evt => setName(evt.target.value)}/>
    </Card>
  )
}

