import { Button, Drawer } from 'antd'
import React from 'react'
import { useProjectModal } from './util'

export default function ProjectModel() {
  const {projectModalOpen, close} = useProjectModal()

  return (
    <Drawer onClose={close} visible={projectModalOpen} width={'100%'}>
        <h1>Project Modal</h1>
        <Button onClick={close}>关闭</Button>
    </Drawer>
  )
}
