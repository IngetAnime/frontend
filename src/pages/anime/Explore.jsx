import { Autorenew, CalendarMonth, EmojiEvents, Lightbulb, Login, RestartAlt, Star } from "@mui/icons-material";
import { Box, Card, List, ListItem, Tab, Tabs, Tooltip, Typography, useTheme, useMediaQuery, Skeleton, Container, Button } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import AnimeImage from "../../component/AnimeImage";
import Link from "../../component/Link";
import AnimeButton from "../../component/AnimeButton";
import AnimePlatform from "../../component/AnimePlatform";
import SortAndFilter from "../../component/SortAndFilter";
import CustomTabPanel from "../../component/CustomTabPanel";
import dayjs from "dayjs";
import { getAnimeRanking, getSeasonalAnime, getSuggestedAnime } from "../../services/mal.service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppContext } from "../../context/AppContext";
import { useLocation } from "react-router-dom";
import { getAnimeRankingSchema, getSeasonalAnimeSchema } from "../../validators/mal.validator";
import getCurrentSeason from "../../helper/getCurrentSeason";
import ButtonLink from "../../component/ButtonLink";
import { getPlatforms } from "../../services/platform.service";
import { toast } from "react-toastify";

export default function Explore({ isDashboard=false }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md')) || isDashboard
  const location = useLocation()
  localStorage.setItem('lastPath', location.pathname)

  return (
    <Box className={`flex flex-col gap-5 $`}>
      <Typography variant="h2">Eksplorasi Judul Anime!</Typography>

      <AnimeExploreType isMobile={isMobile} />
    </Box>
  )
}

function AnimeExploreType({ isMobile }) {
  const lastAnimeExplore = parseInt(localStorage.getItem('lastAnimeExplore')) || 0
  const { isLoggedIn } = useContext(AppContext)
  const [value, setValue] = useState(lastAnimeExplore);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    localStorage.setItem('lastAnimeExplore', newValue)
  };

  const animeExploreType = [
    {
      text: 'Anime Terbaik',
      icon: <EmojiEvents />,
      element: <TopAnime isMobile={isMobile} isLoggedIn={isLoggedIn} />
    },
    {
      text: 'Musim Ini',
      icon: <Autorenew />,
      element: <CurrentSeason isMobile={isMobile} isLoggedIn={isLoggedIn} />
    },
    {
      text: 'Rekomendasi',
      icon: <Lightbulb />,
      element: <SuggestedAnime isMobile={isMobile} isLoggedIn={isLoggedIn} />
    },
    {
      text: 'Musiman',
      icon: <CalendarMonth />,
      element: <Seasons isMobile={isMobile} isLoggedIn={isLoggedIn} />
    },
  ]

  return (
    <Box className="flex flex-col items-center gap-5">
      <Tabs
        value={value}
        onChange={handleChange}
      >
        {animeExploreType.map((type, index) => {
          return (
            <Tab
              key={index}
              label={
                <Typography textTransform={'none'} fontSize={'small'} fontWeight={'bold'} className="flex items-center gap-1">
                  {type.icon}
                  {type.text}
                </Typography>
              } 
              id={`simple-tab-${index}`}
              aria-controls={`simple-tabpanel-${index}`}
            />
          )
        })}
      </Tabs>

      {animeExploreType.map((type, index) => {
        return (
          <CustomTabPanel value={value} index={index} key={index}>
            {type.element}
          </CustomTabPanel>
        )
      })}
    </Box>
  )
}

// List anime explore type

