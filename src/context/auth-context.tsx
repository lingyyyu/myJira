import React, { useState } from "react"
import * as auth from 'auth-provider'


interface AuthForm{
    username:string
    password:string
}

const AuthContext=React.createContext(undefined)
AuthContext.displayName='AuthContext'

export const AuthProvider =()=>{
    const [user,setUser]=useState(null)
    const login =(form:AuthForm)=> auth.login(form).then(user=>setUser(user))
}