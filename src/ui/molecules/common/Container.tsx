import clsx from 'clsx';
import React from 'react'

interface IContainer{
    className?: string;
    children?: React.ReactNode;
    
}

export default function Container(
    { className, children }: IContainer
) {
  return (
    <div className={clsx(className, "bg-white border-solid border border-gray-300 rounded-xl")}>{children}</div>
  )
}
