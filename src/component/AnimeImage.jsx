import { Box, CardMedia } from "@mui/material";
import AnimeButton from "./AnimeButton";
import { AccessTime, CloudUpload } from "@mui/icons-material";
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import AnimeSettings from "./AnimeSettings";
import AnimeEdit from "./AnimeEdit";

export default function AnimeImage({ 
  picture='https://cdn.myanimelist.net/images/anime/1074/147339l.jpg', 
  title="Slime Taoshite 300-nen, Shiranai Uchi ni Level Max ni Nattemashita: Sono Ni", 
  episodeAired=12, 
  progress=3,
  isDialog
}) {
  const { isAdmin } = useContext(AppContext)
  const [isOpen, setIsOpen] = useState(false)
  function handleIsOpen() {
    setIsOpen(!isOpen)
  }

  return (
    <Box className="w-full h-full relative">
      <CardMedia className="w-full h-full" component={'img'} image={picture} alt={title} />
      {!isDialog && 
        <>
          <AnimeButton 
            sx={{ position: 'absolute', bottom: 0, left: { xs: 'unset', sm: '0' }, right: { xs: 0, sm: 'unset ' } }}
            icon={CloudUpload} backgroundColor={'green'} to={'https://youtube.com/playlist?list=PLPanbgyToztYXtCdCOgDDhfNlIWt2w5_L&si=qNj3DNPVwhyjPafS'}
            content={episodeAired}
          />

          <AnimeButton 
            sx={{ position: 'absolute', top: 0, left: 0 }}
            backgroundColor="yellow" content={episodeAired - progress} 
            icon={AccessTime} onClick={handleIsOpen}
          />

          {isAdmin && <AnimeSettings sx={{ position: 'absolute', top: 0, right: 0 }}/>}

          <AnimeEdit isOpen={isOpen} handleClick={handleIsOpen} />
        </>
      }
    </Box>
  )
}