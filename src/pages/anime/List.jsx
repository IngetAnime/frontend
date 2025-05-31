import { Box, Card, LinearProgress, List as MuiList, ListItem, Tab, Tabs, Tooltip, Typography, useTheme, useMediaQuery, IconButton, Container, Skeleton, Button } from "@mui/material";
import { Add, CalendarToday, Edit, EditCalendar, EventAvailable, EventBusy, EventNote, EventRepeat, Login, RestartAlt } from "@mui/icons-material";
import { useContext, useEffect, useState } from "react";
import SortAndFilter from "../../component/SortAndFilter";
import CustomTabPanel from "../../component/CustomTabPanel";
import AnimeImage from "../../component/AnimeImage";
import AnimePlatform from "../../component/AnimePlatform";
import AnimeButton from "../../component/AnimeButton";
import AnimeEdit from "../../component/AnimeEdit";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAllAnimeList, updateAnimeList } from "../../services/animeList.service";
import { AppContext } from "../../context/AppContext";
import ButtonLink from "../../component/ButtonLink";
import { usePlatforms } from "../../hooks/usePlatforms";
import { getAllAnimeListSchema } from "../../validators/animeList.validator";
import dayjs from "dayjs";
import { handleScroll } from "../../helper/handleScroll";
import filterAndSortAnime from "../../helper/filterAndSortAnime";
import { useLocation } from "react-router-dom";

export default function List({ isDashboard=false }) {
  // Component 

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md')) || isDashboard
  const location = useLocation()
  localStorage.setItem('lastPath', location.pathname)
  const lastAnimeList = parseInt(localStorage.getItem('lastAnimeList')) || 0;
  const [value, setValue] = useState(lastAnimeList);
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
    localStorage.setItem('lastAnimeList', newValue)
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  // Form

  const { isLoggedIn } = useContext(AppContext);
  const [orginalAnimes, setOriginalAnimes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Get user anime list
  useEffect(() => {
    const fetchAnime = async () => {
      setIsLoading(true);

      const { success, data, message } = await getAllAnimeList();
      if (success) {
        const fetchedAnime = data.map((list) => {
          let { anime, ...myListStatus } = { ...list };
          return { ...anime, myListStatus };
        });
        
        setOriginalAnimes([ ...fetchedAnime ]);
      } else {
        setMessage(message);
      }

      setIsLoading(false)
    }

    fetchAnime();
  }, [isLoggedIn])
  
  const menu = [
    {
      text: 'Semua',
      icon: <CalendarToday />,
      element: 
        <All>
          {(form, sortMenu) => (
            <CustomTab 
              isMobile={isMobile} isLoading={isLoading} isDashboard={isDashboard} status={'all'}
              rootAnimes={orginalAnimes} setRootAnimes={setOriginalAnimes} form={form} sortMenu={sortMenu}
            />
          )}
        </All>
    },
    { 
      text: 'Berjalan',
      icon: <EventNote />,
      element: 
      <Watching
        >
          {(form, sortMenu) => (
            <CustomTab 
              isMobile={isMobile} isLoading={isLoading} isDashboard={isDashboard} status={'watching'}
              rootAnimes={orginalAnimes} setRootAnimes={setOriginalAnimes} form={form} sortMenu={sortMenu}
            />
          )}
        </Watching>
    },
    { 
      text: 'Selesai',
      icon: <EventAvailable />,
      element: 
        <Completed>
          {(form, sortMenu) => (
            <CustomTab 
              isMobile={isMobile} isLoading={isLoading} isDashboard={isDashboard} status={'completed'}
              rootAnimes={orginalAnimes} setRootAnimes={setOriginalAnimes} form={form} sortMenu={sortMenu}
            />
          )}
        </Completed>
    },
    { 
      text: 'Ditunda',
      icon: <EventRepeat />,
      element: 
        <OnHold>
          {(form, sortMenu) => (
            <CustomTab 
              isMobile={isMobile} isLoading={isLoading} isDashboard={isDashboard} status={'on_hold'}
              rootAnimes={orginalAnimes} setRootAnimes={setOriginalAnimes} form={form} sortMenu={sortMenu}
            />
          )}
        </OnHold>
    },
    { 
      text: 'Ditinggalkan',
      icon: <EventBusy />,
      element: 
        <Dropped>
          {(form, sortMenu) => (
            <CustomTab 
              isMobile={isMobile} isLoading={isLoading} isDashboard={isDashboard} status={'dropped'}
              rootAnimes={orginalAnimes} setRootAnimes={setOriginalAnimes} form={form} sortMenu={sortMenu}
            />
          )}
        </Dropped>
    },
    { 
      text: 'Direncanakan',
      icon: <EditCalendar />,
      element: 
        <PlanToWatch>
          {(form, sortMenu) => (
            <CustomTab 
              isMobile={isMobile} isLoading={isLoading} isDashboard={isDashboard} status={'plan_to_watch'}
              rootAnimes={orginalAnimes} setRootAnimes={setOriginalAnimes} form={form} sortMenu={sortMenu}
            />
          )}
        </PlanToWatch>
    },
  ]

  return (
    <Box className="flex flex-col gap-4">
      <Typography variant="h2">Kelola dan Simpan Anime!</Typography>
      <Tabs value={value} onChange={handleChange}>
        {menu.map((menu, i) => (
          <Tab 
            key={i} 
            label={
              <Typography fontSize={'small'} fontWeight={'bold'} className="flex items-center gap-1">
                {menu.icon}{menu.text}
              </Typography>
            }
            {...a11yProps(i)} 
          />
        ))}
      </Tabs>
      
      <Box className="flex flex-col px-1 gap-2.5">
        {menu.map((menu, i) => (
          <CustomTabPanel value={value} key={i} index={i}>
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
                  List Anime <br /> Tidak Ditemukan
                </Typography>
                <Typography variant="subtitle1">{message}</Typography>
                {
                  !isLoggedIn &&
                  <ButtonLink variant="contained" endIcon={<Login />} to={'/auth'} className="w-full sm:w-fit" sx={{ mt: 5 }}>
                    Masuk
                  </ButtonLink>
                }
              </Container> :
              menu.element
            }
          </CustomTabPanel>
        ))}
      </Box>
    </Box>
  )
}

