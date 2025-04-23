import { 
  Typography, Box, Card, Tabs, Tab,
  List,
  ListItem,
  CardMedia,
  CardContent,
  CardActions
} from "@mui/material";
import PropTypes from 'prop-types';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent,  } from "@mui/lab";
import { timelineItemClasses } from '@mui/lab/TimelineItem';
import {
  timelineOppositeContentClasses,
} from '@mui/lab/TimelineOppositeContent';
import { tabsClasses } from '@mui/material/Tabs';
import ButtonLink from "../component/ButtonLink";
import { AccessTime, CloudUpload, KeyboardDoubleArrowRight, PlayArrow } from "@mui/icons-material";
import AnimeButton from "../component/AnimeButton";
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
                  <Typography marginTop={'5rem'}>Tidak ada anime yang tayang hari ini</Typography>
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
              <Card className="flex flex-col md:flex-row overflow-hidden md:h-35">
                <AnimeImage 
                  picture={anime.picture} 
                  title={anime.title} 
                  episodeAired={anime.mainPlatform.episodeAired} 
                  progress={anime.myListStatus.progress} 
                />
                <Box className="flex flex-col justify-between p-1 px-2">
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

function AnimeImage({ picture, title, episodeAired, progress }) {
  return (
    <Box className="w-full h-25 md:h-full relative">
      <CardMedia className="w-full h-full" component={'img'} image={picture} alt={title} />
      <AnimeButton 
        sx={{ position: 'absolute', bottom: 0, left: { xs: 'unset', md: '0' }, right: { xs: 0, md: 'unset ' } }}
        icon={<CloudUpload />} backgroundColor={'green'} 
        content={episodeAired}
      />
      <AnimeButton 
        sx={{ position: 'absolute', top: 0, left: 0 }}
        backgroundColor="yellow" content={episodeAired - progress} 
        icon={<AccessTime />} to={'/anime/:1/my-list-status'}
      />
    </Box>
  )
}

function ImageAndEpisodeAired({ src, episodeAired }) {
  return(
    <div className="rounded-l-md overflow-hidden w-30 h-full relative">
      {/* Image */}
      <img src={src} className="w-full h-full object-cover"/>

      {/* Episode aired */}
      <AnimeButton 
        sx={{ position: 'absolute', bottom: 0, left: 0 }} icon={<CloudUpload />} backgroundColor={'green'} 
        content={episodeAired}
      />
    </div>
  )
}

function AnimePlatform({ platforms }) {
  return (
    <ul className="flex flex-wrap overflow-hidden">
      {platforms.map((platform, index) => (
        <li key={index}>
          <ButtonLink sx={{ height: '2rem', minWidth: 'unset' }}>
            <img src={platform.icon} className="h-full object-contain" />
          </ButtonLink>
        </li>
      ))}
    </ul>
  )
}