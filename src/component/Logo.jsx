import { Avatar, Typography } from "@mui/material"
import Link from "./Link"

export default function Logo() {
  return (
    <Link 
      className={'flex items-center gap-2 sm:gap-2.5'}
      underline="none"
      color="textPrimary"
      to={'/'}
    >
      <Avatar src="/images/logo.jpg" />
      <Typography variant={'h1'}>IngetAnime!</Typography>
    </Link>
  )
}