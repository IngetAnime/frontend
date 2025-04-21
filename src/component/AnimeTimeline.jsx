import { 
  Typography, Box, Card, Tabs, Tab
} from "@mui/material";
import PropTypes from 'prop-types';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot,  } from "@mui/lab";
import { timelineItemClasses } from '@mui/lab/TimelineItem';
import { tabsClasses } from '@mui/material/Tabs';
import ButtonLink from "../component/ButtonLink";
import { AccessTime, CloudUpload, KeyboardDoubleArrowRight } from "@mui/icons-material";
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
    <div>
      <Typography variant="h2" sx={{ pb: 1 }}>Jadwal Rilis Anime Mingguan!</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <Box sx={{ width: '100%', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', p: 0 }}>
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
        </Box>
        {days.map((day, index) => {
          return (
            <CustomTabPanel value={value} index={index} key={index}>
              {
                (index === 3 || index === 0 || index === 6) ? (
                  <Timeline
                    key={index}
                    sx={{
                      [`& .${timelineItemClasses.root}:before`]: {
                        flex: 0,
                        padding: 0,
                      },
                      px: 0
                    }}
                  >
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
    </div>
  )
}

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ minHeight: '75vh' }}>{children}</Box>}
    </div>
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
      <TimelineContent sx={{px: '0.5rem'}}>
        <Typography color="textSecondary" pb={1}>{time}</Typography>
        <ul className="flex flex-col gap-4">
          {animes.map((anime, index) => (
            <li key={index}>
              <Card sx={{ gap: 1, flexWrap: 'wrap', display: 'flex', height: '12.5rem' }}>
                <ImageAndEpisodeAired src={anime.picture} episodeAired={anime.mainPlatform.episodeAired}/>

                <div className="flex-1 flex flex-col items-end justify-between h-full">
                  <AnimeTitle title={anime.title}/>

                  <AnimePlatform platforms={anime.platforms}/>

                  {/* Episode not watch yet */}
                  <AnimeButton 
                    backgroundColor="yellow" content={anime.mainPlatform.episodeAired - anime.myListStatus.progress} 
                    icon={<AccessTime />} to={'/anime/:1/my-list-status'}
                  />
                </div>
              </Card>
            </li>
          ))}
        </ul>
        <Box padding={2} />
      </TimelineContent>
    </TimelineItem>
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

function AnimeTitle({ title }) {
  return (
    <p className="max-w-full overflow-hidden p-1 overflow-ellipsis font-bold"
      style={{
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
      }}>
      {title}
    </p>
  )
}

function AnimePlatform({ platforms }) {
  return (
    <ul className="flex flex-wrap justify-end overflow-hidden px-1">
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