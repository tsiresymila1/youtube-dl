import { useFormikContext } from 'formik'
import type { ButtonProps } from '@mui/material'
import { LoadingButton } from '@mui/lab'

export function SubmitButton({ onClick, sx, ...restProps }: ButtonProps) {
  const { submitForm, isSubmitting } = useFormikContext()
  return (
    <LoadingButton
      loading={isSubmitting}
      disabled={isSubmitting}
      variant="contained"
      sx={
                !isSubmitting
                  ? { color: 'white', ...sx }
                  : { color: 'transparent', ...sx }
            }
      color="primary"
      onClick={async (evt) => {
        await submitForm()
        onClick && onClick(evt)
      }}
      {...restProps}
    />
  )
}
