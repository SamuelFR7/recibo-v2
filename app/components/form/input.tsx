import type { ForwardRefRenderFunction, InputHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import classnames from 'classnames'
import type { FieldError } from 'react-hook-form'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: FieldError
  name: string
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  { label, error, name, className, ...rest },
  ref
) => {
  return (
    <div className="flex w-full flex-col text-sm">
      <label className="mb-1">{label}</label>
      <input
        name={name}
        ref={ref}
        className={classnames(
          'w-full rounded-md border border-slate-200 px-3 py-2',
          'placeholder:duration-200 focus:placeholder:px-1',
          'disabled:cursor-not-allowed',
          'focus:outline-none  focus:ring-1',
          error
            ? 'border-red-500 text-red-500 focus:border-red-500 focus:ring-red-500'
            : 'focus:border-sky-500 focus:ring-sky-500',
          className
        )}
        {...rest}
      />
      <p className="mt-1 px-2 text-red-500">{error?.message}</p>
    </div>
  )
}

export const Input = forwardRef(InputBase)
