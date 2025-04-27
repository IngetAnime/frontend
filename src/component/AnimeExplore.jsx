import { Autorenew, CalendarMonth, EmojiEvents, KeyboardArrowDown, KeyboardArrowUp, Lightbulb, Star } from "@mui/icons-material";
import { Box, Card, Collapse, IconButton, List, ListItem, Tab, Tabs, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import AnimeImage from "./AnimeImage";
import Link from "./Link";
import AnimeButton from "./AnimeButton";
import AnimePlatform from "./AnimePlatform";
import SortAndFilter from "./SortAndFilter";
import CustomTabPanel from "./CustomTabPanel";
import dayjs from "dayjs";

export default function AnimeExplore({ isMobile=true }) {
  return (
    <Box className={`flex flex-col gap-5 $`}>
      <Typography variant="h2">Eksplorasi Judul Anime!</Typography>

      <AnimeExploreType isMobile={isMobile} />
    </Box>
  )
}

function AnimeExploreType({ isMobile }) {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const animeExploreType = [
    {
      text: 'Anime Terbaik',
      icon: <EmojiEvents />,
      element: <TopAnime isMobile={isMobile} />
    },
    {
      text: 'Musim Ini',
      icon: <Autorenew />,
      element: <CurrentSeason isMobile={isMobile} />
    },
    {
      text: 'Rekomendasi',
      icon: <Lightbulb />,
      // element: <TopAnime />
    },
    {
      text: 'Musiman',
      icon: <CalendarMonth />,
      element: <Seasons isMobile={isMobile} />
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

function TopAnime({ isMobile }) {
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
    <AnimeExplorePanel filterAndSort={filterAndSort} isMobile={isMobile} />
  )
}

function CurrentSeason({ isMobile }) {
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
    <AnimeExplorePanel filterAndSort={filterAndSort} isMobile={isMobile} />
  )
}

function Seasons({ isMobile }) {
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
    <AnimeExplorePanel filterAndSort={filterAndSort} isMobile={isMobile} />
  )
}

function AnimeExplorePanel({ filterAndSort, isMobile }) {
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

  return (
    <Box className="flex flex-col px-1 gap-2.5">
      <SortAndFilter sortAndFilter={filterAndSort} />
      <AnimeList animes={anime} isMobile={isMobile} />
    </Box>
  )
}

// List anime item

function AnimeList({ animes, isMobile  }) {
  return (
    <List disablePadding className={`flex flex-col gap-5 ${ !isMobile && 'flex-row flex-wrap justify-center'}`}>
      {animes.map((anime, index) => (
        <ListItem key={index} disablePadding className={`${ !isMobile && 'md:max-w-[47%] lg:max-w-[30%]'}`}>
          <Card>
            {/* Dekstop Mode */}
            <Box className="hidden sm:flex p-2 gap-2 justify-between">
              <Box className="flex flex-col items-start">
                <AnimeTitle title={anime.title} />
              </Box>
              <AnimeScore score={anime.score} />
            </Box>

            <Box className="flex flex-wrap overflow-hidden w-full sm:h-40 gap-2 sm:gap-0">
              <Box className="w-full sm:w-30 h-35 sm:h-full">
                <AnimeImage 
                  picture={anime.picture} 
                  title={anime.title} 
                  episodeAired={anime.mainPlatform.episodeAired} 
                  progress={anime.myListStatus.progress} 
                />
              </Box>

              <Box className="flex flex-col justify-between pb-1 px-2 flex-1 gap-2 sm:gap-0">
                <Box className="block sm:hidden">
                  <AnimeTitle title={anime.title} />
                </Box>
                <Box>
                  <Typography 
                    sx={{ 
                      display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical',
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
    <AnimeButton icon={Star} content={score} sx={{ ...sx }} />
  )
}