import styled from '@emotion/styled'
import { Row } from 'components/lib'
import { useAuth } from 'context/auth-context'
import React from 'react'
import ProjectList from 'screens/projectList/ProjectList'

export default function AuthenticatedApp() {
  const { logout } = useAuth()
  return (
    <div>
      <Header between={true}>
        <HeaderLeft gap={true}>
          <h3>logo</h3>
          <h3>项目</h3>
          <h3>用户</h3>
        </HeaderLeft>
        <HeaderRight>
          <button onClick={logout}>登出</button>
        </HeaderRight>
      </Header>
      <Main>
        <ProjectList />
      </Main>
    </div>
  )
}


const Container = styled.div`
  display: grid;
  grid-template-rows: 6rem 1fr;
  height: 100vh;
`;

const Header = styled(Row)`
`;

//引入自定义样式组件,注意千万不要加.div，会导致运行不了且不报错
const HeaderLeft = styled(Row)``;

const HeaderRight = styled.div``;

const Main = styled.main`
`