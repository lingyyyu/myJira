import { useAuth } from 'context/auth-context'
import React, { FormEvent } from 'react'
import { Button, Form, Input } from 'antd'



const apiURL = process.env.REACT_APP_API_URL

export default function Register() {

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
    const { register, user } = useAuth()

    const handleSubmit = (values: { username: string, password: string }) => {
        register(values)
    }
    return (
        <Form onFinish={handleSubmit} action="">
            <Form.Item name={'username'} rules={[{ required: true, message: '请输入用户名' }]}>
                <Input placeholder='用户名' type="text" id='username' />
            </Form.Item>
            <Form.Item name={'password'} rules={[{ required: true, message: '请输入密码' }]}>
                <Input placeholder='密码' type="text" id='password' />
            </Form.Item>
            <Form.Item>
                <Button htmlType='submit' type='primary'>注册</Button>
            </Form.Item>
        </Form>
    )
}
