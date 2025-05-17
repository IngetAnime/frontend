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
  CircularProgress,
} from "@mui/material";
import { Timeline as MuiTimeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot,  } from "@mui/lab";
import { timelineItemClasses } from '@mui/lab/TimelineItem';
import AnimePlatform from "../../component/AnimePlatform";
import AnimeImage from "../../component/AnimeImage";
import CustomTabPanel from "../../component/CustomTabPanel";
import { Fragment, useEffect, useState } from "react";
import dayjs from "dayjs";
import 'dayjs/locale/id'
import Slider from "../../component/Slider";
import Collapse from "../../component/Collapse";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAnimeTimelineSchema } from "../../validators/anime.validator";
import { getAnimeTimeline } from "../../services/anime.service";
import { toast } from "react-toastify";
import { AccessTime, Circle, CircleOutlined } from "@mui/icons-material";
import { undefined } from "zod";

dayjs.locale('id')

export default function Timeline({ isDashboard=false }) {
  // Component

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md')) || isDashboard

  // Form 

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [timelines, setTimelines] = useState([]);
  
  // Settings
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const weekCount = 1;
  const { control, watch } = useForm({
    resolver: zodResolver(getAnimeTimelineSchema), mode: 'onChange',
    defaultValues: {
      myListOnly: false,
      originalSchedule: true
    }
  })

  // Watch input value
  const myListOnly = watch('myListOnly')
  const originalSchedule = watch('originalSchedule')

  useEffect(() => {
    const fetchAnime = async () => {
      setIsLoading(true);

      const { success, data, message } = await getAnimeTimeline(weekCount, timeZone, myListOnly, !originalSchedule)

      if (success) {
        setTimelines(data);
      } else {
        toast.error(message);
      }

      setIsLoading(false);
    }

    fetchAnime();
  }, [originalSchedule, myListOnly])

  // Update anime
  const handleTimelines = (newAnime) => {
    setTimelines(prevTimelines =>
      prevTimelines.map(dateGroup => ({
        ...dateGroup,
        timelines: dateGroup.timelines.map(timeline => ({
          ...timeline,
          data: timeline.data.map(anime =>
            anime.id === newAnime.id
              ? { ...anime, ...newAnime }
              : anime
          )
        }))
      }))
    );
  }

  return (
    <Box className="flex flex-col gap-4">
      <Typography variant="h2">Jadwal Rilis Anime Mingguan!</Typography>
      <FilterTimeline control={control} />
      {
        isLoading ? 
        <Box className="w-full flex justify-center py-25">
          <CircularProgress />
        </Box> :
        (
          isMobile ? 
          (<MobileTimeline days={timelines} setAnimes={handleTimelines} />) : 
          (<DekstopTimeline days={timelines} setAnimes={handleTimelines} />)
        )
      }
    </Box>
  )
}

function FilterTimeline({ control }) {
  return (
    <Collapse collapsedSize={25}>
      <FormGroup className="flex flex-row gap-5 px-5" sx={{ flexDirection: 'row' }}>
        <FormControlLabel 
          control={
            <Controller 
              render={({ field }) => (
                <Switch size="small" {...field} checked={field.value} />
              )}
              name='myListOnly'
              control={control}
            />
          } 
          label={<Typography fontSize={'small'}>Hanya tampilkan yang ada di list saya</Typography>}
        />
        <FormControlLabel 
          control={
            <Controller 
              render={({ field }) => (
                <Switch size="small" {...field} checked={field.value} />
              )}
              name='originalSchedule'
              control={control}
            />
          } 
          label={<Typography fontSize={'small'}>Tampilkan jadwal sesuai platform yang saya pilih</Typography>}
        />
      </FormGroup>
    </Collapse>
  )
}

