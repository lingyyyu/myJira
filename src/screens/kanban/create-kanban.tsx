import React, { useState } from 'react'
import { QueryKey, useMutation } from 'react-query'
import { Kanban } from 'types/Kanban'
import { useHttp } from 'utils/http'
import { useKanbansQueryKey, useProjectIdInUrl } from './util'
import { useEditConfig, useAddConfig, useDeleteConfig} from "utils/use-optimistic-options"
import { Input } from 'antd'
import { Container } from './kanban-column'

export default function CreateKanban() {
    const [name, setName] = useState('')
    const projectId = useProjectIdInUrl()
    const {mutateAsync: addKanban} = useAddKanban(useKanbansQueryKey())

    const submit = async () => {
        //增加看板
        await addKanban({name,projectId})
        //增加完看板后重置掉名字
        setName('')
    }
  return (
    <Container>
        <Input size='large' placeholder='新建看板名称' onPressEnter={submit} value={name} onChange={evt => setName(evt.target.value)}/>
    </Container>
  )
}

export const useAddKanban = (queryKey: QueryKey) => {
    const client = useHttp()
  
    return useMutation( (params: Partial<Kanban>) => 
      client(`kanbans`, {
        data: params,
        method: 'POST'
      }), 
      useAddConfig(queryKey)
    )
  
}
  