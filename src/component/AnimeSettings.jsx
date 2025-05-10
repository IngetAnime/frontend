import { useEffect, useRef, useState } from "react"
import { Box, Button, Dialog, DialogActions, DialogContent, Typography, useMediaQuery, useTheme } from "@mui/material";
import AnimeButton from "./AnimeButton";
import AnimeImage from "./AnimeImage";
import InputField from "./InputField";
import { ArrowBack, ArrowForward, Check, Close, CloudDownloadOutlined, Settings } from "@mui/icons-material";
import Switch from "./Switch";
import dayjs from "dayjs";
import convertAnimeStatus from "../helper/convertAnimeStatus.js";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { booleanB, dateTime, idB, link, num_watched_episodes, oneAccessType, oneAnimeStatus, q } from "../validators/index.validator.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { getPlatforms } from "../services/explore.service.js";

export default function AnimeSettings({ sx, anime }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [open, setOpen] = useState(false);
  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsPlatform(false);
  };

  const [isPlatform, setIsPlatform] = useState(false);
  const handleIsPlatform = (value) => {
    setIsPlatform(value);
  }

  const descriptionElementRef = useRef(null);
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <>
      <AnimeButton sx={{ ...sx }}
        backgroundColor="blue"
        icon={Settings} onClick={handleClickOpen}
      />
      <Dialog
        fullScreen={isMobile}
        open={open}
        onClose={handleClose}
        scroll={'paper'}
        maxWidth={'md'}
        aria-labelledby="anime-title"
        aria-describedby="anime-description"
      >
        <DialogContent dividers={true} className="flex flex-col md:flex-row gap-5">
          <Box className="hidden md:block max-w-50">
            <AnimeImage isDialog={true} anime={anime} />
          </Box>
          <Box className="flex flex-col gap-5 w-full md:max-w-100 lg:max-w-125">
            <Box textAlign={'center'}>
              <Typography 
                sx={{ 
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', 
                  fontWeight: 'bold'
                }}
                className="overflow-hidden"
              >
                {anime.title}
              </Typography>
              <Typography fontWeight={'normal'} fontSize={'small'}>
                {anime.status && `${
                  convertAnimeStatus(anime.status)
                }`}
                {(anime.status && anime.num_episodes) ? ', ' : ''}
                {anime.num_episodes ? `${anime.num_episodes} eps` : ''}
              </Typography>
            </Box>
            <Box className="flex flex-col gap-5">
              {
                isPlatform ? 
                <EditPlatform handleClose={handleClose} handleIsPlatform={handleIsPlatform} platforms={anime.platforms} /> :
                <EditAnime handleClose={handleClose} handleIsPlatform={handleIsPlatform} anime={anime} /> 
              }
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} startIcon={<Close />} variant="contained" color="secondary">Batal</Button>
          <Button onClick={handleClose} endIcon={<Check />} variant="contained">Simpan</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

function EditAnime({ handleClose, handleIsPlatform, anime }) {
  const schema = z.object({
    picture: link,
    title: q,
    titleID: q.nullable(),
    titleEN: q.nullable(),
    releaseAt: dateTime.nullable(),
    episodeTotal: num_watched_episodes,
    status: oneAnimeStatus,
  })
  const { register, control } = useForm({
    resolver: zodResolver(schema), mode: 'onChange', defaultValues: {
      picture: anime.picture,
      title: anime.title,
      titleID: anime.titleID,
      titleEN: anime.titleEN,
      releaseAt: dayjs(anime.releaseAt),
      episodeTotal: anime.num_episodes,
    }
  })
  const menuSelect = [
    {
      name: 'Judul utama (Romaji)',
      id: 'title',
      type: 'textField',
      register: register('title')
    },
    {
      name: 'Judul Inggris',
      id: 'titleEN',
      type: 'textField',
      register: register('titleEN')
    },
    {
      name: 'Judul Indonesia',
      id: 'titleID',
      type: 'textField',
      register: register('titleID')
    },
    {
      name: 'Link gambar',
      id: 'picture',
      type: 'textField',
      register: register('picture')
    },
    {
      name: 'Tanggal rilis',
      id: 'releaseAt',
      type: 'date',
      register: register('releaseAt')
    },
    {
      name: 'Total episode',
      id: 'episodeTotal',
      type: 'fieldIcon',
      endAdornment: 'Eps',
      register: register('episodeTotal')
    },
  ]

  return (
    <>
    <Box className="flex flex-wrap flex-col md:flex-row justify-between gap-2.5">
      {menuSelect.map((menu, i) => {
        return <InputField menu={menu} key={i} control={control} />
      })}
    </Box>

    <Box className="flex flex-col lg:flex-row items-center justify-between gap-5">
      <Button onClick={handleClose} startIcon={<CloudDownloadOutlined />} variant="contained" size="small" sx={{ 
        textTransform: 'none', bgcolor: '#2e51a2'
      }}>
        Cek status di MyAnimeList
      </Button>
      <Button onClick={() => handleIsPlatform(true)} endIcon={<ArrowForward />} variant="contained" size="small" sx={{ 
        textTransform: 'none',
      }}>
        Jadwal platform
      </Button>
    </Box>
    </>
  )
}

