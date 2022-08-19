import styled from '@emotion/styled'
import { Menu } from 'antd'
import React from 'react'
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Epic from 'screens/epic/Epic'
import Kanban from 'screens/kanban/Kanban'

//区分路径是看板还是任务组的小hook
const useRouteType = () => {
  const units = useLocation().pathname.split('/')//将路径用/分割成数组
  //返回数组中的最后一个:kanban || epic
  return units[units.length - 1]
}


export default function Project() {
  const routeType = useRouteType()
  return (
    <Container>
      {/* 加上 / 表示绝对路径（根路由），不加 / 表示从当前路由开始的相对路径。 */}
      <Aside>
        <Menu mode='inline' selectedKeys={[routeType]}>
          <Menu.Item key={'kanban'}>
            <Link to={'kanban'}>看板</Link>
          </Menu.Item>
          <Menu.Item key={'epic'}>
            <Link to={'epic'}>任务组</Link>
          </Menu.Item>
        </Menu>       
      </Aside>
      <Main>
        <Routes>
          {/* /projects/:projectId/kanban */}
          <Route path='kanban' element={<Kanban/>}/>
          <Route path='epic' element={<Epic/>}/>
          {/* 设置默认页面，replace=true后替换掉了之前的链接projects/num，浏览器可以回退 */}
          <Route index element={<Navigate to='kanban' replace={true}/>} />
        </Routes>
      </Main>
    </Container>
  )
}

const Aside = styled.aside`
background-color: rgb(244,245,247);
display: flex;
`
const Main = styled.div`
  box-shadow: -5px 0 5px -5px rgba(0, 0, 0, 0.1);
  display: flex;
`

const Container = styled.div`
display: grid;
grid-template-columns: 16rem 1fr;
`