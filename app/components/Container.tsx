import { ReactNode } from 'react'
import classnames from 'classnames'

interface ContainerProps {
  children: ReactNode
  classNames?: string
}

export function Container({ children, classNames }: ContainerProps) {
  return (
    <div className={classnames(classNames, 'mx-auto max-w-[1280px]')}>
      {children}
    </div>
  )
}
