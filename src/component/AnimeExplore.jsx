import { Autorenew, CalendarMonth, EmojiEvents, Lightbulb, Star } from "@mui/icons-material";
import { Box, Button, Card, FormControl, Icon, IconButton, InputLabel, List, ListItem, ListItemIcon, Menu, MenuItem, MenuList, Select, Tab, Tabs, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import AnimeImage from "./AnimeImage";
import Link from "./Link";
import AnimeButton from "./AnimeButton";
import AnimePlatform from "./AnimePlatform";

export default function AnimeExplore({ animes }) {
  const menuItem = [
    {
      text: 'Anime Top',
      icon: <EmojiEvents />
    },
    {
      text: 'Musim Ini',
      icon: <Autorenew />
    },
    {
      text: 'Rekomendasi',
      icon: <Lightbulb />
    },
    {
      text: 'Musiman',
      icon: <CalendarMonth />
    },
  ]

  const [searchType, setSearchType] = useState(0);

  const handleChange = (event) => {
    setSearchType(event.target.value);
  };

  return (
    <Box className="flex flex-col gap-5">
      <Typography variant="h2">Eksplorasi Judul Anime!</Typography>

      <FormControl size="small">
        <InputLabel id="demo-simple-select-label">Jenis Pencarian</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={searchType}
          label="Jenis Pencarian"
          onChange={handleChange}
        >
          {menuItem.map((menu, index) => (
            <MenuItem value={index} className="flex items-center" key={index}>{menu.text}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <List disablePadding>
        {animes.map((anime, index) => (
          <ListItem key={index}>
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
    </Box>
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