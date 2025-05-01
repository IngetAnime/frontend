import { 
  Typography, Box, Card, Tabs, Tab,
  List,
  ListItem,
  Tooltip,
  useTheme,
  useMediaQuery,
  Switch,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import { Timeline as MuiTimeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot,  } from "@mui/lab";
import { timelineItemClasses } from '@mui/lab/TimelineItem';
import AnimePlatform from "../../component/AnimePlatform";
import AnimeImage from "../../component/AnimeImage";
import CustomTabPanel from "../../component/CustomTabPanel";
import { useState } from "react";
import dayjs from "dayjs";
import 'dayjs/locale/id'
import Slider from "../../component/Slider";
import Collapse from "../../component/Collapse";

dayjs.locale('id')

export default function Timeline({ isDashboard=false }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md')) || isDashboard

  const anime = Array(2).fill(
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

  const initialDay = dayjs().subtract(3, 'day');
  const days = []
  for (let i=0; i < 7; i++) {
    days.push({
      date: dayjs(initialDay).add(i, 'day')
    })
  }

  return (
    <Box className="flex flex-col gap-4">
      <Typography variant="h2">Jadwal Rilis Anime Mingguan!</Typography>
      <FilterTimeline />
      {
        isMobile ? (<MobileTimeline animes={anime} days={days} />) : (<DekstopTimeline animes={anime} days={days} />)
      }
    </Box>
  )
}

function FilterTimeline() {
  return (
    <Collapse collapsedSize={25}>
      <FormGroup className="flex flex-row gap-5 px-5" sx={{ flexDirection: 'row' }}>
        <FormControlLabel 
          control={<Switch size="small" />} 
          label={<Typography fontSize={'small'}>Hanya tampilkan yang ada di list saya</Typography>}
        />
        <FormControlLabel 
          control={<Switch size="small" defaultChecked />} 
          label={<Typography fontSize={'small'}>Tampilkan jadwal sesuai platform yang saya pilih</Typography>}
        />
      </FormGroup>
    </Collapse>
  )
}

function DekstopTimeline({ animes, days }) {
  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down('xl'))

  return (
    <Slider slidesToShow={isSmall ? 2 : 3}>
      {days.map((day, index) => {
        const hari = dayjs(day.date).format('dddd')
        const tanggal = dayjs(day.date).format('D')
        const isToday = (hari === dayjs().format('dddd'))
        return (
          <Card className="flex flex-col items-center" key={index}>
            <Box 
              className={
                `flex flex-col items-center py-2.5 w-full 
                ${isToday && 'bg-linear-to-t from-white to-[rgba(0,188,125,0.25)]'}`
              }>
              <Typography fontWeight={'bold'} fontSize={'small'}>{ isToday ? 'Hari ini': hari }</Typography>
              <Typography fontSize={'small'}>{isToday ? hari : tanggal}</Typography>
            </Box>
            <Box className="w-full px-2.5">
              <RenderTimeline index={index} key={index} animes={animes} />
            </Box>
          </Card>
        )
      })}
    </Slider>
  )
}

function MobileTimeline({ animes, days }) {
  const [value, setValue] = useState(3);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
  return (
    <Box className="flex flex-col items-center gap-2">
      <Tabs
        value={value}
        onChange={handleChange}
      >
        {days.map((day, index) => {
          const hari = dayjs(day.date).format('dddd')
          const tanggal = dayjs(day.date).format('D')
          const isToday = (hari === dayjs().format('dddd'))
          return (
            <Tab
              key={index}
              label={
                <>
                <Typography textTransform={'none'} fontSize={'small'} fontWeight={'bold'}>
                  {isToday ? 'Hari ini' : hari}
                </Typography>
                <Typography textTransform={'none'} fontSize={'small'}>
                  {isToday ? hari : tanggal}
                </Typography>
                </>
              }
              id={`simple-tab-${index}`}
              aria-controls={`simple-tabpanel-${index}`}
            />
          )
        })}
      </Tabs>

      {days.map((day, index) => {
        return (
          <CustomTabPanel value={value} index={index} key={index}>
            {
              (index === 3 || index === 0 || index === 6) ? (
                <RenderTimeline index={index} key={index} animes={animes} />
              ) : (
                <Typography className="py-15 text-center">Tidak ada anime yang tayang hari ini</Typography>
              )
            }
            
          </CustomTabPanel>
        )
      })}
    </Box>
  )
}

function RenderTimeline({ index, animes }) {
  return (
    <MuiTimeline key={index} sx={{
      p: 0,
      [`& .${timelineItemClasses.root}:before`]: {
        flex: 0,
        padding: 0,
      },
    }}>
      <AnimeTimelineItem time={'10:00'} animes={animes} key={1}/>
      <AnimeTimelineItem time={'10:00'} animes={animes} key={2}/>
      <AnimeTimelineItem time={'10:00'} animes={animes} key={3}/>
      <AnimeTimelineItem time={'10:00'} animes={animes} key={4}/>
    </MuiTimeline>
  )
}

function AnimeTimelineItem({ time, animes }) {
  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot />
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent sx={{ pr: 0 }}>
        <Typography color="textSecondary">{time}</Typography>
        <List disablePadding>
          {animes.map((anime, index) => (
            <ListItem key={index} disableGutters>
              <Card className="flex flex-wrap overflow-hidden w-full sm:h-30 gap-2 sm:gap-0">
                <Box className="w-full sm:w-25 lg:w-35 h-25 sm:h-full">
                  <AnimeImage 
                    picture={anime.picture} 
                    title={anime.title} 
                    episodeAired={anime.mainPlatform.episodeAired} 
                    progress={anime.myListStatus.progress} 
                  />
                </Box>
                <Box className="flex flex-col justify-between py-1 px-2 flex-1 gap-2 sm:gap-0">
                  <AnimeTitle title={anime.title} />
                  <AnimePlatform platforms={anime.platforms} />
                </Box>
              </Card>
            </ListItem>
          ))}
        </List>
        <Box height={'0.5rem'} />
      </TimelineContent>
    </TimelineItem>
  )
}

function AnimeTitle({ title }) {
  return (
    <Tooltip title={title} placement={'top'}>
      <Typography 
        sx={{ 
          display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', 
          fontWeight: 'bold', fontSize: 'small',
        }}
        className="overflow-hidden"
      >
        {title}
      </Typography>
    </Tooltip>
  )
}