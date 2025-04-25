import { Autorenew, CalendarMonth, EmojiEvents, KeyboardArrowDown, KeyboardArrowUp, Lightbulb, Star } from "@mui/icons-material";
import { Box, Button, Card, Collapse, FormControl, Icon, IconButton, InputLabel, List, ListItem, ListItemIcon, Menu, MenuItem, MenuList, Select, Tab, Tabs, tabsClasses, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import AnimeImage from "./AnimeImage";
import Link from "./Link";
import AnimeButton from "./AnimeButton";
import AnimePlatform from "./AnimePlatform";
import dayjs from "dayjs";

export default function AnimeExplore() {
  return (
    <Box className="flex flex-col gap-5">
      <Typography variant="h2">Eksplorasi Judul Anime!</Typography>

      <AnimeExploreType />
    </Box>
  )
}

function AnimeExploreType() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <Box
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        className="w-full min-h-[75vh]"
        {...other}
      >
        {value === index && children}
      </Box>
    );
  }

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const animeExploreType = [
    {
      text: 'Anime Terbaik',
      icon: <EmojiEvents />,
      element: <TopAnime />
    },
    {
      text: 'Musim Ini',
      icon: <Autorenew />,
      element: <CurrentSeason />
    },
    {
      text: 'Rekomendasi',
      icon: <Lightbulb />,
      // element: <TopAnime />
    },
    {
      text: 'Musiman',
      icon: <CalendarMonth />,
      element: <Seasons />
    },
  ]

  return (
    <Box className="flex flex-col items-center gap-5">
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
        aria-label="scrollable auto tabs example"
        sx={{
          width: '100%',
          [`& .${tabsClasses.scrollButtons}`]: {
            width: 'unset',
            '&.Mui-disabled': { opacity: 0.3 },
          },
          [`& .${tabsClasses.scrollButtons}:first-of-type`]: {
            pr: '0.5rem'
          },
          [`& .${tabsClasses.scrollButtons}:last-of-type`]: {
            pl: '0.5rem'
          },
        }}
      >
        {animeExploreType.map((type, index) => {
          return (
            <Tab
              key={index}
              sx={{
                px: '0.5rem',
                minWidth: '5rem'
              }}
              label={
                <Typography textTransform={'none'} fontSize={'small'} fontWeight={'bold'} className="flex items-center gap-1">
                  {type.icon}
                  {type.text}
                </Typography>
              } 
              {...a11yProps(index)} 
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

function TopAnime() {
  const filterAndSort = [
    {
      name: 'Jenis Peringkat',
      isMultiple: false,
      menus: [
        { text: 'All Anime' },
        { text: 'Top Airing' },
        { text: 'Top Upcoming' },
        { text: 'Top TV Series' },
        { text: 'Top Movies' },
        { text: 'Top OVAs' },
        { text: 'Top ONAs' },
        { text: 'Top Specials' },
        { text: 'Most Popular' },
        { text: 'Most Favorited' },
      ]
    },
    {
      name: 'Tipe Akses',
      isMultiple: false,
      menus: [
        { text: 'Tersedia gratis' },
        { text: 'Waktu terbatas' },
        { text: 'Wajib berlangganan' },
      ]
    },
    {
      name: 'List Saya',
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

  return (
    <AnimeExplorePanel filterAndSort={filterAndSort} />
  )
}

function CurrentSeason() {
  const filterAndSort = [
    {
      name: 'Jenis Anime',
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
      isMultiple: false,
      menus: [
        { text: 'Anggota' },
        { text: 'Skor' },
        { text: 'Tanggal mulai' },
        { text: 'Judul' },
        { text: 'Studio' },
        { text: 'Lisensor' },
      ]
    },
    {
      name: 'Tipe Akses',
      isMultiple: false,
      menus: [
        { text: 'Tersedia gratis' },
        { text: 'Waktu terbatas' },
        { text: 'Wajib berlangganan' },
      ]
    },
    {
      name: 'List Saya',
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

  return (
    <AnimeExplorePanel filterAndSort={filterAndSort} />
  )
}

function Seasons() {
  // Generate 1917 until this year
  const earlyYear = 1917;
  const lastYear = dayjs().get('year');
  const years = Array(lastYear-earlyYear+1).fill().map((_, i) => {
    return {
      text: (lastYear - i).toString()
    }
  })

  const filterAndSort = [
    {
      name: 'Musim',
      isMultiple: false,
      menus: [
        { text: 'Winter' },
        { text: 'Spring' },
        { text: 'Summer' },
        { text: 'Fall' },
      ]
    },
    {
      name: 'Tahun',
      isMultiple: false,
      menus: years
      // menus: [
      //   { text: 'Winter' },
      //   { text: 'Spring' },
      //   { text: 'Summer' },
      //   { text: 'Fall' },
      // ]
    },
    {
      name: 'Urutan',
      isMultiple: false,
      menus: [
        { text: 'Anggota' },
        { text: 'Skor' },
        { text: 'Tanggal mulai' },
        { text: 'Judul' },
        { text: 'Studio' },
        { text: 'Lisensor' },
      ]
    },
    {
      name: 'Tipe Akses',
      isMultiple: false,
      menus: [
        { text: 'Tersedia gratis' },
        { text: 'Waktu terbatas' },
        { text: 'Wajib berlangganan' },
      ]
    },
    {
      name: 'List Saya',
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

  return (
    <AnimeExplorePanel filterAndSort={filterAndSort} />
  )
}

function AnimeExplorePanel({ filterAndSort }) {
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

  const [isOpen, setIsOpen] = useState(false)

  function handleOpen() {
    setIsOpen(!isOpen)
  }

  return (
    <Box className="flex flex-col px-1 gap-2.5">
      <Collapse in={isOpen} collapsedSize={45}>
        <Box className="flex flex-wrap gap-5 pt-1.25">
          {filterAndSort.map((filter, index) => (
            <SortAndFilter name={filter.name} menu={filter.menus} isMultiple={filter.isMultiple} key={index}/>
          ))}
        </Box>
      </Collapse>

      <IconButton size="small" className="w-fit self-end" onClick={handleOpen}>
        {isOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
      </IconButton>
      
      <AnimeList animes={anime} />
    </Box>
  )
}

function SortAndFilter({ name, menu, isMultiple=true }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [sortType, setSortType] = useState(0);
  const [filterType, setFilterType] = useState(menu.map((menu, index) => index));

  const handleChangeSort = (event) => {
    setSortType(event.target.value);
  };

  const handleChangeFilter = (event) => {
    const {
      target: { value },
    } = event;
    setFilterType(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <FormControl size="small" fullWidth={isMobile} sx={{ minWidth: { xs: 'unset', sm: '10rem' } }}>
      <InputLabel id={name + menu[0].text}>{name}</InputLabel>
      <Select
        labelId={name + menu[0].text}
        id={name}
        value={isMultiple ? filterType : sortType}
        label={name}
        onChange={isMultiple ? handleChangeFilter : handleChangeSort}
        multiple={isMultiple}
      >
        {menu.map((filter, index) => (
          <MenuItem value={index} className="flex items-center" key={index}>{filter.text}</MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

// List anime item

function AnimeList({ animes }) {
  return (
    <List disablePadding>
      {animes.map((anime, index) => (
        <ListItem key={index} disableGutters>
          <Card>
            {/* Dekstop Mode */}
            <Box className="hidden sm:flex p-2 gap-2 justify-between">
              <Box className="flex flex-col items-start">
                <AnimeTitle title={anime.title} />
              </Box>
              <AnimeScore score={anime.score} />
            </Box>

            <Box className="flex flex-col sm:flex-row overflow-hidden sm:h-60 gap-2 sm:gap-0">
              <AnimeImage 
                picture={anime.picture} 
                title={anime.title} 
                episodeAired={anime.mainPlatform.episodeAired} 
                progress={anime.myListStatus.progress} 
              />

              <Box className="flex flex-col justify-between py-1 px-2 w-full sm:w-[150%] gap-2 sm:gap-0">
                <Box className="block sm:hidden">
                  <AnimeTitle title={anime.title} />
                </Box>
                <Box>
                  <Typography 
                    sx={{ 
                      display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical',
                      fontSize: 'small', textAlign: 'left'
                    }}
                    className="overflow-y-scroll"
                  >
                    {anime.description}
                  </Typography>
                </Box>

                <Typography sx={{ fontSize: 'small' }}>
                  Genre:&nbsp;
                  {anime.genres?.map((genre, index) => (
                    <span key={index} >
                      <Link>{genre}</Link>
                      {index < anime.genres.length - 1 && ', '}
                    </span>
                  ))}
                </Typography>
                
                <AnimeScore score={anime.score} sx={{ display: { sm: 'none' } }} />

                <AnimePlatform platforms={anime.platforms} />
              </Box>
            </Box>
          </Card>
        </ListItem>
      ))}
    </List>
  )
}

function AnimeTitle({ title }) {
  return (
    <>
      <Tooltip title={title} placement="top">
        <Typography 
          sx={{ 
            display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', 
            fontWeight: 'bold', fontSize: 'small'
          }}
          className="overflow-hidden"
        >
          {title}
        </Typography>
      </Tooltip>
      <Typography sx={{ fontSize: 'small', textAlign: 'center' }}>Jan 1, 2025 | 13 eps, 23 min</Typography>
    </>
  )
}

function AnimeScore({ score, sx }) {
  return (
    <AnimeButton icon={<Star />} content={score} sx={{ ...sx }} />
  )
}