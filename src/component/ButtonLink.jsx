import { Button, Tooltip } from "@mui/material"
import { Link } from "react-router-dom"

export default function ButtonLink(props) {
  const { title, ...rest } = props
  if (title) {
    return (
      <Tooltip title={title}>
        <Button component={Link} { ...rest } />
      </Tooltip>
    )
  }
  return (
    <Button component={Link} { ...rest } />
  )
}