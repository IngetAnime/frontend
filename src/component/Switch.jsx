import { FormControlLabel, Switch as MuiSwitch, Typography } from "@mui/material";

export default function Switch({ text, labelPlacement='end' }) {
  return (
    <FormControlLabel 
      control={<MuiSwitch size="small" />} 
      label={<Typography fontSize={'small'}>{text}</Typography>}
      labelPlacement={labelPlacement}
    />
  )
}