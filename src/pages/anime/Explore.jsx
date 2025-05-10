import { Autorenew, CalendarMonth, EmojiEvents, Lightbulb, Login, Star } from "@mui/icons-material";
import { Box, Card, List, ListItem, Tab, Tabs, Tooltip, Typography, useTheme, useMediaQuery, Skeleton, Collapse, FormControl, InputLabel, Select, MenuItem, Container } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import AnimeImage from "../../component/AnimeImage";
import Link from "../../component/Link";
import AnimeButton from "../../component/AnimeButton";
import AnimePlatform from "../../component/AnimePlatform";
import SortAndFilter from "../../component/SortAndFilter";
import CustomTabPanel from "../../component/CustomTabPanel";
import dayjs from "dayjs";
import { getAnimeRanking, getSeasonalAnime, getSuggestedAnime } from "../../services/mal.service";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { oneAccessType, oneAnimeStatus, ranking_type, sortAnime, status } from "../../validators/index.validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppContext } from "../../context/AppContext";
import { useLocation } from "react-router-dom";
import { getAnimeRankingSchema, getSeasonalAnimeSchema } from "../../validators/mal.validator";
import getCurrentSeason from "../../helper/getCurrentSeason";
import ButtonLink from "../../component/ButtonLink";

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

  const [animes, setAnimes] = useState(Array(50).fill(null))
  const [isLoading, setIsLoading] = useState(true)

  // Form

  // Settings
  const { control, watch } = useForm({ 
    resolver: zodResolver(getAnimeRankingSchema), defaultValues: {
      rankingType: 'all',
      accessType: '',
      status: '',
      platform: ''
    }
  })

  // Watch input value changes
  const rankingType = watch('rankingType')

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
        { text: 'Tersedia gratis', value: 'free' },
        { text: 'Waktu terbatas', value: 'limited_time' },
        { text: 'Wajib berlangganan', value: 'subscription' },
      ]
    },
    {
      name: 'List Saya',
      id: 'status',
      isMultiple: true,
      menus: [
        { text: 'Berjalan', value: 'watching' },
        { text: 'Selesai', value: 'completed' },
        { text: 'Ditunda', value: 'on_hold' },
        { text: 'Ditinggalkan', value: 'dropped' },
        { text: 'Direncanakan', value: 'plan_to_watch' },
      ]
    },
    {
      name: 'Platform',
      id: 'platform',
      isMultiple: true,
      menus: [
        { text: 'Muse - YouTube' },
        { text: 'AniOne - YouTube' },
        { text: 'Bstation' },
        { text: 'Netflix' },
        { text: 'Catchplay+' },
        { text: 'Crunchyroll' },
      ]
    },
  ]

  // Get anime ranking list based on select value
  useEffect(() => {
    const getAnime = async () => {
      const { data } = await getAnimeRanking(rankingType)
      setAnimes(data.data)
      setIsLoading(false)
    }
    setIsLoading(true)
    getAnime()
  }, [rankingType, isLoggedIn])

  return (
    <AnimeWrapper>
      <SortAndFilter filterAndSort={filterAndSort} control={control} disabled={isLoading} />
      <AnimeList animes={animes} isMobile={isMobile} isLoading={isLoading} />
    </AnimeWrapper>
  )
}

function CurrentSeason({ isMobile, isLoggedIn  }) {
  // Component

  const [animes, setAnimes] = useState(Array(50).fill(null))
  const [isLoading, setIsLoading] = useState(true)

  // Form

  // Settings
  const { year, season } = getCurrentSeason()
  const { control, watch } = useForm({ 
    resolver: zodResolver(getSeasonalAnimeSchema), defaultValues: {
      sort: 'anime_score', year, season,
      animeType: '', 
      accessType: '',
      status: '',
      platform: ''
    }
  })

  // Watch input value changes
  const sort = watch('sort')

  // Menu item
  const filterAndSort = [
    {
      name: 'Jenis Anime',
      id: 'animeType',
      isMultiple: false,
      menus: [
        { text: 'Semua' },
        { text: 'TV' },
        { text: 'ONA' },
        { text: 'OVA' },
        { text: 'Movie' },
        { text: 'Special' },
      ]
    },
    {
      name: 'Urutan',
      id: 'sort',
      isMultiple: false,
      menus: [
        { text: 'Skor', value: 'anime_score' },
        { text: 'Anggota', value: 'anime_num_list_users' },
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
        { text: 'Tersedia gratis', value: 'free' },
        { text: 'Waktu terbatas', value: 'limited_time' },
        { text: 'Wajib berlangganan', value: 'subscription' },
      ]
    },
    {
      name: 'List Saya',
      id: 'status',
      isMultiple: true,
      menus: [
        { text: 'Berjalan', value: 'watching' },
        { text: 'Selesai', value: 'completed' },
        { text: 'Ditunda', value: 'on_hold' },
        { text: 'Ditinggalkan', value: 'dropped' },
        { text: 'Direncanakan', value: 'plan_to_watch' },
      ]
    },
    {
      name: 'Platform',
      id: 'platform',
      isMultiple: true,
      menus: [
        { text: 'Muse - YouTube' },
        { text: 'AniOne - YouTube' },
        { text: 'Bstation' },
        { text: 'Netflix' },
        { text: 'Catchplay+' },
        { text: 'Crunchyroll' },
      ]
    },
  ]

  // Get anime list of current season
  useEffect(() => {
    const getAnime = async () => {
      const { data } = await getSeasonalAnime(year, season, sort)
      setAnimes(data.data)
      setIsLoading(false)
    }
    setIsLoading(true)
    getAnime()
  }, [sort, isLoggedIn])

  return (
    <AnimeWrapper>
      <SortAndFilter filterAndSort={filterAndSort} control={control} disabled={isLoading} />
      <AnimeList animes={animes} isMobile={isMobile} isLoading={isLoading} />
    </AnimeWrapper>
  )
}

