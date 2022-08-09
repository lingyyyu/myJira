import React from 'react';
import logo from './logo.svg';
import './App.css';
import ProjectList from 'screens/projectList/ProjectList';
import Try_useArray from 'Try_useArray';
import Login from 'unauthenticated-app/Login';
import { useAuth } from 'context/auth-context';
import AuthenticatedApp from 'authenticated-app';
import { UnauthenticatedApp } from 'unauthenticated-app';
import ErrorBoundary from 'components/error-boundary';
import { FullPageErrorFallback } from 'components/lib';

function App() {
  const { user } = useAuth()

  return (
    <div className="App">
      {/* 使用错误边界类后，会自动捕获内部组件的渲染错误 */}
      <ErrorBoundary fallbackRender={FullPageErrorFallback}>
        {/* <ProjectList/> */}
        {/* <Try_useArray/> */}
        {/* 根据user是否为空决定是否切换登录页面 */}
        {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
      </ErrorBoundary>
    </div>
  );
}

export default App;
