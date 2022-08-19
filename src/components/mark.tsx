import React from 'react'

//搜索的关键字用颜色高亮标记
export default function Mark({name, keyword}: {name: string, keyword: string}) {
    if(!keyword){
        return <>{name}</>
    }

    const arr = name.split(keyword)
  return (
    <>
    {
        arr.map((str,index) => <span key={index}>
            {str}
            {
                index === arr.length -1 ? null : <span style={{color: '#257AFD'}}>{keyword}</span>
            }
        </span>)
    }
    </>
  )
}