function TopAnime({ isMobile, isLoggedIn }) {
  // Component

  // State
  const [animes, setAnimes] = useState(Array(isMobile ? 3 : 12).fill(null));
  const [originalAnimes, setOriginalAnimes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const limit = isMobile ?  10 : 30;
  const [offset, setOffset] = useState(0);

  // Form

  // Settings
  const { control, watch, reset } = useForm({
    resolver: zodResolver(getAnimeRankingSchema), defaultValues: {
      rankingType: 'all',
      accessType: 'all',
      status: 'all',
      platform: 0,
    }
  })

  // Watch input value changes
  const rankingType = watch('rankingType')
  const accessType = watch('accessType');
  const status = watch('status');
  const platformId = watch('platform');

  // Get list of platform from database
  const [menus, setMenus] = useState([
    { text: 'All', value: 0 },
  ])
  useEffect(() => {
    const getPlatformsProvider = async () => {
      const { data, success, message } = await getPlatforms();
      if (success) {
        setMenus(data.map((menu) => {
          return {
            text: menu.name,
            value: menu.id,
          }
        }))
      } else {
        toast.error(message)
      }
    }
    getPlatformsProvider()
  }, [])

  // Menu item
  const filterAndSort = [
    {
      name: 'Jenis Peringkat',
      id: 'rankingType',
      isMultiple: false,
      menus: [
        { text: 'All Anime', value: 'all' },
        { text: 'Top Airing', value: 'airing' },
        { text: 'Top Upcoming', value: 'upcoming' },
        { text: 'Top TV Series', value: 'tv' },
        { text: 'Top Movies', value: 'movie' },
        { text: 'Top OVAs', value: 'ova' },
        { text: 'Top ONAs', value: 'ona' },
        { text: 'Top Specials', value: 'special' },
        { text: 'Most Popular', value: 'bypopularity' },
        { text: 'Most Favorited', value: 'favorite' },
      ],
    },
    {
      name: 'Tipe Akses',
      id: 'accessType',
      isMultiple: false,
      menus: [
        { text: 'Semua', value: 'all' },
        { text: 'Tersedia gratis', value: 'available_for_free' },
        { text: 'Waktu terbatas', value: 'limited_time' },
        { text: 'Wajib berlangganan', value: 'subscription_only' },
      ]
    },
    {
      name: 'List Saya',
      id: 'status',
      isMultiple: true,
      menus: [
        { text: 'Semua', value: 'all' },
        { text: 'Berjalan', value: 'watching' },
        { text: 'Selesai', value: 'completed' },
        { text: 'Ditunda', value: 'on_hold' },
        { text: 'Ditinggalkan', value: 'dropped' },
        { text: 'Direncanakan', value: 'plan_to_watch' },
        { text: 'Tidak ada dalam list saya', value: 'none' },
      ]
    },
    {
      name: 'Platform',
      id: 'platform',
      isMultiple: true,
      menus: [
        { text: 'Semua', value: 0 },
        ...menus,
      ]
    },
  ]

  // Get anime ranking list based on select value
  const [isLatest, setIsLatest] = useState(false);
  useEffect(() => {
    const fetchAnime = async () => {
      if (isLatest) return;

      setIsLoading(true);
      const { data } = await getAnimeRanking(rankingType, limit, offset)
      const filteredAnime = filterAndSortAnime(data.data, accessType, status, platformId);
      
      if (!data.paging?.next) {
        setIsLatest(true);
      }

      // If offset 0, that is a new fetch
      if (offset === 0) {
        setOriginalAnimes([...data.data]);
      } else {
        setOriginalAnimes(prev => [...prev, ...data.data]);
      }

      setIsLoading(false);
    };

    fetchAnime();
  }, [offset, rankingType, isLoggedIn, isLatest]);

  // Get anime list of current season
  useEffect(() => {
    setAnimes(Array(isMobile ? 3 : 12).fill(null));
    setOriginalAnimes([]);
    setOffset(0);
    setIsLatest(false);
  }, [rankingType, isLoggedIn]);

  // Get next anime list when user scrolling
  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const clientHeight = window.innerHeight;
    const scrollHeight = document.documentElement.scrollHeight
    if (scrollTop + clientHeight + 1 >= scrollHeight) {
      setOffset((offset) => offset + limit);
    }
  }
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [])

  // Sort and filter anime
  useEffect(() => {
    if (originalAnimes.length) {
      setIsLoading(true)
      setAnimes(filterAndSortAnime(originalAnimes, accessType, status, platformId))
      setIsLoading(false)
    }
  }, [originalAnimes, accessType, platformId, status])

  return (
    <AnimeWrapper>
      <SortAndFilter filterAndSort={filterAndSort} control={control} disabled={isLoading} />
      {
        (animes.length) ?
        <AnimeList 
        animes={animes} isMobile={isMobile} isLoading={isLoading} 
        setAnimes={setOriginalAnimes} originalAnimes={originalAnimes} 
        /> :
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
          <Typography variant="subtitle1">
            {'Silakan atur kembali filter dan pengurutan atau tekan tombol di bawah ini untuk mengatur ulang'}
          </Typography>
          <Button variant="contained" endIcon={<RestartAlt />} className="w-full sm:w-fit" sx={{ mt: 5 }} onClick={() => reset()}>
            Atur ulang
          </Button>
        </Container>
      }
    </AnimeWrapper>
  )
}

