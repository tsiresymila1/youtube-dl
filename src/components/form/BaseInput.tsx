import type { InputProps } from '@mui/material'
import { OutlinedInput } from '@mui/material'
import React from 'react'

export type BaseInputProps = InputProps & { label?: React.ReactNode }

export function BaseInput(props: BaseInputProps): JSX.Element {
  return <OutlinedInput {...props} />
}
