import React, { useEffect, useState } from 'react'


export interface User {
  id: string,
  name: string,
  email: string,
  title: string,
  organization: string,
}

interface SearchPanelProps {
  users: User[],
  param: {
    name: string,
    personId: string,
  }
  setParam: (param: SearchPanelProps['param']) => void
}

export default function SearchPanel(props: SearchPanelProps) {

  const { param, setParam, users } = props


  return (
    <form action="">
      <div>
        <input type="text" value={param.name} onChange={event => setParam({
          ...param,
          name: event.target.value,
        })} />

        <select value={param.personId} onChange={event => setParam({
          ...param,
          personId: event.target.value
        })}>
          <option value={''}>负责人</option>
          {
            users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)
          }
        </select>
      </div>
    </form>
  )
}
