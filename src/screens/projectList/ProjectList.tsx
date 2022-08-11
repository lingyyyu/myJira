import { useState, useEffect } from 'react'
import SearchPanel from './SearchPanel'
import List, { Project } from './List'
import { cleanObject, useDebounce, useDocumentTitle, useMount } from 'utils'
import * as qs from 'qs'
import { useHttp } from 'utils/http'
import styled from '@emotion/styled'
import { Typography } from 'antd'
import { useAsync } from 'utils/use-async'
import { useProjects } from 'utils/project'
import { useUsers } from 'utils/user'
import { useUrlQueryParam } from 'utils/url'
import { useProjectsSearchParams } from './util'


//npm start时读的是.env.development中的变量
//npm run build打包后上线读取的是.env中的变量
const apiURL = process.env.REACT_APP_API_URL

export default function ProjectList() {
  useDocumentTitle('项目列表',false)

  //('name' | 'personId')[]   意思是键值为name或personId的数组，写法类似于string[]
  //const [keys] = useState<('name' | 'personId')[]>(['name','personId'])
  const [param,setParam] = useProjectsSearchParams()

  //实现输入框0.2秒刷新一次状态改变的效果
  const debouncedParam = useDebounce(param, 200)

  //获取自定义的ajax请求hook
  // const client=useHttp()

  //使用自定义hook来取代list，isLoading，error这些state
  const { isLoading, error, data: list, retry } = useProjects(debouncedParam)
  //使用自定义hook来取代user state
  const { data: users } = useUsers()


  // useEffect(() => {

  //   // setIsLoading(true)
  //   // //使用自定义hook发送ajax请求
  //   // client('projects',{data: cleanObject(debouncedParam)}).then(setList)
  //   // .catch( error =>{
  //   //       setList([])
  //   //       setError(error)
  //   //     }
  //   //   )
  //   // .finally(() => setIsLoading(false))//请求结束时设置加载状态为false

  //   // fetch(`${apiURL}/projects?${qs.stringify(cleanObject(debouncedParam))}`).then(async (response) => {
  //   //   if (response.ok) {
  //   //     setList(await response.json())
  //   //   }
  //   // })
  // }, [debouncedParam])



  //使用自定义cutomhook取代useEffect
  // useMount(() => {
  //   //使用自定义hook发送ajax请求
  //   client('users').then(setUsers)

  //   // fetch(`${apiURL}/users`).then(async (response) => {
  //   //   if (response.ok) {
  //   //     setUsers(await response.json())
  //   //   }
  //   // })
  // })

  return (
    <Container>
      <h1>项目列表</h1>
      <SearchPanel param={param} setParam={setParam} users={users || []} />
      {error ? <Typography.Text type='danger'>{error.message}</Typography.Text> : null}
      <List refresh={retry} loading={isLoading} dataSource={list || []} users={users || []} />
    </Container>
  )
}

const Container = styled.div`
padding: 3.2rem;
`

//打开whyDidYouRender排查工具
//ProjectList.whyDidYouRender = true