import type { ForwardRefRenderFunction, TextareaHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import classnames from 'classnames'
import type { FieldError } from 'react-hook-form'

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: FieldError
  name: string
}

const TextAreaBase: ForwardRefRenderFunction<
  HTMLTextAreaElement,
  TextAreaProps
> = ({ label, error, name, className, ...rest }, ref) => {
  return (
    <div className="flex w-full flex-col text-sm">
      <label className="mb-1">{label}</label>
      <textarea
        name={name}
        ref={ref}
        className={classnames(
          'w-full rounded-md border border-slate-200 px-3 py-2',
          'placeholder:duration-200 focus:placeholder:px-1',
          'disabled:cursor-not-allowed',
          'focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500',
          error
            ? 'border-red-500 text-red-500 focus:border-red-500 focus:ring-red-500'
            : '',
          className
        )}
        {...rest}
      />
      <p className="mt-1 px-2 text-red-500">{error?.message}</p>
    </div>
  )
}

export const TextArea = forwardRef(TextAreaBase)
