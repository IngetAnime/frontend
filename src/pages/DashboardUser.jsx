import { 
  Box,
  Card,
  Container,
  Divider,
  Typography
} from "@mui/material";
import Header from "../component/Header";
import Wrapper from "../component/Wrapper";
import AnimeTimeline from "../component/AnimeTimeline";
import ButtonLink from "../component/ButtonLink";
import { KeyboardDoubleArrowRight } from "@mui/icons-material";
import underDevelopment from "../helper/underDevelopment";
import AnimeExplore from "../component/AnimeExplore";
import UserAnimeList from "../component/UserAnimeList";
import AnimeSearch from "../component/Search";

export default function DashboardUser() {
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

  return (
    <Wrapper>
      <Header />
      <Container className="flex flex-wrap justify-between overflow-hidden" component={'main'}>
        <AnimeWrap>
          <AnimeTimeline animes={anime}/>
        </AnimeWrap>
        <Divider orientation="vertical" flexItem />
        <AnimeWrap>
          <AnimeExplore />
        </AnimeWrap>
        <AnimeWrap>
          <UserAnimeList />
        </AnimeWrap>
      </Container>
      {/* <Box bgcolor={'primary.main'} color={'white'}>
        <Container className="flex justify-center">
          <Box className="flex flex-col justify-center align-middle gap-5 p-4 text-center max-w-[50rem]">
            <AnimeSearch />
            <Typography>Temukan platform terbaik buat nonton anime favorit kamu disini!</Typography>
            <Typography color="white" fontSize={'small'} fontWeight={'thin'}>2025 - IngetAnime <br /> asdcode123@gmail.com</Typography>
          </Box>
        </Container>
      </Box> */}
    </Wrapper>
  )
}

function AnimeWrap({ children }) {
  return (
    <Box className="flex flex-col w-full md:max-w-[48%] pt-4">
      <Box className="max-h-[75vh] overflow-hidden">
        {children}
      </Box>
      <ButtonLink
        onClick={(e) => underDevelopment(e)} 
        variant="contained" endIcon={<KeyboardDoubleArrowRight />} 
        sx={{ 
          width: 'fit-content', alignSelf: 'flex-end', my: '1rem'
        }}
      >
        Lebih banyak
      </ButtonLink>
    </Box>
  )
}