import { Select } from 'antd'
import React from 'react'
import { Raw } from 'types'

//组件参数透传
//获取Select组件的所有props的类型
type SelectProps = React.ComponentProps<typeof Select>

//用Omit将透传过来的所有有可能重复的属性删掉
interface IdSelectProps extends Omit<SelectProps, 'value' | 'onChange' | 'options'>{
    value?: Raw | null | undefined,
    onChange?: (value?: number) => void,
    defaultOptionName?: string,
    options?: { name: string, id: number }[]
}

//自定义的Select组件，可以自动将字符串id转化成数字
export default function IdSelect(props: IdSelectProps) {
    const{value, onChange, defaultOptionName, options, ...restProps} = props
    return <Select value={options?.length ? toNumber(value) : 0} onChange={value => onChange?.(toNumber(value) || undefined)} {...restProps}>
        {
            defaultOptionName ? <Select.Option value={0}>{defaultOptionName}</Select.Option> : null
        }
        {
            options?.map(option => <Select.Option key={option.id} value={option.id}>{option.name}</Select.Option>)
        }
    </Select>
}

const toNumber = (value:unknown) => isNaN(Number(value)) ? 0 : Number(value)
