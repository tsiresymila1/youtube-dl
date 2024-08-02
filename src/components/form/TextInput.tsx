import type {
  FormControlProps,
  InputLabelProps,
  InputProps,
  TextFieldProps,
} from '@mui/material'
import {
  FormControl,
  FormHelperText,
  InputLabel,
} from '@mui/material'
import type { GenericFieldHTMLAttributes } from 'formik'
import { useField } from 'formik'
import { capitalize } from 'lodash-es'
import { BaseInput } from './BaseInput'

export type FieldProps = Pick<
    GenericFieldHTMLAttributes,
    'onChange' | 'onBlur' | 'value' | 'name'
> & { format: (value: unknown) => unknown }

export type TextInputProps = FormControlProps &
  FieldProps & {
    inputProps: InputProps
    labelProps: InputLabelProps
  } & Pick<TextFieldProps, 'helperText' | 'label'>

export function TextInput({
  inputProps,
  label,
  helperText,
  onChange,
  onBlur,
  value,
  name,
  labelProps,
  ...props
}: Omit<TextInputProps, 'format'>) {
  const [, meta] = useField(name || '')
  return (
    <FormControl {...props}>
      <BaseInput
        name={name}
        value={value}
        onBlur={onBlur}
        onChange={onChange}
        label={label}
        {...inputProps}
      />
      {label ? <InputLabel {...labelProps}>{label}</InputLabel> : null}
      {helperText ? <FormHelperText component="span">{helperText}</FormHelperText> : null}
      {meta.error && meta.touched
        ? (
          <FormHelperText component="span" error>{capitalize(meta.error)}</FormHelperText>
          )
        : null}
    </FormControl>
  )
}
