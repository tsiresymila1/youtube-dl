import Grid2 from '@mui/material/Unstable_Grid2'
import { SubmitButton } from '@/components/form/SubmitButton'

export function SaveFooter() {
  return (
    <Grid2 container disableEqualOverflow py={2}>
      <Grid2 sm={12} md={4} />
      <Grid2 sm={12} md={8} alignContent="end">
        <SubmitButton variant="contained">
          Save
        </SubmitButton>
      </Grid2>
    </Grid2>
  )
}
