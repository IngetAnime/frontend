import { Box, Card, LinearProgress, List as MuiList, ListItem, Tab, Tabs, Tooltip, Typography, useTheme, useMediaQuery, IconButton } from "@mui/material";
import { Add, Edit, EditCalendar, EventAvailable, EventBusy, EventNote, EventRepeat } from "@mui/icons-material";
import { useState } from "react";
import SortAndFilter from "../../component/SortAndFilter";
import CustomTabPanel from "../../component/CustomTabPanel";
import AnimeImage from "../../component/AnimeImage";
import AnimePlatform from "../../component/AnimePlatform";
import AnimeButton from "../../component/AnimeButton";
import AnimeEdit from "../../component/AnimeEdit";

export default function List({ isDashboard=false }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md')) || isDashboard

  const anime = Array(15).fill(
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
  )

  const [value, setValue] = useState(0);

  const menu = [
    { 
      text: 'Berjalan',
      icon: <EventNote />
    },
    { 
      text: 'Selesai',
      icon: <EventAvailable />
    },
    { 
      text: 'Ditunda',
      icon: <EventRepeat />
    },
    { 
      text: 'Ditinggalkan',
      icon: <EventBusy />
    },
    { 
      text: 'Direncanakan',
      icon: <EditCalendar />
    },
  ]

  const sortMenu = [
    {
      name: 'Urutan',
      isMultiple: false,
      menus: [
        { text: 'Judul' },
        { text: 'Skor' },
        { text: 'Episode ditonton' },
        { text: 'Tanggal rilis' },
        { text: 'Terakhir diubah' },
      ]
    },
    {
      name: 'Platform',
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
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

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
        <SortAndFilter sortAndFilter={sortMenu} />
        
        {menu.map((menu, i) => (
          <CustomTabPanel value={value} index={i} key={i}>
            <AnimeList animes={anime} isMobile={isMobile} />
          </CustomTabPanel>
        ))}
      </Box>
    </Box>
  )
}

function AnimeList({ animes, isMobile }) {
  return (
    <MuiList disablePadding className={`flex flex-col gap-5 ${ !isMobile && 'flex-row flex-wrap justify-center'}`}>
      {animes.map((anime, i) => (
        <ListItem disablePadding key={i} className={`${ !isMobile && 'md:max-w-[47%] lg:max-w-[30%]'}`}>
          <Card className="flex overflow-hidden h-41 w-full">
            <Box className="w-25 sm:w-30 h-full">
              <AnimeImage 
                picture={anime.picture} 
                title={anime.title} 
                episodeAired={anime.mainPlatform.episodeAired} 
                progress={anime.myListStatus.progress} 
              />
            </Box>

            <Box className="flex flex-col justify-between py-1 px-2 flex-1">
              <Box className="flex flex-col gap-5">
                <AnimeTitle title={anime.title} />
                <AnimeProgress />
              </Box>
              <AnimePlatform platforms={anime.platforms} />
            </Box>
          </Card>
        </ListItem>
      ))}
    </MuiList>
  )
}

function AnimeTitle({ title }) {
  return (
    <Tooltip title={title} placement={'top'}>
      <Typography 
        sx={{ 
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', 
          fontWeight: 'bold', fontSize: 'small',
        }}
        className="overflow-hidden"
      >
        {title}
      </Typography>
      <Typography fontSize={'small'}>TV, Spring 2025</Typography>
    </Tooltip>
  )
}

function AnimeProgress() {
  const episodeTotal = 12
  const range = 100 / episodeTotal
  const [value, setValue] = useState(range)

  function handleValue() {
    const currentEpisode = Math.round(value / range);
    if (currentEpisode < episodeTotal)
    setValue(range * (currentEpisode + 1))
  }

  const [isOpen, setIsOpen] = useState(false)
  function handleIsOpen() {
    setIsOpen(!isOpen)
  }

  return (
    <Box className="flex flex-col gap-1 items-end relative">
      <Box className="absolute -top-1 -translate-y-full flex items-center gap-1">
        <IconButton size="small" onClick={handleIsOpen}><Edit fontSize="small"/></IconButton>
        <AnimeButton onClick={handleValue} icon={Add}></AnimeButton>
      </Box>
      <LinearProgress variant="determinate" value={value} className="w-full"/>
      <Typography fontSize={'small'}>{Math.round(value / range)} / {episodeTotal} ep</Typography>

      <AnimeEdit isOpen={isOpen} handleClick={handleIsOpen} />
    </Box>
  )
}