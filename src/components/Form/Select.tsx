import type {
  ForwardRefRenderFunction,
  ReactNode,
  SelectHTMLAttributes,
} from 'react'
import { forwardRef } from 'react'
import classnames from 'classnames'
import type { FieldError } from 'react-hook-form'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: FieldError
  name: string
  children: ReactNode
}

const SelectBase: ForwardRefRenderFunction<HTMLSelectElement, SelectProps> = (
  { label, error, name, className, children, ...rest },
  ref,
) => {
  return (
    <div className="flex flex-col text-sm w-full">
      <label className="mb-1">{label}</label>
      <select
        name={name}
        ref={ref}
        className={classnames(
          'px-3 py-2 rounded-md border border-slate-300 shadow-sm w-full bg-transparent',
          'disabled:cursor-not-allowed',
          'focus:outline-none focus:ring-1',
          error
            ? 'border-red-500 text-red-500 focus:border-red-500 focus:ring-red-500'
            : 'focus:border-sky-500 focus:ring-sky-500 ',
        )}
        {...rest}
      >
        {children}
      </select>
      <p className="mt-1 px-2 text-red-500">{error?.message}</p>
    </div>
  )
}

export const Select = forwardRef(SelectBase)
