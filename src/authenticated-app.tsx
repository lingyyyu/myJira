import styled from '@emotion/styled'
import { ButtonNoPadding, Row } from 'components/lib'
import { useAuth } from 'context/auth-context'
import React from 'react'
import ProjectList from 'screens/projectList/ProjectList'
import {ReactComponent as SoftwareLogo} from 'assets/software-logo.svg'
import { Button, Dropdown, Menu } from 'antd'
//yarn add react-router-dom@6
import {BrowserRouter, Navigate , Route , Routes} from 'react-router-dom'
import Project from 'screens/project/Project'
import { resetRoute } from 'utils'
import { useState } from 'react'
import ProjectModel from 'screens/projectList/ProjectModel'
import ProjectPopover from 'components/project-popover'

export default function AuthenticatedApp() {

  return (
    <Container>
      <BrowserRouter>   
        <PageHeader/> 
        <Main>        
          <Routes>
            <Route path='/projects' element={<ProjectList />} />
            <Route path='/projects/:projectId/*' element={<Project/>}/>
            <Route index element={<Navigate to='/projects'/>} />
          </Routes>       
        </Main>
        <ProjectModel/>
      </BrowserRouter>
    </Container>
  )
}

//path='/projects/:projectId/*'
//:号代表后面是个变量。    *号代表什么都可以


const PageHeader = () => {
  return <Header between={true}>
    <HeaderLeft gap={true}>
      {/* 重置路由按钮 */}
      <ButtonNoPadding type='link' onClick={resetRoute}>
        <SoftwareLogo width={'18rem'} color={'rgb(38,132,255)'}/>
      </ButtonNoPadding>
      <ProjectPopover />
      <span>用户</span>
    </HeaderLeft>
    <HeaderRight>
      <User/>
    </HeaderRight>
  </Header>
}

//User组件
const User = () => {
  const { logout ,user } = useAuth()

  //overlay是下拉框
  return <Dropdown overlay={
    <Menu>
      <Menu.Item key={'logout'}>
        <Button type='link' onClick={logout}>登出</Button>
      </Menu.Item>
    </Menu>
    }>
    <Button type='link' onClick={e=>e.preventDefault()}>Hi, {user?.name}</Button>

  </Dropdown>
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 6rem 1fr;
  height: 100vh;
`;

const Header = styled(Row)`
padding: 3.2rem;
box-shadow: 0 0 5px 0 rgba(0,0,0,0.1);
z-index: 1;
`;

//引入自定义样式组件,注意千万不要加.div，会导致运行不了且不报错
const HeaderLeft = styled(Row)``;

const HeaderRight = styled.div``;

const Main = styled.main`
display: flex;
overflow: hidden;
`