function CurrentSeason({ isMobile, isLoggedIn  }) {
  // Component

  // State
  const [animes, setAnimes] = useState(Array(isMobile ? 3 : 12).fill(null))
  const [originalAnimes, setOriginalAnimes] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const limit = isMobile ?  10 : 30;
  const [offset, setOffset] = useState(0);

  // Form

  // Settings
  const { year, season } = getCurrentSeason()
  const { control, watch, reset } = useForm({ 
    resolver: zodResolver(getSeasonalAnimeSchema), defaultValues: {
      sort: 'anime_num_list_users', year, season,
      animeType: 'all', 
      accessType: 'all',
      status: 'all',
      platform: 0
    }
  })

  // Watch input value changes
  const sort = watch('sort')
  const animeType = watch('animeType');
  const accessType = watch('accessType');
  const status = watch('status');
  const platformId = watch('platform');

  // Get list of platform from database
  const [menus, setMenus] = useState([
    { text: 'All', value: 0 },
  ])
  useEffect(() => {
    const getPlatformsProvider = async () => {
      const { data, success, message } = await getPlatforms();
      if (success) {
        setMenus(data.map((menu) => {
          return {
            text: menu.name,
            value: menu.id,
          }
        }))
      } else {
        toast.error(message)
      }
    }
    getPlatformsProvider()
  }, [])

  // Menu item
  const filterAndSort = [
    {
      name: 'Jenis Anime',
      id: 'animeType',
      isMultiple: false,
      menus: [
        { text: 'Semua', value: 'all' },
        { text: 'Baru', value: 'new' },
        { text: 'Lanjutan', value: 'continue' },
        { text: 'TV', value: 'tv' },
        { text: 'ONA', value: 'ona' },
        { text: 'OVA', value: 'ova' },
        { text: 'Movie', value: 'movie' },
        { text: 'Special', value: 'special' },
      ]
    },
    {
      name: 'Urutan',
      id: 'sort',
      isMultiple: false,
      menus: [
        { text: 'Anggota', value: 'anime_num_list_users' },
        { text: 'Skor', value: 'anime_score' },
        // { text: 'Tanggal mulai' },
        // { text: 'Judul' },
        // { text: 'Studio' },
        // { text: 'Lisensor' },
      ]
    },
    {
      name: 'Tipe Akses',
      id: 'accessType',
      isMultiple: false,
      menus: [
        { text: 'Semua', value: 'all' },
        { text: 'Tersedia gratis', value: 'available_for_free' },
        { text: 'Waktu terbatas', value: 'limited_time' },
        { text: 'Wajib berlangganan', value: 'subscription_only' },
      ]
    },
    {
      name: 'List Saya',
      id: 'status',
      isMultiple: true,
      menus: [
        { text: 'Semua', value: 'all' },
        { text: 'Berjalan', value: 'watching' },
        { text: 'Selesai', value: 'completed' },
        { text: 'Ditunda', value: 'on_hold' },
        { text: 'Ditinggalkan', value: 'dropped' },
        { text: 'Direncanakan', value: 'plan_to_watch' },
        { text: 'Tidak ada dalam list saya', value: 'none' },
      ]
    },
    {
      name: 'Platform',
      id: 'platform',
      isMultiple: true,
      menus: [
        { text: 'Semua', value: 0 },
        ...menus,
      ]
    },
  ]

  // Get anime list based on user scrolling
  const [isLatest, setIsLatest] = useState(false);
  useEffect(() => {
    const fetchAnime = async () => {
      if (isLatest) return;

      setIsLoading(true);
      const { data } = await getSeasonalAnime(year, season, sort, limit, offset);
      const filteredAnime = firstFilter(data.data);
      
      if (!data.paging?.next) {
        setIsLatest(true);
      }

      // If offset 0, that is a new fetch
      if (offset === 0) {
        setOriginalAnimes([...data.data]);
      } else {
        setOriginalAnimes(prev => [...prev, ...data.data]);
      }

      setIsLoading(false);
    };

    fetchAnime();
  }, [offset, sort, isLoggedIn, isLatest]);

  // Get anime list of current season
  useEffect(() => {
    setAnimes(Array(isMobile ? 3 : 12).fill(null));
    setOriginalAnimes([]);
    setOffset(0);
    setIsLatest(false);
  }, [sort, isLoggedIn]);

  // Get next anime list when user scrolling
  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const clientHeight = window.innerHeight;
    const scrollHeight = document.documentElement.scrollHeight
    if (scrollTop + clientHeight + 1 >= scrollHeight) {
      setOffset((offset) => offset + limit);
    }
  }
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [])

  // Sort and filter anime
  const firstFilter = (animes) => {
    let newAnimes = [...animes]
    if (animeType === 'new') {
      newAnimes = newAnimes.filter(anime => 
        (anime.start_season.season === season) && (anime.start_season.year === year)
      )
    } else if (animeType === 'continue') {
      newAnimes = newAnimes.filter(anime => 
        (anime.start_season.season !== season) || (anime.start_season.year !== year)
      )
    } else if (animeType !== 'all') {
      newAnimes = newAnimes.filter(anime => anime.media_type === animeType)
    }

    newAnimes = filterAndSortAnime(newAnimes, accessType, status, platformId);
    return newAnimes;
  }
  useEffect(() => {
    if (originalAnimes.length) {
      setIsLoading(true)
      setAnimes(firstFilter(originalAnimes))
      setIsLoading(false)
    }
  }, [originalAnimes, animeType, accessType, platformId, status])

  return (
    <AnimeWrapper>
      <SortAndFilter filterAndSort={filterAndSort} control={control} disabled={isLoading} />
      {
        (animes.length) ?
        <AnimeList 
        animes={animes} isMobile={isMobile} isLoading={isLoading} 
        setAnimes={setOriginalAnimes} originalAnimes={originalAnimes} isLatest={isLatest}
        /> :
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
          <Typography variant="subtitle1">
            {'Silakan atur kembali filter dan pengurutan atau tekan tombol di bawah ini untuk mengatur ulang'}
          </Typography>
          <Button variant="contained" endIcon={<RestartAlt />} className="w-full sm:w-fit" sx={{ mt: 5 }} onClick={() => reset()}>
            Atur ulang
          </Button>
        </Container>
      }
    </AnimeWrapper>
  )
}