function EditPlatform({ handleIsPlatform, platforms }) {
  const schema = z.object({
    platformId: idB,
    link: link, 
    accessType: oneAccessType, 
    nextEpisodeAiringAt: dateTime, 
    lastEpisodeAiredAt: dateTime.nullable(), 
    intervalInDays: idB, 
    episodeAired: num_watched_episodes, 
    isMainPlatform: booleanB,
  })
  const { register, control, setValue } = useForm({
    resolver: zodResolver(schema), mode: 'onChange', defaultValues: {
      platformId: platforms[0]?.platform.id || '',
      link: platforms[0]?.link || '', 
      accessType: platforms[0]?.accessType || '', 
      nextEpisodeAiringAt: platforms[0]?.nextEpisodeAiringAt ? dayjs(platforms[0]?.nextEpisodeAiringAt) : null, 
      lastEpisodeAiredAt: platforms[0]?.lastEpisodeAiredAt ? dayjs(platforms[0]?.lastEpisodeAiredAt) : null, 
      intervalInDays: platforms[0]?.intervalInDays || '', 
      episodeAired: platforms[0]?.episodeAired || '', 
      isMainPlatform: platforms[0]?.isMainPlatform || '',
    }
  })

  const [menus, setMenus] = useState([
    { text: 'Muse - YouTube' },
    { text: 'AniOne - YouTube' },
    { text: 'Bstation' },
  ])
  
  const menuSelect = [
    {
      name: 'Pilih platform',
      id: 'platformId',
      type: 'select',
      register: register('platformId'),
      menus: menus
    },
    {
      name: 'Link',
      id: 'link',
      type: 'textField',
      isTextField: true,
      register: register('link')
    },
    {
      name: 'Tipe akses',
      id: 'accessType',
      type: 'select',
      register: register('accessType'),
      menus: [
        { text: 'Gratis', value: 'free' },
        { text: 'Waktu terbatas', value: 'limited_time' },
        { text: 'Langganan', value: 'subscription' },
      ]
    },
    {
      name: 'Episode tayang',
      id: 'episodeAired',
      type: 'fieldIcon',
      endAdornment: 'Eps',
      register: register('episodeAired')
    },
    {
      name: 'Episode sebelumnya',
      id: 'lastEpisodeAiredAt',
      type: 'dateTime',
      register: register('lastEpisodeAiredAt')
    },
    {
      name: 'Episode berikutnya',
      id: 'nextEpisodeAiringAt',
      type: 'dateTime',
      register: register('nextEpisodeAiringAt')
    },
  ]

  const platformId = useWatch({
    control,
    name: 'platformId',
    defaultValue: platforms[0]?.platform.id || '',
  })
  const platformMap = new Map(
    platforms.map((platform) => [platform.platform.id, platform])
  )
  useEffect(() => {
    const selectedPlatform = platformMap.get(platformId)
    setValue('platformId', platformId || null)
    setValue('link', selectedPlatform?.link || null)
    setValue('accessType', selectedPlatform?.accessType || '')
    setValue('nextEpisodeAiringAt', selectedPlatform?.nextEpisodeAiringAt ? dayjs(selectedPlatform.nextEpisodeAiringAt) : null)
    setValue('lastEpisodeAiredAt', selectedPlatform?.lastEpisodeAiredAt ? dayjs(selectedPlatform.lastEpisodeAiredAt) : null)
    setValue('intervalInDays', selectedPlatform?.intervalInDays || '')
    setValue('episodeAired', selectedPlatform?.episodeAired || '')
    setValue('isMainPlatform', selectedPlatform?.isMainPlatform || '')
  }, [platformId, setValue, platformMap])

  useEffect(() => {
    const getPlatformsProvider = async () => {
      const { data } = await getPlatforms();
      setMenus(data.map((menu) => {
        return {
          text: menu.name,
          value: menu.id,
        }
      }))
    }
    getPlatformsProvider()
  }, [])

  return (
    <>
    <Box className="flex flex-wrap flex-col md:flex-row justify-between gap-2.5">
      {menuSelect.map((menu, i) => {
        return <InputField menu={menu} key={i} control={control} />
      })}
    </Box>

    <Box className="flex flex-col md:flex-col-reverse lg:flex-row items-center justify-between gap-5">
      <Button onClick={() => handleIsPlatform(false)} startIcon={<ArrowBack />} variant="contained" size="small" sx={{ 
        textTransform: 'none',
      }}>
        Pengaturan anime
      </Button>
      <Box className="pr-5 md:pr-2">
        <Controller 
          name="isMainPlatform"
          control={control}
          render={({ field }) => (
            <Switch text={'Jadikan sebagai platform utama'} labelPlacement="start" field={field} />
          )}
        />
      </Box>
    </Box>
    </>
  )
}