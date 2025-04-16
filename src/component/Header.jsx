import { Box, Avatar, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <Link to={'/'}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2 }} component={'header'}>
        <Avatar src="/images/logo.jpg"/>
        <Typography variant={'h1'}>IngetAnime!</Typography>
      </Box>
    </Link>
  )
}