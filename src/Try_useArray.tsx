import React from 'react'
import { useArray } from 'utils'

export default function Try_useArray() {
    const persons: { name: string, age: number }[] = [
        { name: 'lily', age: 16 }
    ]
    const { value, removeIndex, add, clear } = useArray(persons);

    return (
        <div>
            <button onClick={() => add({ name: 'john', age: 22 })}>add john</button>
            <button onClick={() => removeIndex(0)}>remove 0</button>

            {value.map((person: any, index: number) => (
                <div style={{ marginBottom: '30px' }}>
                    <span style={{color:'red'}}>{index}</span>
                    <span>{person.name}</span>
                    <span>{person.age}</span>
                </div>
            ))}
        </div>
    )
}
