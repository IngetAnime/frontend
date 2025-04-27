import { Avatar, Typography } from "@mui/material"
import Link from "./Link"

export default function Logo({ color="textPrimary", className='' }) {
  return (
    <Link 
      className={`flex items-center gap-2 sm:gap-2.5 ${className}`}
      underline="none"
      color={color}
      to={'/'}
    >
      <Avatar src="/images/logo.jpg" />
      <Typography variant={'h1'}>IngetAnime!</Typography>
    </Link>
  )
}