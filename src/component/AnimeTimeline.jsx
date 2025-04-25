import { 
  Typography, Box, Card, Tabs, Tab,
  List,
  ListItem,
  Tooltip,
} from "@mui/material";
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot,  } from "@mui/lab";
import { timelineItemClasses } from '@mui/lab/TimelineItem';
import AnimePlatform from "./AnimePlatform";
import AnimeImage from "./AnimeImage";
import CustomTabPanel from "./CustomTabPanel";
import { useState } from "react";
import dayjs from "dayjs";
import 'dayjs/locale/id'

dayjs.locale('id')

export default function AnimeTimeline({ animes }) {
  const initialDay = dayjs().subtract(3, 'day');
  const days = []
  for (let i=0; i < 7; i++) {
    days.push({
      date: dayjs(initialDay).add(i, 'day')
    })
  }

  const [value, setValue] = useState(3);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box className="flex flex-col gap-4">
      <Typography variant="h2">Jadwal Rilis Anime Mingguan!</Typography>
      <Box className="flex flex-col items-center gap-2">
        <Tabs
          value={value}
          onChange={handleChange}
        >
          {days.map((day, index) => {
            const hari = dayjs(day.date).format('dddd')
            const tanggal = dayjs(day.date).format('D')
            return (
              <Tab
                key={index}
                label={
                  <>
                  <Typography textTransform={'none'} fontSize={'small'} fontWeight={'bold'}>
                    {hari === dayjs().format('dddd') ? 'Hari ini' : hari}
                  </Typography>
                  <Typography textTransform={'none'} fontSize={'small'}>
                    {hari === dayjs().format('dddd') ? hari : tanggal}
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
                  <Timeline key={index} sx={{
                    [`& .${timelineItemClasses.root}:before`]: {
                      flex: 0,
                      padding: 0,
                    },
                  }}>
                    <AnimeTimelineItem time={'10:00'} animes={animes} key={1}/>
                    <AnimeTimelineItem time={'10:00'} animes={animes} key={2}/>
                    <AnimeTimelineItem time={'10:00'} animes={animes} key={3}/>
                    <AnimeTimelineItem time={'10:00'} animes={animes} key={4}/>
                  </Timeline>
                ) : (
                  <Typography className="py-15 text-center">Tidak ada anime yang tayang hari ini</Typography>
                )
              }
              
            </CustomTabPanel>
          )
        })}
      </Box>
    </Box>
  )
}

function AnimeTimelineItem({ time, animes }) {
  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot />
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
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
        <Box padding={2} />
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