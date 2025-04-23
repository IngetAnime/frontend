import { Box, CardMedia } from "@mui/material";
import AnimeButton from "./AnimeButton";
import { AccessTime, CloudUpload } from "@mui/icons-material";

export default function AnimeImage({ picture, title, episodeAired, progress }) {
  return (
    <Box className="w-full h-25 sm:h-full relative">
      <CardMedia className="w-full h-full" component={'img'} image={picture} alt={title} />
      <AnimeButton 
        sx={{ position: 'absolute', bottom: 0, left: { xs: 'unset', sm: '0' }, right: { xs: 0, sm: 'unset ' } }}
        icon={<CloudUpload />} backgroundColor={'green'} 
        content={episodeAired}
      />
      <AnimeButton 
        sx={{ position: 'absolute', top: 0, left: 0 }}
        backgroundColor="yellow" content={episodeAired - progress} 
        icon={<AccessTime />} to={'/anime/:1/my-list-status'}
      />
    </Box>
  )
}