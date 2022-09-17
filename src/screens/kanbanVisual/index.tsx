import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { Chart } from '@antv/g2'
import { useTasks } from 'utils/task'
import { useKanbanSearchParams, useTasksSearchParams } from 'screens/kanban/util'
import { useKanbans } from 'utils/kanban'

export default function KanbanVisual() {
    const {data: kanbans, isLoading: kanbanIsLoading} = useKanbans(useKanbanSearchParams())
    const {data: allTasks} = useTasks(useTasksSearchParams())

    //数据不存在时的备用数据
    const kanbanChartDataError = useMemo(() => {
        return [
            {
              name: 'xxx',
              count: 1,
            },
            {
              name: 'xxx',
              count: 1, 
            },
            {
                name: 'xxx',
                count: 1, 
            },
        ]
    }, [])
    //生成数据源
    const kanbanChartData = useMemo(() => {
        return kanbans?.map((kanban) => {
            return {
                name: kanban.name,
                count: allTasks?.filter(task => task.kanbanId === kanban.id).length
            }
        })
    }, [kanbans,allTasks])

    const randerChart1 = useCallback(() => {
        const tempNode = document.getElementById('chartData1')
        const child = tempNode?.lastElementChild
        if (child) {
            // 这里我做了一个判断  防止饼图重复渲染 但是直接操作了dom 
            // 如果有更好的方法 可以换掉
            tempNode.removeChild(child)
        }
        const data = kanbanChartData || kanbanChartDataError

        // Step 1: 创建 Chart 对象
        const chart = new Chart({
            container: 'chartData1', // 指定图表容器 ID
            width: 450, // 指定图表宽度
            height: 300 // 指定图表高度
        })
        // Step 2: 载入数据源
        chart.data(data)
        chart.coordinate('theta', {
            radius: 0.7
        })
        chart.scale('count', {
            formatter: (val) => {
            val = val * 100 + '%'
            return val
            },
        })
        chart.tooltip({
            showTitle: false,
            showMarkers: false,
        })
        chart.axis(false) // 关闭坐标轴
        chart.legend({
            position: 'right',   // legend位置  
            offsetX: -10
        })
        const interval = chart
            .interval()
            .adjust('stack')
            .position('count')
            //.color('name', ['#1890FF', '#FAB242', 'red'])
            .color('name', (name) => {
                if(name === '已完成') return '#1890FF'
                else if(name === '开发中') return '#FAB242'
                else if(name === '待完成') return 'red'
                else return 'blue'
            })
            .label('name', (val) => {
            return {
                content: (obj) => {
                    return obj.name + ':' + obj.count
                },
                offset: 20, // 这个是指示器那条细线的长度  可以随意设置offset小写  大写失效
                }
            }) 
            .tooltip('name*count', (name, count) => {
            return {
                name: name,
                value: count,
            }
            })
            .style({
            lineWidth: 1,
            stroke: '#fff',
            })
        chart.render()
    }, [kanbanChartData, kanbanChartDataError])

    useEffect(() => {
        randerChart1()
    } , [randerChart1])

  return (
    <div id='chartData1'></div>
  )
}