function Seasons({ isMobile, isLoggedIn }) {
  // Component

  // State
  const [animes, setAnimes] = useState(Array(isMobile ? 3 : 12).fill(null))
  const [originalAnimes, setOriginalAnimes] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const limit = isMobile ?  10 : 30;
  const [offset, setOffset] = useState(0);

  // Generate 1917 until this year
  const earlyYear = 1917;
  const lastYear = dayjs().get('year') + 1; // +1 for next year season
  const years = Array(lastYear-earlyYear+1).fill().map((_, i) => {
    return {
      text: (lastYear - i).toString(),
      value: (lastYear - i)
    }
  })

  // Form

  // Settings
  const { year: initialYear, season: initialSeason } = getCurrentSeason()
  const { control, watch, reset } = useForm({
    resolver: zodResolver(getSeasonalAnimeSchema), defaultValues: {
      sort: 'anime_num_list_users', year: initialYear, season: initialSeason,
      animeType: '', 
      accessType: 'all',
      status: 'all',
      platform: 0
    }
  })

  // Watch input value changes
  const sort = watch('sort');
  const year = watch('year');
  const season = watch('season');
  const accessType = watch('accessType');
  const status = watch('status');
  const platformId = watch('platform');

  // Get list of platform from database
  const [menus, setMenus] = useState([
    { text: 'All', value: 0 },
  ])
  useEffect(() => {
    const getPlatformsProvider = async () => {
      const { data, success, message } = await getPlatforms();
      if (success) {
        setMenus(data.map((menu) => {
          return {
            text: menu.name,
            value: menu.id,
          }
        }))
      } else {
        toast.error(message)
      }
    }
    getPlatformsProvider()
  }, [])

  // Menu item
  const filterAndSort = [
    {
      name: 'Musim',
      id: 'season',
      isMultiple: false,
      menus: [
        { text: 'Fall', value: 'fall' },
        { text: 'Summer', value: 'summer' },
        { text: 'Spring', value: 'spring' },
        { text: 'Winter', value: 'winter' },
      ]
    },
    {
      name: 'Tahun',
      id: 'year',
      isMultiple: false,
      menus: years
    },
    {
      name: 'Urutan',
      id: 'sort',
      isMultiple: false,
      menus: [
        { text: 'Anggota', value: 'anime_num_list_users' },
        { text: 'Skor', value: 'anime_score' },
        // { text: 'Tanggal mulai' },
        // { text: 'Judul' },
        // { text: 'Studio' },
        // { text: 'Lisensor' },
      ]
    },
    {
      name: 'Tipe Akses',
      id: 'accessType',
      isMultiple: false,
      menus: [
        { text: 'Semua', value: 'all' },
        { text: 'Tersedia gratis', value: 'available_for_free' },
        { text: 'Waktu terbatas', value: 'limited_time' },
        { text: 'Wajib berlangganan', value: 'subscription_only' },
      ]
    },
    {
      name: 'List Saya',
      id: 'status',
      isMultiple: true,
      menus: [
        { text: 'Semua', value: 'all' },
        { text: 'Berjalan', value: 'watching' },
        { text: 'Selesai', value: 'completed' },
        { text: 'Ditunda', value: 'on_hold' },
        { text: 'Ditinggalkan', value: 'dropped' },
        { text: 'Direncanakan', value: 'plan_to_watch' },
        { text: 'Tidak ada dalam list saya', value: 'none' },
      ]
    },
    {
      name: 'Platform',
      id: 'platform',
      isMultiple: true,
      menus: [
        { text: 'Semua', value: 0 },
        ...menus,
      ]
    },
  ]

  // Get anime list of selected season
  const [isLatest, setIsLatest] = useState(false);
  useEffect(() => {
    const fetchAnime = async () => {
      if (isLatest) return;

      setIsLoading(true);
      const { data } = await getSeasonalAnime(year, season, sort, limit, offset);
      const filteredAnime = firstFilter(data.data)
      
      if (!data.paging?.next) {
        setIsLatest(true);
      }
      
      // If offset 0, that is a new fetch
      if (offset === 0) {
        setOriginalAnimes([...data.data]);
      } else {
        setOriginalAnimes(prev => [...prev, ...data.data]);
      }

      setIsLoading(false);
    };

    fetchAnime();
  }, [offset, sort, year, season, isLoggedIn, isLatest]);

  // Get anime list of current season
  useEffect(() => {
    setAnimes(Array(isMobile ? 3 : 12).fill(null));
    setOriginalAnimes([]);
    setOffset(0);
    setIsLatest(false);
  }, [sort, year, season, isLoggedIn]);

  // Get next anime list when user scrolling
  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const clientHeight = window.innerHeight;
    const scrollHeight = document.documentElement.scrollHeight
    if (scrollTop + clientHeight + 1 >= scrollHeight) {
      setOffset((offset) => offset + limit);
    }
  }
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [])

  // Sort and filter anime
  const firstFilter = (animes) => {
    let newAnimes = [...animes].filter(anime => 
      (anime.start_season.season === season) && (anime.start_season.year === year)
    );
    newAnimes = filterAndSortAnime(newAnimes, accessType, status, platformId);
    return newAnimes;
  };
  useEffect(() => {
    if (originalAnimes.length) {
      setIsLoading(true)
      setAnimes(firstFilter(originalAnimes))
      setIsLoading(false)
    }
  }, [originalAnimes, accessType, platformId, status])

  return (
    <AnimeWrapper>
      <SortAndFilter filterAndSort={filterAndSort} control={control} disabled={isLoading} />
      {
        (animes.length) ?
        <AnimeList 
        animes={animes} isMobile={isMobile} isLoading={isLoading} 
        setAnimes={setOriginalAnimes} originalAnimes={originalAnimes} isLatest={isLatest}
        /> :
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
          <Typography variant="subtitle1">
            {'Silakan atur kembali filter dan pengurutan atau tekan tombol di bawah ini untuk mengatur ulang'}
          </Typography>
          <Button variant="contained" endIcon={<RestartAlt />} className="w-full sm:w-fit" sx={{ mt: 5 }} onClick={() => reset()}>
            Atur ulang
          </Button>
        </Container>
      }
    </AnimeWrapper>
  )
}

