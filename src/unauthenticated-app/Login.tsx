import { useAuth } from 'context/auth-context'
import React, { FormEvent } from 'react'
import { Button, Form, Input } from 'antd'
import { LongButton } from 'unauthenticated-app'
import { useAsync } from 'utils/use-async'


const apiURL = process.env.REACT_APP_API_URL

export default function Login({ onError }: { onError: (error: Error) => void }) {

    // const login = (param: { username: string, password: string }) => {
    //     fetch(`${apiURL}/login`, {
    //         method: 'POST',
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify(param)
    //     }).then(async (response) => {
    //         if (response.ok) {

    //         }
    //     })
    // }
    const { login, user } = useAuth()
    const {run , isLoading} = useAsync(undefined,{throwOnError: true})

    // const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    //     event.preventDefault()
    //     const username = (event.currentTarget.elements[0] as HTMLFormElement).value
    //     const password = (event.currentTarget.elements[1] as HTMLFormElement).value
    //     login({ username, password })
    // }

    //antd会自动获取Form中的name属性值对应的键值
    const handleSubmit = async (values: { username: string, password: string }) => {
        console.log(values)
        // try {
        //     //这里一定要加上async await
        //     await login(values);
        // } catch (error) {
        //     if(error) onError(error as Error)
        // }
        try {
            await run(login(values))
        } catch (error) {
            onError(error as Error)
        }
        //login(values).catch(err=>onError(err))
    }

    return (
        <Form onFinish={handleSubmit} action="">
            {/* 需要注意，要获取到Form.item必须直接包裹住Input且只有一个元素（连注释节点也不能有），所以必须删除label */}
            <Form.Item name={'username'} rules={[{ required: true, message: '请输入用户名' }]}>
                <Input placeholder='用户名' type="text" id='username' />
            </Form.Item>
            <Form.Item name={'password'} rules={[{ required: true, message: '请输入密码' }]}>
                <Input placeholder='密码' type="text" id='password' />
            </Form.Item>
            <Form.Item>
                <LongButton loading={isLoading} htmlType='submit' type='primary'>登录</LongButton>
            </Form.Item>
        </Form>
    )

    // <form onSubmit={handleSubmit} action="">
    //         <div>
    //             <label htmlFor="username">用户名</label>
    //             <input type="text" id='username' />
    //         </div>
    //         <div>
    //             <label htmlFor="password">密码</label>
    //             <input type="text" id='password' />
    //         </div>
    //         <button type='submit'>登录</button>
    // </form>
}
