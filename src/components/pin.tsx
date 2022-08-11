import { Rate } from 'antd';
import React from 'react'

//星星图标组件
//组件透传
interface PinProps extends React.ComponentProps<typeof Rate> {
    checked: boolean;
    onCheckedChange?: (checked:boolean) => void
}

export const Pin = (props : PinProps) => {
    const {checked, onCheckedChange, ...restProps} = props

    //Rate是antd的星星组件
    // !!num === Boolean(num)
    return <Rate
        count={1}
        value={checked ? 1 : 0}
        onChange={num => onCheckedChange?.(!!num)}
        {...restProps}
    />
}