function SuggestedAnime({ isMobile, isLoggedIn }) {
  // Component

  // State
  const [animes, setAnimes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const limit = isMobile ?  10 : 30;
  const [offset, setOffset] = useState(0);

  // Get anime list of selected season
  const [isLatest, setIsLatest] = useState(false);
  useEffect(() => {
    const fetchAnime = async () => {
      if (isLatest) return;

      setIsLoading(true);
      const { data, success, message } = await getSuggestedAnime(limit, offset);

      if (success) {
        if (!data.paging?.next) {
          setIsLatest(true);
        }
  
        // If offset 0, that is a new fetch
        if (offset === 0) {
          setAnimes([...data.data]);
          setOriginalAnimes([...data.data]);
        } else {
          setAnimes(prev => [...prev, ...data.data]);
          setOriginalAnimes(prev => [...prev, ...data.data]);
        }
  
        setIsLoading(false);
      } else {
        setMessage(message);
      }
    };

    fetchAnime();
  }, [offset, isLoggedIn]);

  // Get next anime list when user scrolling
  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const clientHeight = window.innerHeight;
    const scrollHeight = document.documentElement.scrollHeight
    if (scrollTop + clientHeight + 1 >= scrollHeight) {
      setOffset((offset) => offset + limit);
    }
  }
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [])

  return (
    <AnimeWrapper>
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
          <ButtonLink variant="contained" endIcon={<Login />} to={'/auth'} className="w-full sm:w-fit" sx={{ mt: 5 }}>Masuk</ButtonLink>
        </Container> :
        <AnimeList animes={animes} isMobile={isMobile} isLoading={isLoading} setAnimes={setAnimes} isLatest={isLatest} />
      }
    </AnimeWrapper>
  )
}