function Seasons({ isMobile, isLoggedIn }) {
  // Component

  // State
  const [animes, setAnimes] = useState(Array(50).fill(null))
  const [isLoading, setIsLoading] = useState(true)

  // Generate 1917 until this year
  const earlyYear = 1917;
  const lastYear = dayjs().get('year') + 1; // +1 for next year season
  const years = Array(lastYear-earlyYear+1).fill().map((_, i) => {
    return {
      text: (lastYear - i).toString()
    }
  })

  // Form

  // Settings
  const { year: initialYear, season: initialSeason } = getCurrentSeason()
  const { control, watch } = useForm({
    resolver: zodResolver(getSeasonalAnimeSchema), defaultValues: {
      sort: 'anime_score', year: initialYear, season: initialSeason,
      animeType: '', 
      accessType: '',
      status: '',
      platform: ''
    }
  })

  // Watch input value changes
  const sort = watch('sort')
  const year = watch('year')
  const season = watch('season')

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
        { text: 'Skor', value: 'anime_score' },
        { text: 'Anggota', value: 'anime_num_list_users' },
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
        { text: 'Tersedia gratis' },
        { text: 'Waktu terbatas' },
        { text: 'Wajib berlangganan' },
      ]
    },
    {
      name: 'List Saya',
      id: 'status',
      isMultiple: true,
      menus: [
        { text: 'Berjalan' },
        { text: 'Selesai' },
        { text: 'Ditunda' },
        { text: 'Ditinggalkan' },
        { text: 'Direncanakan' },
      ]
    },
    {
      name: 'Platform',
      id: 'platform',
      isMultiple: true,
      menus: [
        { text: 'Muse - YouTube' },
        { text: 'AniOne - YouTube' },
        { text: 'Bstation' },
        { text: 'Netflix' },
        { text: 'Catchplay+' },
        { text: 'Crunchyroll' },
      ]
    },
  ]

  // Get anime list of selected season
  useEffect(() => {
    const getAnime = async () => {
      const { data } = await getSeasonalAnime(year, season, sort)
      setAnimes(data.data)
      setIsLoading(false)
    }
    setIsLoading(true)
    getAnime()
  }, [sort, year, season, isLoggedIn])

  return (
    <AnimeWrapper>
      <SortAndFilter filterAndSort={filterAndSort} control={control} disabled={isLoading} />
      <AnimeList animes={animes} isMobile={isMobile} isLoading={isLoading} />
    </AnimeWrapper>
  )
}

function SuggestedAnime({ isMobile, isLoggedIn }) {
  // Component

  // State
  const [animes, setAnimes] = useState(Array(50).fill(null));
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Get anime list of selected season
  useEffect(() => {
    const getAnime = async () => {
      const { data, success, message } = await getSuggestedAnime()
      if (success) {
        setAnimes(data.data)
        setIsLoading(false)
      } else {
        setMessage(message)
      }
    }
    setIsLoading(true)
    getAnime()
  }, [isLoggedIn])

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
        <AnimeList animes={animes} isMobile={isMobile} isLoading={isLoading} />
      }
    </AnimeWrapper>
  )
}

function AnimeWrapper({ children }) {
  return (
    <Box className="flex flex-col px-1 gap-2.5">
      {children}
    </Box>
  )
}

// List anime item

function AnimeList({ animes, isMobile, isLoading  }) {
  return (
    <List disablePadding className={`flex flex-col gap-5 ${ !isMobile && 'flex-row flex-wrap justify-center'}`}>
      {animes.map((anime, index) => (
        <ListItem key={index} disablePadding className={`${ !isMobile && 'md:max-w-[47%] lg:max-w-[30%]'}`}>
          {isLoading ? 
            <AnimeSkeleton /> :
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
                    anime={anime}
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
            </Card>
          }
        </ListItem>
      ))}
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