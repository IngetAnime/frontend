import { 
  Box,
  Container,
  Typography
} from "@mui/material";
import Header from "../component/Header";
import Wrapper from "../component/Wrapper";
import AnimeTimeline from "../component/AnimeTimeline";
import ButtonLink from "../component/ButtonLink";
import { KeyboardDoubleArrowRight } from "@mui/icons-material";
import underDevelopment from "../helper/underDevelopment";

export default function DashboardUser() {
  const anime = [
    {
      title: 'Slime Taoshite 300-nen, Shiranai Uchi ni Level Max ni Nattemashita: Sono Ni',
      picture: 'https://cdn.myanimelist.net/images/anime/1074/147339l.jpg',
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
      picture: 'https://cdn.myanimelist.net/images/anime/1074/147339l.jpg',
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
      <Container sx={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', justifyContent: 'space-between' }}>
        <Box sx={{ py: '1rem', display: 'flex', flexDirection: 'column', width: { xs: '100%', md: '30rem'} }}>
          <div className="max-h-[75vh] md:max-h-[80vh] overflow-hidden">
            <AnimeTimeline animes={anime}/>
          </div>
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
        {/* <Box sx={{ py: '1rem', maxHeight: '100vh', overflow: 'hidden', width: { xs: '100%', md: '30rem'} }}>
          <AnimeTimeline animes={anime}/>
        </Box> */}
      </Container>
    </Wrapper>
  )
}