import React from 'react'
import { Link, Navigate, Route, Routes } from 'react-router-dom'
import Epic from 'screens/epic/Epic'
import Kanban from 'screens/kanban/Kanban'

export default function Project() {
  return (
    <div>
      <h1>Project</h1>
      {/* 加上 / 表示绝对路径（根路由），不加 / 表示从当前路由开始的相对路径。 */}
      <Link to={'kanban'}>看板</Link>
      <Link to={'epic'}>任务组</Link>

      <Routes>
        {/* /projects/:projectId/kanban */}
        <Route path='kanban' element={<Kanban/>}/>
        <Route path='epic' element={<Epic/>}/>
        {/* 设置默认页面，replace=true后替换掉了之前的链接projects/num，浏览器可以回退 */}
        <Route index element={<Navigate to='kanban' replace={true}/>} />
      </Routes>
    </div>
  )
}