function AnimeWrapper({ children }) {
  return (
    <Box className="flex flex-col px-1">
      {children}
    </Box>
  )
}

// Filter and sort anime

function filterAndSortAnime(originalAnimes, accessType, status, platformId) {
  let filteredAnime = [...originalAnimes]
  
  // Filter accessType
  if (accessType === 'available_for_free') {
    filteredAnime = filteredAnime.filter(anime => {
      return anime.platforms.some(platform => platform.accessType === 'free');
    })
  } else if (accessType === 'limited_time') {
    filteredAnime = filteredAnime.filter(anime => {
      return (anime.platforms.length && anime.platforms.every(platform => platform.accessType === 'limited_time'));
    })
  } else if (accessType === 'subscription_only') {
    filteredAnime = filteredAnime.filter(anime => {
      return (anime.platforms.length && anime.platforms.every(platform => platform.accessType === 'subscription'));
    })
  }

  // Filter status
  if (status === 'none') {
    filteredAnime = filteredAnime.filter(anime => !anime.myListStatus?.status)
  } else if (status !== 'all') {
    filteredAnime = filteredAnime.filter(anime => anime.myListStatus?.status === status)
  }

  // Filter platform
  if (platformId !== 0) {
    filteredAnime = filteredAnime.filter(anime => {
      return (anime.platforms.length && anime.platforms.some(platform => platform.platform.id === platformId));
    })
  }

  return filteredAnime
}

