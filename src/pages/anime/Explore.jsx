import { Box, useMediaQuery, useTheme } from "@mui/material"
import AnimeExplore from "../../component/AnimeExplore"

export default function Explore() {
  const anime = [
    {
      title: 'Slime Taoshite 300-nen, Shiranai Uchi ni Level Max ni Nattemashita: Sono Ni',
      description: `In role-playing games, slimes are usually the easiest monster to kill, and because of that, they yield few experience points. But what would happen if you live long enough to keep defeating them for 300 years? After many years of being a corporate slave, Azusa Aizawa abruptly passes away due to severe exhaustion. Seemingly headed for the afterlife, she meets a goddess who bestows her with immortality alongside a peaceful life in another world. There, Azusa enjoys her days tending to her farm, protecting the nearby village, and killing about 25 slimes per day—a routine that continues for at least three centuries.`,
      picture: 'https://cdn.myanimelist.net/images/anime/1074/147339l.jpg',
      genres: ['Comedy', 'Fantasy'],
      score: 7.12,
      mainPlatform: {
        episodeAired: 12
      },
      platforms: [
        { icon: '/images/bstation.png' },
        { icon: '/images/catchplay.png' },
        { icon: '/images/iqiyi.svg' },
        { icon: '/images/netflix.png' },
        { icon: '/images/iqiyi.svg' },
        { icon: '/images/bstation.png' },
        { icon: '/images/catchplay.png' },
      ],
      myListStatus: {
        progress: 3
      }
    },
    {
      title: 'Slime Taoshite 300-nen, Shiranai Uchi ni Level Max ni Nattemashita: Sono Ni',
      description: 'Centuries ago, mankind was slaughtered to near extinction by monstrous humanoid creatures called Titans, forcing humans to hide in fear behind enormous concentric walls. What makes these giants truly terrifying is that their taste for human flesh is not born out of hunger but what appears to be out of pleasure.',
      picture: 'https://cdn.myanimelist.net/images/anime/1074/147339l.jpg',
      genres: ['Action', 'Drama', 'Gore', 'Military', 'Shounen', 'Survival'],
      score: 7.12,
      mainPlatform: {
        episodeAired: 12
      },
      platforms: [
        { icon: '/images/bstation.png' },
        { icon: '/images/catchplay.png' },
        { icon: '/images/iqiyi.svg' },
        { icon: '/images/netflix.png' },
        { icon: '/images/iqiyi.svg' },
        { icon: '/images/bstation.png' },
      ],
      myListStatus: {
        progress: 3
      }
    }
  ]

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Box className="w-full pt-5">
      <AnimeExplore animes={anime} isMobile={isMobile}/>
    </Box>
  )
}