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
import { handleScroll } from "../../helper/handleScroll";
import filterAndSortAnime from "../../helper/filterAndSortAnime";

export default function Explore({ isDashboard=false }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md')) || isDashboard
  const location = useLocation()
  localStorage.setItem('lastPath', location.pathname)

  return (
    <Box className={`flex flex-col gap-5 $`}>
      <Typography variant="h2">Eksplorasi Judul Anime!</Typography>

      <AnimeExploreType isMobile={isMobile} isDashboard={isDashboard}/>
    </Box>
  )
}

function AnimeExploreType({ isMobile, isDashboard }) {
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
      element: <TopAnime isMobile={isMobile} isLoggedIn={isLoggedIn} isDashboard={isDashboard} />
    },
    {
      text: 'Musim Ini',
      icon: <Autorenew />,
      element: <CurrentSeason isMobile={isMobile} isLoggedIn={isLoggedIn} isDashboard={isDashboard} />
    },
    {
      text: 'Rekomendasi',
      icon: <Lightbulb />,
      element: <SuggestedAnime isMobile={isMobile} isLoggedIn={isLoggedIn} isDashboard={isDashboard} />
    },
    {
      text: 'Musiman',
      icon: <CalendarMonth />,
      element: <Seasons isMobile={isMobile} isLoggedIn={isLoggedIn} isDashboard={isDashboard} />
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

function TopAnime({ isMobile, isLoggedIn, isDashboard }) {
  // Component

  // State
  const [originalAnimes, setOriginalAnimes] = useState([]);
  const [filteredAnimes, setFilteredAnimes] = useState(Array(isMobile ? 3 : 12).fill(null));
  const [animes, setAnimes] = useState(Array(isMobile ? 3 : 12).fill(null));
  const [isLoading, setIsLoading] = useState(true);
  const limit = isMobile ? 10 : 30;
  const [offset, setOffset] = useState(limit);
  const [isLatest, setIsLatest] = useState(false);

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
        { text: 'Semua Anime', value: 'all' },
        { text: 'Sedang Tayang', value: 'airing' },
        { text: 'Segera Tayang', value: 'upcoming' },
        { text: 'TV Series Terbaik', value: 'tv' },
        { text: 'Film Terbaik', value: 'movie' },
        { text: 'OVA Terbaik', value: 'ova' },
        { text: 'ONA Terbaik', value: 'ona' },
        { text: 'Spesial Terbaik', value: 'special' },
        { text: 'Paling Populer', value: 'bypopularity' },
        { text: 'Paling Difavoritkan', value: 'favorite' },
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
  useEffect(() => {
    const fetchAnime = async () => {
      setIsLoading(true);

      const initialLimit = rankingType === 'upcoming' ? 128 : 500; // Upcoming cannot use limit 500
      const { data } = await getAnimeRanking(rankingType, initialLimit, 0);
      setOriginalAnimes(data.data);
    }
    
    fetchAnime();
  }, [isLoggedIn, rankingType]);

  // Sort and filter anime
  useEffect(() => {
    setOffset(limit);
    setIsLatest(false);
    setFilteredAnimes(filterAndSortAnime(originalAnimes, accessType, status, platformId));
  }, [originalAnimes, accessType, status, platformId]);

  // Limit and offset to display on user screen
  useEffect(() => {
    if (isLatest) return;
    setAnimes(filteredAnimes.slice(0, offset));
    if ((animes.length === filteredAnimes.length) || filteredAnimes.length <= limit || isDashboard) setIsLatest(true);
    setIsLoading(false);
  }, [filteredAnimes, offset]);

  // Get next anime list when user scrolling
  useEffect(() => {
    if (isLatest) return;

    const onScroll = () => handleScroll(setOffset, limit);

    window.addEventListener('scroll', onScroll);
    
    return () => window.removeEventListener('scroll', onScroll);
  }, [isLatest, limit]);

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

function CurrentSeason({ isMobile, isLoggedIn, isDashboard  }) {
  // Component

  // State
  const [originalAnimes, setOriginalAnimes] = useState([]);
  const [filteredAnimes, setFilteredAnimes] = useState(Array(isMobile ? 3 : 12).fill(null));
  const [animes, setAnimes] = useState(Array(isMobile ? 3 : 12).fill(null));
  const [isLoading, setIsLoading] = useState(true);
  const limit = isMobile ? 10 : 30;
  const [offset, setOffset] = useState(limit);
  const [isLatest, setIsLatest] = useState(false);

  // Form

  // Settings
  const { year, season } = getCurrentSeason()
  const { control, watch } = useForm({ 
    resolver: zodResolver(getSeasonalAnimeSchema), defaultValues: {
      sort: 'num_list_users', year, season,
      animeType: 'all',
      accessType: 'all',
      status: 'all',
      platform: 0
    }
  })

  // Watch input value changes
  const sort = watch('sort');
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
        { text: 'Anggota', value: 'num_list_users' },
        { text: 'Skor', value: 'mean' },
        { text: 'Tanggal rilis', value: 'start_date' },
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

  // Get all anime list
  useEffect(() => {
    const fetchAnime = async () => {
      setIsLoading(true);

      const { data } = await getSeasonalAnime(year, season, undefined, 500, 0);
      setOriginalAnimes(data.data);
    }
    
    fetchAnime();
  }, [isLoggedIn]);

  // Sort and filter anime
  useEffect(() => {
    const firstFilter = (animes) => {
      let newAnimes = [...animes]

      // Anime type filter
      if (animeType === 'new') {
        newAnimes = newAnimes.filter(anime =>
          anime.start_season?.season === season &&
          anime.start_season?.year === year
        );
      } else if (animeType === 'continue') {
        newAnimes = newAnimes.filter(anime =>
          anime.start_season?.season !== season ||
          anime.start_season?.year !== year
        );
      } else if (animeType !== 'all') {
        newAnimes = newAnimes.filter(anime =>
          anime.media_type === animeType
        );
      }

      // Anime sort
      if (sort === 'num_list_users') {
        newAnimes.sort((a, b) => {
          const aVal = a.num_list_users ?? 0;
          const bVal = b.num_list_users ?? 0;
          return bVal - aVal; // descending
        });
      } else if (sort === 'mean') {
        newAnimes.sort((a, b) => {
          const aVal = a.mean ?? 0;
          const bVal = b.mean ?? 0;
          return bVal - aVal; // descending
        });
      } else if (sort === 'start_date') {
        newAnimes.sort((a, b) => {
          if (!a.start_date) return 1;
          if (!b.start_date) return -1;
            
        });
      }

      // Filter for access type, user list status, and platform
      newAnimes = filterAndSortAnime(newAnimes, accessType, status, platformId); 
      return newAnimes;
    }

    setOffset(limit);
    setIsLatest(false);
    setFilteredAnimes(firstFilter(originalAnimes));
  }, [originalAnimes, animeType, sort, accessType, status, platformId]);

  // Limit and offset to display on user screen
  useEffect(() => {
    if (isLatest) return;
    setAnimes(filteredAnimes.slice(0, offset));
    if ((animes.length === filteredAnimes.length) || filteredAnimes.length <= limit || isDashboard) setIsLatest(true);
    setIsLoading(false);
  }, [filteredAnimes, offset]);

  // Get next anime list when user scrolling
  useEffect(() => {
    if (isLatest) return;

    const onScroll = () => handleScroll(setOffset, limit);

    window.addEventListener('scroll', onScroll);
    
    return () => window.removeEventListener('scroll', onScroll);
  }, [isLatest, limit]);

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

function Seasons({ isMobile, isLoggedIn, isDashboard }) {
  // Component

  // State
  const [originalAnimes, setOriginalAnimes] = useState([]);
  const [filteredAnimes, setFilteredAnimes] = useState(Array(isMobile ? 3 : 12).fill(null));
  const [animes, setAnimes] = useState(Array(isMobile ? 3 : 12).fill(null));
  const [isLoading, setIsLoading] = useState(true);
  const limit = isMobile ? 10 : 30;
  const [offset, setOffset] = useState(limit);
  const [isLatest, setIsLatest] = useState(false);

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
      sort: 'num_list_users', year: initialYear, season: initialSeason,
      animeType: 'new',
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
        { text: 'Anggota', value: 'num_list_users' },
        { text: 'Skor', value: 'mean' },
        { text: 'Tanggal rilis', value: 'start_date' },
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
  useEffect(() => {
    const fetchAnime = async () => {
      setIsLoading(true);

      const { data } = await getSeasonalAnime(year, season, undefined, 500, 0);
      setOriginalAnimes(data.data);
    }
    
    fetchAnime();
  }, [isLoggedIn, year, season]);

  // Sort and filter anime
  useEffect(() => {
    const firstFilter = (animes) => {
      let newAnimes = [...animes]

      // Anime type filter
      newAnimes = newAnimes.filter(anime =>
        anime.start_season?.season === season &&
        anime.start_season?.year === year
      );

      // Anime sort
      if (sort === 'num_list_users') {
        newAnimes.sort((a, b) => {
          const aVal = a.num_list_users ?? 0;
          const bVal = b.num_list_users ?? 0;
          return bVal - aVal; // descending
        });
      } else if (sort === 'mean') {
        newAnimes.sort((a, b) => {
          const aVal = a.mean ?? 0;
          const bVal = b.mean ?? 0;
          return bVal - aVal; // descending
        });
      } else if (sort === 'start_date') {
        newAnimes.sort((a, b) => {
          if (!a.start_date) return 1;
          if (!b.start_date) return -1;
          return dayjs(a.start_date).diff(dayjs(b.start_date)); // ascending
        });
      }

      // Filter for access type, user list status, and platform
      newAnimes = filterAndSortAnime(newAnimes, accessType, status, platformId); 
      return newAnimes;
    }

    setOffset(limit);
    setIsLatest(false);
    setFilteredAnimes(firstFilter(originalAnimes));
  }, [originalAnimes, sort, accessType, status, platformId]);

  // Limit and offset to display on user screen
  useEffect(() => {
    if (isLatest) return;
    setAnimes(filteredAnimes.slice(0, offset));
    if ((animes.length === filteredAnimes.length) || filteredAnimes.length <= limit || isDashboard) setIsLatest(true);
    setIsLoading(false);
  }, [filteredAnimes, offset]);

  // Get next anime list when user scrolling
  useEffect(() => {
    if (isLatest) return;

    const onScroll = () => handleScroll(setOffset, limit);

    window.addEventListener('scroll', onScroll);
    
    return () => window.removeEventListener('scroll', onScroll);
  }, [isLatest, limit]);

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

function SuggestedAnime({ isMobile, isLoggedIn, isDashboard }) {
  // Component

  // State
  const [originalAnimes, setOriginalAnimes] = useState([]);
  const [animes, setAnimes] = useState(Array(isMobile ? 3 : 12).fill(null));
  const [isLoading, setIsLoading] = useState(true);
  const limit = isMobile ? 10 : 30;
  const [offset, setOffset] = useState(limit);
  const [isLatest, setIsLatest] = useState(false);
  const [message, setMessage] = useState('');

  // Get anime recomendation
  useEffect(() => {
    const fetchAnime = async () => {
      setIsLoading(true);

      const { success, data, message } = await getSuggestedAnime(100);
      if (success) {
        setOriginalAnimes(data.data);
      } else {
        setMessage(message);
      }
    }
    
    fetchAnime();
  }, [isLoggedIn]);

  // Limit and offset to display on user screen
  useEffect(() => {
    console.log(animes);
    setAnimes(originalAnimes.slice(0, offset));
    if ((animes.length === originalAnimes.length) || originalAnimes.length <= limit || isDashboard) setIsLatest(true);
    setIsLoading(false);
  }, [originalAnimes, offset]);

  // Get next anime list when user scrolling
  useEffect(() => {
    if (isLatest) return;

    const onScroll = () => handleScroll(setOffset, limit);

    window.addEventListener('scroll', onScroll);
    
    return () => window.removeEventListener('scroll', onScroll);
  }, [isLatest, limit]);

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
        <AnimeList 
          animes={animes} isMobile={isMobile} isLoading={isLoading} 
          setAnimes={setOriginalAnimes} originalAnimes={originalAnimes} isLatest={isLatest} 
        />
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

// All anime explore function

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
        isLoading ?
        (Array(isMobile ? 3 : 12).fill(null).map((_,index) => (
          <ListItem key={index} disablePadding className={`${ !isMobile && 'md:max-w-[47%] lg:max-w-[30%]'}`}>
            <AnimeSkeleton />
          </ListItem>
        ))) :

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
        )))
      }
      {
        !isLatest ?
        (Array(
          isMobile ? 1 : (3 - (animes.length % 3) + (animes.length > 3 ? 0 : 3))
        ).fill(null).map((_,index) => (
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