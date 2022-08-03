import { useState, useEffect } from 'react'
import SearchPanel from './SearchPanel'
import List from './List'


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

  useEffect(() => {
    if(param.personId=='')
    {
      fetch(`${apiURL}/projects`).then(async (response) => {
        if (response.ok) {
          setList(await response.json())
        }
      })
    }
    else{
      fetch(`${apiURL}/projects?personId=${param.personId}`).then(async (response) => {
        if (response.ok) {
          setList(await response.json())
        }
      })
    }
  }, [param])

  useEffect(() => {
    fetch(`${apiURL}/users`).then(async (response) => {
      if (response.ok) {
        setUsers(await response.json())
      }
    })
  }, [])

  return (
    <div>
      <SearchPanel param={param} setParam={setParam} users={users} />
      <List list={list} users={users} />
    </div>
  )
}
