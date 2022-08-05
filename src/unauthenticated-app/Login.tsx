import { useAuth } from 'context/auth-context'
import React, { FormEvent } from 'react'



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

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const username = (event.currentTarget.elements[0] as HTMLFormElement).value
        const password = (event.currentTarget.elements[1] as HTMLFormElement).value
        login({ username, password })
    }
    return (
        <form onSubmit={handleSubmit} action="">
            <div>
                <label htmlFor="username">用户名</label>
                <input type="text" id='username' />
            </div>
            <div>
                <label htmlFor="password">密码</label>
                <input type="text" id='password' />
            </div>
            <button type='submit'>登录</button>
        </form>
    )
}
