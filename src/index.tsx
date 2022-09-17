import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {loadServer,DevTools} from 'jira-dev-tool'
//务必在jira-dev-tool后面引入antd样式
import 'antd/dist/antd.less'
//create-react-app要配置antd还需要安装craco并修改配置文件

import { AppProviders } from 'context';

//导入反复渲染排查工具
import './wdyr'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

loadServer(()=> root.render(
    <AppProviders>
      <DevTools/>
      <App />
    </AppProviders>
))

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
