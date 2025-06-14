import { 
  Box,
  Container,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ButtonLink from "../component/ButtonLink";
import { KeyboardDoubleArrowRight } from "@mui/icons-material";
import Timeline from "./anime/Timeline";
import Explore, { AnimeList, AnimeWrapper } from "./anime/Explore";
import List from "./anime/List";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { getAnimeList } from "../services/mal.service";
import { AppContext } from "../context/AppContext";
import { handleScroll } from "../helper/handleScroll";

export default function Dashboard() {
  const { isLoggedIn } = useContext(AppContext);
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q');
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  
  // State
  const [originalAnimes, setOriginalAnimes] = useState([]);
  const [animes, setAnimes] = useState(Array(isMobile ? 3 : 12).fill(null));
  const [isLoading, setIsLoading] = useState(true);
  const limit = isMobile ? 10 : 30;
  const [offset, setOffset] = useState(limit);
  const [isLatest, setIsLatest] = useState(false);
  const [message, setMessage] = useState('');

  // Get anime list
  useEffect(() => {
    const fetchAnime = async () => {
      setIsLoading(true);

      const { success, data } = await getAnimeList(q);
      if (success) {
        setOriginalAnimes(data.data);
      }
    }
    
    fetchAnime();
  }, [isLoggedIn, q]);

  // Limit and offset to display on user screen
  useEffect(() => {
    setAnimes(originalAnimes.slice(0, offset));
    if ((animes.length === originalAnimes.length)) setIsLatest(true);
    setIsLoading(false);
  }, [originalAnimes, offset]);

  // Get next anime list when user scrolling
  useEffect(() => {
    if (isLatest) return;

    const onScroll = () => handleScroll(setOffset, limit);

    window.addEventListener('scroll', onScroll);
    
    return () => window.removeEventListener('scroll', onScroll);
  }, [isLatest, limit]);

  return q ?
    (<AnimeWrapper>
      {
        message ? 
        <Container>
          <Typography 
            fontWeight={'bold'} 
            color="secondary"
            component={'div'}
            fontSize={'small'} 
            sx={{
              fontSize: { xs: '3rem', md: '5rem' }
            }}
          >
            Anime <br /> Tidak Ditemukan
          </Typography>
          <Typography variant="subtitle1">{message} </Typography>
        </Container> :
        <AnimeList 
          animes={animes} isMobile={isMobile} isLoading={isLoading} 
          setAnimes={setOriginalAnimes} originalAnimes={originalAnimes} isLatest={isLatest} 
        />
      }
    </AnimeWrapper>) :
    (<Container className="flex flex-wrap justify-between overflow-hidden" component={'main'}>
        <AnimeWrap to={'/anime/timeline'}>
          <Timeline isDashboard={'true'} />
        </AnimeWrap>
        <Divider orientation="vertical" flexItem />
        <AnimeWrap to={'/anime'}>
          <Explore isDashboard={'true'} />
        </AnimeWrap>
        <AnimeWrap to={'/anime/myliststatus'}>
          <List isDashboard={'true'} />
        </AnimeWrap>
      </Container>)
}

function AnimeWrap({ children, to }) {
  const navigate = useNavigate();
  return (
    <Box className="flex flex-col w-full md:max-w-[48%] pt-5">
      <Box className="max-h-[75vh] overflow-hidden">
        {children}
      </Box>
      <ButtonLink
        onClick={() => navigate(to)} 
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