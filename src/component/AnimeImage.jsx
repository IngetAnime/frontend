import { Box, CardMedia, Tooltip } from "@mui/material";
import AnimeButton from "./AnimeButton";
import { AccessTime, Add, CloudUpload } from "@mui/icons-material";
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import AnimeSettings from "./AnimeSettings";
import AnimeEdit from "./AnimeEdit";
import { toast } from "react-toastify";

export default function AnimeImage({ isDialog, picture, episodeAired, anime, setAnime }) {
  const { isAdmin, isLoggedIn } = useContext(AppContext)
  const [isOpen, setIsOpen] = useState(false)
  function handleIsOpen() {
    if (isLoggedIn) {
      setIsOpen(!isOpen)
    } else {
      toast.error('Anda harus login terlebih dahulu')
    }
  }
  const episodeRemaining = episodeAired - anime.myListStatus?.progress;

  return (
    <Box className="w-full h-full relative">
      <CardMedia className="w-full h-full" component={'img'} image={picture || anime.picture} />
      {!isDialog && 
        <>
          {episodeAired && (
            <AnimeButton 
              sx={{ position: 'absolute', bottom: 0, left: { xs: 'unset', sm: '0' }, right: { xs: 0, sm: 'unset ' } }}
              icon={CloudUpload} backgroundColor={
                anime.status === 'finished_airing' ? 'blue' : 
                anime.status === "currently_airing" ? 'green' :
                'gray'
              }
              { ...(anime.platforms[0]?.link && { to: anime.platforms[0].link })}
              content={episodeAired} title={`Episode ${episodeAired} sudah tayang`}
            />
          )}

          {anime.myListStatus?.status ? (
            <AnimeButton 
              sx={{ position: 'absolute', top: 0, left: 0 }}
              backgroundColor={episodeRemaining > 0 ? 'yellow' : 'blue'} 
              content={Number.isNaN(episodeRemaining) ? '?' : episodeRemaining} 
              icon={AccessTime} onClick={handleIsOpen} 
              title={
                episodeRemaining < 0 ? `Ada ${Math.abs(episodeRemaining)} episode ditonton lebih awal` : 
                episodeRemaining > 0 ? `Ada ${episodeRemaining} episode yang belum ditonton` :
                episodeRemaining === 0 ? `Sudah menonton semua episode terbaru` :
                `Episode yang belum ditonton belum bisa dihitung`
              }
            />
          ) : (
            <AnimeButton 
              sx={{ position: 'absolute', top: 0, left: 0 }}
              backgroundColor="green"
              icon={Add} onClick={handleIsOpen}
            />
          )}

          {isAdmin && <AnimeSettings sx={{ position: 'absolute', top: 0, right: 0 }} anime={anime} setAnime={setAnime} />}

          <AnimeEdit isOpen={isOpen} handleClick={handleIsOpen} anime={anime} setAnime={setAnime} />
        </>
      }
    </Box>
  )
}