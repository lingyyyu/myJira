import { useState, useEffect } from 'react'
import SearchPanel from './SearchPanel'
import List from './List'
import { cleanObject, useDebounce, useMount } from 'utils'
import * as qs from 'qs'
import { useHttp } from 'utils/http'


//npm start时读的是.env.development中的变量
//npm run build打包后上线读取的是.env中的变量
const apiURL = process.env.REACT_APP_API_URL

export default function ProjectList() {

  const [param, setParam] = useState({
    name: '',
    personId: '',
  })

  const [users, setUsers] = useState([])

  const [list, setList] = useState([])

  //实现输入框0.2秒刷新一次状态改变的效果
  const debouncedParam = useDebounce(param, 200)

  //获取自定义的ajax请求hook
  const client=useHttp()

  useEffect(() => {
    //使用自定义hook发送ajax请求
    client('projects',{data: cleanObject(debouncedParam)}).then(setList)

    // fetch(`${apiURL}/projects?${qs.stringify(cleanObject(debouncedParam))}`).then(async (response) => {
    //   if (response.ok) {
    //     setList(await response.json())
    //   }
    // })
  }, [debouncedParam])

  //使用自定义cutomhook取代useEffect
  useMount(() => {
    //使用自定义hook发送ajax请求
    client('users').then(setUsers)

    // fetch(`${apiURL}/users`).then(async (response) => {
    //   if (response.ok) {
    //     setUsers(await response.json())
    //   }
    // })
  })

  return (
    <div>
      <SearchPanel param={param} setParam={setParam} users={users} />
      <List list={list} users={users} />
    </div>
  )
}
