import { 
  Typography, Box, Card, Tabs, Tab,
  List,
  ListItem,
  CardMedia,
} from "@mui/material";
import PropTypes from 'prop-types';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent,  } from "@mui/lab";
import { timelineItemClasses } from '@mui/lab/TimelineItem';
import { tabsClasses } from '@mui/material/Tabs';
import ButtonLink from "../component/ButtonLink";
import AnimePlatform from "./AnimePlatform";
import AnimeImage from "./AnimeImage";
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
          {days.map((day, index) => {
            const hari = dayjs(day.date).format('dddd')
            const tanggal = dayjs(day.date).format('D')
            return (
              <Tab
                key={index}
                sx={{
                  p: 0,
                  minWidth: '5rem'
                }}
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
                {...a11yProps(index)} 
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

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
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
              <Card className="flex flex-col sm:flex-row overflow-hidden sm:h-35 gap-2 sm:gap-0">
                <AnimeImage 
                  picture={anime.picture} 
                  title={anime.title} 
                  episodeAired={anime.mainPlatform.episodeAired} 
                  progress={anime.myListStatus.progress} 
                />
                <Box className="flex flex-col justify-between py-1 px-2 w-full gap-2 sm:gap-0">
                  <Typography 
                    sx={{ 
                      display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', 
                      fontWeight: 'bold', fontSize: 'small',
                    }}
                    className="overflow-hidden"
                  >
                    {anime.title}
                  </Typography>

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