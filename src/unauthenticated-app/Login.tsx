import { useAuth } from 'context/auth-context'
import React, { FormEvent } from 'react'
import { Button, Form, Input } from 'antd'


const apiURL = process.env.REACT_APP_API_URL

export default function Login() {

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

    // const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    //     event.preventDefault()
    //     const username = (event.currentTarget.elements[0] as HTMLFormElement).value
    //     const password = (event.currentTarget.elements[1] as HTMLFormElement).value
    //     login({ username, password })
    // }

    //antd会自动获取Form中的name属性值对应的键值
    const handleSubmit = (values: { username: string, password: string }) => {
        console.log(values)
        login(values);
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
                <Button htmlType='submit' type='primary'>登录</Button>
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
