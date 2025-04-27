import { Box, useMediaQuery, useTheme } from "@mui/material";
import UserAnimeList from "../../component/UserAnimeList";

export default function List() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Box className="w-full pt-5">
      <UserAnimeList isMobile={isMobile} />
    </Box>
  )
}