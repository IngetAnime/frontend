import { Link as MuiLink } from "@mui/material"
import { Link as RouterLink } from "react-router-dom"

export default function Link(props) {
  return <MuiLink component={RouterLink} { ...props } />
}