function CustomTab({ isMobile, isDashboard, isLoading, rootAnimes, setRootAnimes, status, form, sortMenu }) {
  // State
  const [originalAnimes, setOriginalAnimes] = useState([]);
  const [filteredAnimes, setFilteredAnimes] = useState(Array(isMobile ? 3 : 12).fill(null));
  const [animes, setAnimes] = useState(Array(isMobile ? 3 : 12).fill(null));
  const [isSort, setIsSort] = useState(true);
  const limit = isMobile ? 10 : 30;
  const [offset, setOffset] = useState(limit);
  const [isLatest, setIsLatest] = useState(false);

  // Settings
  const { control, watch, reset } = form;

  // Watch input value
  const sort = watch('sort');
  const accessType = watch('accessType');
  const platform = watch('platform');

  // Update if root anime have update, for example if user logout
  useEffect(() => {
    setOriginalAnimes(filterAndSortAnime(rootAnimes, 'all', status, 0))
  }, [rootAnimes]) // Store for clean data

  // Filter and sort data
  useEffect(() => {
    setIsSort(true);
    setOffset(limit);
    setIsLatest(false);
    setFilteredAnimes(sortAndFilterList(originalAnimes, sort, accessType, platform));
  }, [originalAnimes, sort, accessType, platform])

  // Limit and offset to display on user screen
  useEffect(() => {
    if (isLatest) return;
    setAnimes(filteredAnimes.slice(0, offset));
    if ((animes.length === filteredAnimes.length) || filteredAnimes.length <= limit || isDashboard) setIsLatest(true);
    setIsSort(false);
  }, [filteredAnimes, offset]);

  // Get next anime list when user scrolling
  useEffect(() => {
    if (isLatest) return;

    const onScroll = () => handleScroll(setOffset, limit);

    window.addEventListener('scroll', onScroll);
    
    return () => window.removeEventListener('scroll', onScroll);
  }, [isLatest, limit]);

  return (
    <>
      <SortAndFilter filterAndSort={sortMenu} control={control} disabled={isLoading || isSort} />
      <AnimeList
        animes={animes} isMobile={isMobile} isLoading={isLoading || isSort}
        originalAnimes={rootAnimes} setAnimes={setRootAnimes} isLatest={isLatest} reset={reset}
      />
    </>
  )
}

