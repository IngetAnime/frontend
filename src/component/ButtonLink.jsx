import { Button } from "@mui/material"
import { Link } from "react-router-dom"

export default function ButtonLink(props) {
  return <Button component={Link} { ...props } />
}