// List anime item

function AnimeList({ animes, isMobile, isLoading, setAnimes, originalAnimes, isLatest }) {  
  const setAnime = (newAnime) => {
    const newAnimes = originalAnimes.map(anime => {
      if (anime.id === newAnime.id) {
        return { ...anime, ...newAnime }
      }
      return anime
    })
    setAnimes(newAnimes)
  }
  return (
    <List 
      disablePadding sx={{ py: '1rem' }}
      className={`flex flex-col gap-5 ${ !isMobile && 'flex-row flex-wrap justify-center'}`}
    >
      {
        animes?.length ? 
        (animes.map((anime, index) => (
          <ListItem key={index} disablePadding className={`${ !isMobile && 'md:max-w-[47%] lg:max-w-[30%]'}`}>
            {
              anime ? 
              <Card className="w-full h-full">
                {/* Dekstop Mode */}
                <Box className="hidden sm:flex p-2 gap-2 justify-between">
                  <Box className="flex flex-col items-start">
                    <AnimeTitle
                      title={anime.title} releaseAt={anime.releaseAt} 
                      episodeTotal={anime.num_episodes} averageEpisodeDuration={anime.average_episode_duration}
                    />
                  </Box>
                  {anime.mean && (
                    <AnimeScore score={anime.mean} />
                  )}
                </Box>

                <Box className="flex flex-wrap overflow-hidden w-full sm:h-40 gap-2 sm:gap-0">
                  <Box className="w-full sm:w-30 h-35 sm:h-full">
                    <AnimeImage 
                      anime={anime} setAnime={setAnime}
                      episodeAired={anime.status === 'finished_airing' ? anime.num_episodes : anime.platforms[0]?.episodeAired} 
                    />
                  </Box>

                  <Box className="flex flex-col justify-between pb-1 px-2 flex-1 gap-2 sm:gap-0">
                    <Box className="block sm:hidden">
                      <AnimeTitle 
                        title={anime.title} releaseAt={anime.releaseAt} 
                        episodeTotal={anime.num_episodes} averageEpisodeDuration={anime.average_episode_duration}
                      />
                    </Box>
                    <Box>
                      <Typography 
                        sx={{ 
                          display: '-webkit-box', WebkitLineClamp: anime.platforms[0]?.episodeAired ? 3 : 4, WebkitBoxOrient: 'vertical',
                          fontSize: 'small', textAlign: 'left'
                        }}
                        className="overflow-y-auto"
                      >
                        {anime.synopsis}
                      </Typography>
                    </Box>

                    <Typography sx={{ fontSize: 'small' }}>
                      Genre:&nbsp;
                      {anime.genres?.map((genre, index) => (
                        <span key={index} >
                          <Link>{genre.name}</Link>
                          {index < anime.genres.length - 1 && ', '}
                        </span>
                      ))}
                    </Typography>
                    {anime.mean && (
                      <AnimeScore score={anime.mean} sx={{ display: { sm: 'none' } }} />
                    )}
                    
                    { anime.platforms.length ? <AnimePlatform platforms={anime.platforms} /> : <></> }
                    { (!anime.platforms.length && isMobile) && <Box /> }
                  </Box>
                </Box>
              </Card> :
              <AnimeSkeleton />
            }
          </ListItem>
        ))) : 
        (Array(isMobile ? 3 : 12).fill(null).map((_,index) => (
          <ListItem key={index} disablePadding className={`${ !isMobile && 'md:max-w-[47%] lg:max-w-[30%]'}`}>
            <AnimeSkeleton />
          </ListItem>
        )))
      }
      {(!isLatest && animes?.length) ?
        (Array(isMobile ? 1 : (3 - animes.length % 3)).fill(null).map((_,index) => (
          <ListItem key={index} disablePadding className={`${ !isMobile && 'md:max-w-[47%] lg:max-w-[30%]'}`}>
            <AnimeSkeleton />
          </ListItem>
        ))) : <></>
      }
    </List>
  )
}

