import { Box, CardMedia } from "@mui/material";
import AnimeButton from "./AnimeButton";
import { AccessTime, CloudUpload, Settings } from "@mui/icons-material";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import AnimeSettings from "./AnimeSettings";

export default function AnimeImage({ 
  picture='https://cdn.myanimelist.net/images/anime/1074/147339l.jpg', 
  title="Slime Taoshite 300-nen, Shiranai Uchi ni Level Max ni Nattemashita: Sono Ni", 
  episodeAired=12, 
  progress=3 
}) {
  const { isAdmin } = useContext(AppContext)

  return (
    <Box className="w-full h-full relative">
      <CardMedia className="w-full h-full" component={'img'} image={picture} alt={title} />
      <AnimeButton 
        sx={{ position: 'absolute', bottom: 0, left: { xs: 'unset', sm: '0' }, right: { xs: 0, sm: 'unset ' } }}
        icon={CloudUpload} backgroundColor={'green'} 
        content={episodeAired}
      />
      <AnimeButton 
        sx={{ position: 'absolute', top: 0, left: 0 }}
        backgroundColor="yellow" content={episodeAired - progress} 
        icon={AccessTime} to={'/anime/:1/my-list-status'}
      />
      {isAdmin && <AnimeSettings sx={{ position: 'absolute', top: 0, right: 0 }}/>}
    </Box>
  )
}