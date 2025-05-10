import { FormControlLabel, Switch as MuiSwitch, Typography } from "@mui/material";

export default function Switch({ text, labelPlacement='end', field }) {
  return (
    <FormControlLabel 
      control={<MuiSwitch size="small" {...field} checked={field.value} />} 
      label={<Typography fontSize={'small'}>{text}</Typography>}
      labelPlacement={labelPlacement}
    />
  )
}