function AnimeSkeleton() {
  return (
    <Card className="w-full">
      {/* Dekstop Mode */}
      <Box className="hidden sm:flex p-2 gap-2 justify-between">
        <Box className="flex flex-col items-start w-full">
          <Skeleton className="w-20" variant="text" sx={{ fontSize: 'small' }} />
          <Skeleton className="w-40" variant="text" sx={{ fontSize: 'small' }} />
        </Box>
        <Skeleton className="w-18" variant="rounded" sx={{ height: '1.75rem' }}/>
      </Box>

      <Box className="flex flex-wrap overflow-hidden w-full sm:h-40 gap-2 sm:gap-0">
        <Box className="w-full sm:w-30 h-35 sm:h-full">
          <Skeleton className="w-full" variant="rectangular" height={'100%'}/>
        </Box>

        <Box className="flex flex-col justify-between pb-1 px-2 flex-1 gap-10 sm:gap-0 h-full">
          <Box className="flex flex-col pb-1 px-2 flex-1 gap-2 sm:gap-0">
            <Skeleton variant="text"/>
            <Skeleton variant="text"/>
            <Skeleton variant="text" width={'50%'}/>
          </Box>
          <Box className="flex flex-col pb-1 px-2 gap-2 sm:gap-0">
            <Skeleton />
          </Box>
        </Box>
      </Box>
    </Card>
  )
}

function AnimeTitle({ title, releaseAt, episodeTotal, averageEpisodeDuration }) {
  return (
    <>
      <Tooltip title={title} placement="top">
        <Typography 
          sx={{ 
            display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', 
            fontWeight: 'bold', fontSize: 'small', textAlign: 'center'
          }}
          className="overflow-hidden"
        >
          {title}
        </Typography>
      </Tooltip>
      <Typography sx={{ fontSize: 'small', textAlign: 'center' }}>
        {releaseAt && dayjs(releaseAt).format('MMM D, YYYY')}
        {(episodeTotal || averageEpisodeDuration) ? ' --- ' : ''}
        {episodeTotal ? `${episodeTotal} eps` : ''}
        {(episodeTotal && averageEpisodeDuration) ?  ', ' : ''}
        {averageEpisodeDuration ? `${Math.floor(averageEpisodeDuration / 60)} min` : ''}
      </Typography>
    </>
  )
}

function AnimeScore({ score, sx }) {
  return (
    <AnimeButton icon={Star} content={score} sx={{ ...sx }} />
  )
}