function All({ children }) {
  // Settings
  const form = useForm({
    resolver: zodResolver(getAllAnimeListSchema), defaultValues: {
      sort: 'status',
      accessType: 'all',
      platform: 0
    }
  });

  // Menu items
  const platformItems = usePlatforms();
  const sortMenu = [
    {
      name: 'Urutan',
      id: 'sort',
      isMultiple: false,
      menus: [
        { text: 'Status', value: 'status'},
        { text: 'Skor', value: 'score' },
        { text: 'Tanggal rilis', value: 'start_date' },
        { text: 'Terakhir diubah', value: 'last_updated' },
        { text: 'Judul', value: 'title' },
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
      name: 'Platform',
      id: 'platform',
      isMultiple: true,
      menus: [
        ...platformItems,
      ]
    },
  ]

  return (
    children(form, sortMenu)
  )
}

function Watching({ children }) {
  // Settings
  const form = useForm({
    resolver: zodResolver(getAllAnimeListSchema), defaultValues: {
      sort: 'remaining_watchable_episodes',
      accessType: 'all',
      platform: 0
    }
  });
  
  const platformItems = usePlatforms();
  const sortMenu = [
    {
      name: 'Urutan',
      id: 'sort',
      isMultiple: false,
      menus: [
        { text: 'Skor', value: 'score' },
        { text: 'Tanggal rilis', value: 'start_date' },
        { text: 'Terakhir diubah', value: 'last_updated' },
        { text: 'Judul', value: 'title' },
        { text: 'Belum ditonton', value: 'remaining_watchable_episodes'},
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
      name: 'Platform',
      id: 'platform',
      isMultiple: true,
      menus: [
        ...platformItems,
      ]
    },
  ]

  return (
    children(form, sortMenu)
  )
}

function Completed({ children }) {
  // Settings
  const form = useForm({
    resolver: zodResolver(getAllAnimeListSchema), defaultValues: {
      sort: 'score',
      accessType: 'all',
      platform: 0
    }
  });
  
  const platformItems = usePlatforms();
  const sortMenu = [
    {
      name: 'Urutan',
      id: 'sort',
      isMultiple: false,
      menus: [
        { text: 'Skor', value: 'score' },
        { text: 'Tanggal rilis', value: 'start_date' },
        { text: 'Terakhir diubah', value: 'last_updated' },
        { text: 'Judul', value: 'title' },
        { text: 'Belum ditonton', value: 'remaining_watchable_episodes'},
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
      name: 'Platform',
      id: 'platform',
      isMultiple: true,
      menus: [
        ...platformItems,
      ]
    },
  ]

  return (
    children(form, sortMenu)
  )
}

function OnHold({ children }) {
  // Settings
  const form = useForm({
    resolver: zodResolver(getAllAnimeListSchema), defaultValues: {
      sort: 'start_date',
      accessType: 'all',
      platform: 0
    }
  });
  
  const platformItems = usePlatforms();
  const sortMenu = [
    {
      name: 'Urutan',
      id: 'sort',
      isMultiple: false,
      menus: [
        { text: 'Skor', value: 'score' },
        { text: 'Tanggal rilis', value: 'start_date' },
        { text: 'Terakhir diubah', value: 'last_updated' },
        { text: 'Judul', value: 'title' },
        { text: 'Belum ditonton', value: 'remaining_watchable_episodes'},
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
      name: 'Platform',
      id: 'platform',
      isMultiple: true,
      menus: [
        ...platformItems,
      ]
    },
  ]

  return (
    children(form, sortMenu)
  )
}

function Dropped({ children }) {
  // Settings
  const form = useForm({
    resolver: zodResolver(getAllAnimeListSchema), defaultValues: {
      sort: 'title',
      accessType: 'all',
      platform: 0
    }
  });
  
  const platformItems = usePlatforms();
  const sortMenu = [
    {
      name: 'Urutan',
      id: 'sort',
      isMultiple: false,
      menus: [
        { text: 'Skor', value: 'score' },
        { text: 'Tanggal rilis', value: 'start_date' },
        { text: 'Terakhir diubah', value: 'last_updated' },
        { text: 'Judul', value: 'title' },
        { text: 'Belum ditonton', value: 'remaining_watchable_episodes'},
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
      name: 'Platform',
      id: 'platform',
      isMultiple: true,
      menus: [
        ...platformItems,
      ]
    },
  ]

  return (
    children(form, sortMenu)
  )
}

function PlanToWatch({ children }) {
  // Settings
  const form = useForm({
    resolver: zodResolver(getAllAnimeListSchema), defaultValues: {
      sort: 'last_updated',
      accessType: 'all',
      platform: 0
    }
  });
  
  const platformItems = usePlatforms();
  const sortMenu = [
    {
      name: 'Urutan',
      id: 'sort',
      isMultiple: false,
      menus: [
        { text: 'Skor', value: 'score' },
        { text: 'Tanggal rilis', value: 'start_date' },
        { text: 'Terakhir diubah', value: 'last_updated' },
        { text: 'Judul', value: 'title' },
        { text: 'Belum ditonton', value: 'remaining_watchable_episodes'},
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
      name: 'Platform',
      id: 'platform',
      isMultiple: true,
      menus: [
        ...platformItems,
      ]
    },
  ]

  return (
    children(form, sortMenu)
  )
}

function AnimeList({ animes, isMobile, originalAnimes, setAnimes, isLoading, isLatest, reset }) {
  const setAnime = (newAnime) => {
    const newAnimes = originalAnimes.map(anime => {
      if (anime.id === newAnime.id) {
        return { ...anime, ...newAnime }
      }
      return anime
    })
    setAnimes(newAnimes)
  }

  return animes.length ?
    (<MuiList 
      disablePadding sx={{ py: '1rem' }}
      className={`flex flex-col gap-5 ${ !isMobile && 'flex-row flex-wrap justify-center'}`}>
      {
        isLoading ?
        (Array(isMobile ? 3 : 12).fill(null).map((_,i) => (
          <ListItem disablePadding key={i} className={`${ !isMobile && 'md:max-w-[47%] lg:max-w-[30%]'}`}>
            <AnimeSkeleton />
          </ListItem>
        ))):
        
        (animes.map((anime, i) => {
          return (
            <ListItem disablePadding key={i} className={`${ !isMobile && 'md:max-w-[47%] lg:max-w-[30%]'}`}>
              {
                anime ? 
                <Card className="flex overflow-hidden h-41 w-full">
                  <Box className="w-25 sm:w-30 h-full">
                    <AnimeImage 
                      anime={anime}
                      setAnime={setAnime}
                      episodeAired={anime.status === 'finished_airing' ? anime.episodeTotal : anime.platforms[0]?.episodeAired} 
                    />
                  </Box>
      
                  <Box className="flex flex-col justify-between py-1 px-2 flex-1">
                    <Box className="flex flex-col gap-5">
                      <AnimeTitle anime={anime} />
                      <AnimeProgress anime={anime} setAnime={setAnime} />
                    </Box>
                    <AnimePlatform platforms={anime.platforms} />
                  </Box>
                </Card> :
                <AnimeSkeleton />
              }
            </ListItem>
          )
        }))
      }
      {
        !isLatest ? 
        Array(
          isMobile ? 1 : (3 - (animes.length % 3))
        ).fill(null).map((_,index) => (
          <ListItem key={index} disablePadding className={`${ !isMobile && 'md:max-w-[47%] lg:max-w-[30%]'}`}>
            <AnimeSkeleton />
          </ListItem>
        )) : <></>
      }
    </MuiList>) :
    (<Container>
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
    </Container>)
}

function AnimeTitle({ anime }) {
  // Get anime season
  const releaseAt = anime.releaseAt ? dayjs(anime.releaseAt) : undefined;
  const year = releaseAt ? releaseAt.year() : undefined;
  const month = releaseAt ? releaseAt.month() : undefined;
  let season;
  if (releaseAt) {
    if (month >= 0 && month <= 2) {
      season = 'Winter';
    } else if (month >= 3 && month <= 5) {
      season = 'Spring';
    } else if (month >= 6 && month <= 8) {
      season = 'Summer';
    } else {
      season = 'Fall';
    }
  }

  return (
    <Tooltip title={anime.title} placement={'top'}>
      <Typography 
        sx={{ 
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', 
          fontWeight: 'bold', fontSize: 'small',
        }}
        className="overflow-hidden"
      >
        {anime.title}
      </Typography>
      <Typography fontSize={'small'}>{releaseAt ? `${season} ${year}` : ''}</Typography>
    </Tooltip>
  )
}

function AnimeProgress({ anime, setAnime }) {
  const range = anime.episodeTotal ? 100 / anime.episodeTotal : 0;
  const [episodes, setEpisodes] = useState(anime.myListStatus.progress);
  const [value, setValue] = useState(range ? range * anime.myListStatus.progress : 50);
  const [isLoading, setIsLoading] = useState(false);

  // Episodes count updated when anime change
  useEffect(() => {
    setEpisodes(anime.myListStatus.progress);
    if (range) {
      setValue(range * anime.myListStatus.progress);
    } else {
      setValue(50);
    }
  }, [anime])

  async function handleValue(e) {
    setIsLoading(true);

    e.preventDefault();
    if (episodes >= anime.episodeTotal && anime.episodeTotal > 0) return;
    await updateAnimeList(anime.id, undefined, undefined, undefined, episodes + 1);
    anime.myListStatus.progress += 1;
    setAnime(anime);

    setIsLoading(false);
  }

  const [isOpen, setIsOpen] = useState(false)
  function handleIsOpen() {
    setIsOpen(!isOpen)
  }

  return (
    <Box className="flex flex-col gap-1 items-end relative">
      <Box className="absolute -top-1 -translate-y-full flex items-center gap-1">
        <IconButton size="small" onClick={handleIsOpen}><Edit fontSize="small"/></IconButton>
        <AnimeButton onClick={(e) => handleValue(e)} icon={Add} disabled={isLoading}></AnimeButton>
      </Box>
      <LinearProgress variant="determinate" value={value} className="w-full"/>
      <Typography fontSize={'small'}>{episodes} / {`${anime.episodeTotal || '?'}`} ep</Typography>

      <AnimeEdit isOpen={isOpen} handleClick={handleIsOpen} anime={anime} setAnime={setAnime} />
    </Box>
  )
}

function AnimeSkeleton() {
  return (
    <Card className="flex overflow-hidden h-41 w-full">
      <Box className="w-25 sm:w-30 h-full">
        <Skeleton className="w-full" variant="rectangular" height={'100%'}/>
      </Box>
      <Box className="flex flex-col justify-between py-1 px-2 flex-1">
        <Box className="flex flex-col gap-5">
          <Box>
            <Skeleton variant="text" sx={{ fontSize: 'small' }}/>
            <Skeleton variant="text" className="w-20"  sx={{ fontSize: 'small' }}/>
          </Box>
          <Box>
            <Skeleton variant="rectangular" height={'0.25rem'}/>
          </Box>
        </Box>
        <Box className="flex gap-2">
          <Skeleton className="w-8" variant="rounded" sx={{ height: '1.75rem' }}/>
          <Skeleton className="w-8" variant="rounded" sx={{ height: '1.75rem' }}/>
        </Box>
      </Box>
    </Card>
  )
}

const sortAndFilterList = (animes, sort, accessType, platform) => {
  let newAnimes = [...animes];

  // Sort
  if (sort === 'status') {
    const statusOrder = {
      watching: 0,
      completed: 1,
      on_hold: 2,
      dropped: 3,
      plan_to_watch: 4
    }
    newAnimes = newAnimes.sort((a, b) => statusOrder[a.myListStatus.status] - statusOrder[b.myListStatus.status]);
  } else if (sort === 'score') {
    newAnimes = newAnimes.sort((a, b) => {
      const aVal = a.myListStatus.score ?? 0;
      const bVal = b.myListStatus.score ?? 0;
      return bVal - aVal; // descending
    })
  } else if (sort === 'start_date') {
    newAnimes = newAnimes.sort((a, b) => {
      if (!a.releaseAt) return 1;
      if (!b.releaseAt) return -1;
      return dayjs(b.releaseAt).diff(dayjs(a.releaseAt)); // descending
    });
  } else if (sort === 'last_updated') {
    newAnimes = newAnimes.sort((a, b) => {
      if (!a.myListStatus.updatedAt) return 1;
      if (!b.myListStatus.updatedAt) return -1;
      return dayjs(b.myListStatus.updatedAt).diff(dayjs(a.myListStatus.updatedAt)); // descending
    });
  } else if (sort === 'title') {
    newAnimes = newAnimes.sort((a, b) => {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();
      if (titleA < titleB) return -1; // acsending
      else if (titleA > titleB) return 1;
      else return 0;
    });
  } else if (sort === 'remaining_watchable_episodes') {
    newAnimes.sort((a, b) => {
      const aVal = a.myListStatus.remainingWatchableEpisodes ?? 0;
      const bVal = b.myListStatus.remainingWatchableEpisodes ?? 0;
      return bVal - aVal; // descending
    })
  }

  newAnimes = filterAndSortAnime(newAnimes, accessType, 'all', platform);

  return newAnimes;
}