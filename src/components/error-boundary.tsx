import React, { Component, ReactNode } from 'react'


//异常边界类
//实现同样功能的npm包
// https://github.com/bvaughn/react-error-boundary
// https://www.npmjs.com/package/react-error-boundary



//如果一个 class 组件中定义了 static getDerivedStateFromError() 或 componentDidCatch() 这两个生命周期方法中的任意一个（或两个）时，那么它就变成一个错误边界。
//当抛出错误后，请使用 static getDerivedStateFromError()渲染备用 UI ，使用 componentDidCatch() 打印错误信息。


//React.ReactElement实际上就是我们的tsx类型
type FallbackRender = (props: {error:Error | null}) => React.ReactElement
//类组件中传入的第一个参数是props，第二个参数是state
export default class ErrorBoundary extends Component<React.PropsWithChildren<{ fallbackRender: FallbackRender}>, {error: Error | null}> {
  state={error: null}//传入的第二个参数

  //当子组件抛出异常，这里会接收到异常并且自动调用
  static getDerivedStateFromError(error:Error){
    return {error}
  }

  render(){
    const {error} = this.state
    const {fallbackRender,children} = this.props
    if(error){
        return fallbackRender({error})
    }
    return children
  }
}