function DekstopTimeline({ animes, days, setAnimes }) {
  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down('xl'))

  return (
    <Slider slidesToShow={isSmall ? 2 : 3}>
      {days.map((day, index) => {
        const hari = dayjs(day.dateTime).format('dddd')
        const tanggal = dayjs(day.dateTime).format('D')
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
            <Box className="w-full px-2.5 pb-2.5">
              {
                day.timelines.length ?
                <RenderTimeline index={index} key={index} animes={day.timelines} setAnimes={setAnimes} /> :
                <Typography align="center" className="py-19.5">Tidak ada anime yang tayang pada hari ini</Typography>
              }
            </Box>
          </Card>
        )
      })}
    </Slider>
  )
}

function MobileTimeline({ days, setAnimes }) {
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
          const hari = dayjs(day.dateTime).format('dddd')
          const tanggal = dayjs(day.dateTime).format('D')
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
          <CustomTabPanel value={value} index={index} key={index} sx={{ pb: '1.25rem' }}>
            {
              day.timelines.length ?
              <RenderTimeline index={index} key={index} animes={day.timelines} setAnimes={setAnimes} /> :
              <Typography align="center" className="py-19.5">Tidak ada anime yang tayang pada hari ini</Typography>
            }   
          </CustomTabPanel>
        )
      })}
    </Box>
  )
}

function RenderTimeline({ index, animes, setAnimes }) {
  return (
    <MuiTimeline key={index} sx={{
      p: 0,
      [`& .${timelineItemClasses.root}:before`]: {
        flex: 0,
        padding: 0,
      },
    }}>
      {animes.map((anime, i) => {
        const date = dayjs(anime.dateTime);
        const isNow = date.isAfter(dayjs()) && date.isSame(dayjs(), 'day');
        return (
          <Fragment key={i}>
            { 
              isNow ? 
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot sx={{ p: 0 }} color='primary' >
                    <AccessTime fontSize="small" />
                  </TimelineDot>
                  <TimelineConnector sx={{ backgroundColor: 'primary.main' }} />
                </TimelineSeparator>
                <TimelineContent sx={{ pr: 0 }}>
                  <Typography color="primary" className="pt-1.5">{`Waktu saat ini: ${dayjs().format('HH:mm')}`}</Typography>
                </TimelineContent>
              </TimelineItem> :
              <></>
            }
            <AnimeTimelineItem dateTime={anime.dateTime} animes={anime.data} key={i} setAnimes={setAnimes} />
          </Fragment>
        )
      })}
    </MuiTimeline>
  )
}

function AnimeTimelineItem({ dateTime, animes, setAnimes }) {
  const date = dayjs(dateTime);
  const time = date.format('HH:mm');
  const isTime = date.isAfter(dayjs().startOf('day')) && date.isBefore(dayjs());

  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot sx={{ p: 0 }} {...(isTime && { color: 'primary' })}>
          <CircleOutlined fontSize="small" />
        </TimelineDot>
        <TimelineConnector {...(isTime && { sx: { backgroundColor: 'primary.main' } })} />
      </TimelineSeparator >
      <TimelineContent sx={{ pr: 0 }}>
        <Typography color="textSecondary">{time}</Typography>
        <List disablePadding>
          {animes.map((anime, index) => (
            <ListItem key={index} disableGutters>
              <Card className="flex flex-wrap overflow-hidden w-full sm:h-30 gap-2 sm:gap-0">
                <Box className="w-full sm:w-25 lg:w-35 h-25 sm:h-full">
                  <AnimeImage 
                    anime={anime} setAnime={setAnimes}
                    episodeAired={anime.status === 'finished_airing' ? (anime.episodeTotal) : anime.platforms[0]?.episodeAired}
                  />
                </Box>
                <Box className="flex flex-col justify-between py-1 px-2 flex-1 gap-2 sm:gap-0">
                  <AnimeTitle title={anime.title} />
                  <Typography fontSize={'small'} color="textSecondary">
                    E{anime.schedule.numEpisode} 
                    {date.isBefore(dayjs()) ? ' sudah tayang' : ' belum tayang'}
                  </Typography>
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