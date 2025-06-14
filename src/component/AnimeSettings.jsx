import { useEffect, useRef, useState } from "react"
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Typography, useMediaQuery, useTheme } from "@mui/material";
import AnimeButton from "./AnimeButton";
import AnimeImage from "./AnimeImage";
import InputField from "./InputField";
import { ArrowBack, ArrowForward, Check, Close, CloudDownloadOutlined, Delete, Settings } from "@mui/icons-material";
import Switch from "./Switch";
import dayjs from "dayjs";
import convertAnimeStatus from "../helper/convertAnimeStatus.js";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateAnime } from "../services/anime.service.js";
import { deleteAnimePlatform, getPlatforms, updateAnimePlatform } from "../services/platform.service.js";
import { updateAnimeSchema } from "../validators/anime.validator.js";
import { toast } from "react-toastify";
import { getAnimeDetail } from "../services/mal.service.js";
import { deleteAnimePlatformSchema, updateAnimePlatformSchema } from "../validators/platform.validator.js";

export default function AnimeSettings({ sx, anime, setAnime }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Dialog

  // State
  const [open, setOpen] = useState(false);
  const descriptionElementRef = useRef(null);
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  // Handle click
  const handleClose = () => {
    setOpen(false);
    setIsPlatform(false);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Platform handle
  const [isPlatform, setIsPlatform] = useState(false);
  const handleIsPlatform = (value) => {
    setIsPlatform(value);
  }

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
        {
          isPlatform ? 
          <EditPlatform handleClose={handleClose} handleIsPlatform={handleIsPlatform} anime={anime} setAnime={setAnime} /> :
          <EditAnime handleClose={handleClose} handleIsPlatform={handleIsPlatform} anime={anime} setAnime={setAnime} />
        }
      </Dialog>
    </>
  )
}

function AnimeWrapper({ anime, handleClose, children, onSubmit, isSubmitting, platform, setAnime }) {
  const [isOpen, setIsOpen] = useState(false);
  const handleIsOpen = (value) => {
    setIsOpen(value)
  }

  return (
    <>
    <Box component={'form'} onSubmit={onSubmit} className="w-full h-full flex flex-col justify-between">
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
            {children}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <IconButton 
          onClick={() => handleIsOpen(true)} disabled={isSubmitting || !platform}
        >
          <Delete />
        </IconButton>
        <Box className="flex gap-2">
          <Button onClick={handleClose} disabled={isSubmitting} startIcon={<Close />} variant="contained" color="secondary">
            Batal
          </Button>
          <Button endIcon={<Check />} variant="contained" type="submit" disabled={isSubmitting}>
            Simpan
          </Button>
        </Box>
      </DialogActions>
    </Box>
    {platform && <DeletePlatform open={isOpen} handleIsOpen={handleIsOpen} platform={platform} anime={anime} setAnime={setAnime} />}
    </>
  )
}

function EditAnime({ handleClose, handleIsPlatform, anime, setAnime }) {
  // Form

  // Settings
  const { register, control, formState: { isSubmitting, errors, dirtyFields }, reset, handleSubmit, setValue } = useForm({
    resolver: zodResolver(updateAnimeSchema), mode: 'onChange', values: {
      picture: anime.picture,
      title: anime.title,
      titleID: anime.titleID || null,
      titleEN: anime.titleEN || null,
      releaseAt: (anime.releaseAt || anime.start_date) ? dayjs(anime.releaseAt || anime.start_date).format('YYYY-MM-DD') : null,
      episodeTotal: anime.num_episodes || anime.episodeTotal,
      status: anime.status
    }
  })

  // Menu item
  const menuSelect = [
    {
      name: 'Judul utama (Romaji)',
      id: 'title',
      type: 'textField',
      register: register('title'),
      error: errors.title,
      isDirty: dirtyFields.title,
    },
    {
      name: 'Judul Inggris',
      id: 'titleEN',
      type: 'textField',
      register: register('titleEN'),
      error: errors.titleEN,
      isDirty: dirtyFields.titleEN,
    },
    {
      name: 'Judul Indonesia',
      id: 'titleID',
      type: 'textField',
      register: register('titleID'),
      error: errors.titleID,
      isDirty: dirtyFields.titleID,
    },
    {
      name: 'Link gambar',
      id: 'picture',
      type: 'textField',
      register: register('picture'),
      error: errors.picture,
      isDirty: dirtyFields.picture,
    },
    {
      name: 'Tanggal rilis',
      id: 'releaseAt',
      type: 'date',
      register: register('releaseAt'),
      error: errors.releaseAt,
      isDirty: dirtyFields.releaseAt,
    },
    {
      name: 'Total episode',
      id: 'episodeTotal',
      type: 'fieldIcon',
      fieldType: 'number',
      endAdornment: 'Eps',
      register: register('episodeTotal', { valueAsNumber: true }),
      error: errors.episodeTotal,
      isDirty: dirtyFields.episodeTotal,
    },
  ]

  // Submit edit anime
  const onSubmit = async (req) => {
    const { success, message, data } = await updateAnime(
      anime.id, req.picture, req.title, req.titleID, req.titleEN, req.releaseAt, req.episodeTotal, req.status
    )
    
    if (success) {
      // console.log(data);
      setAnime(data)
      toast.success(message)
    } else {
      toast.error(message)
    }
  }

  // Get anime detail from MyAnimeList
  const [isLoading, setIsLoading] = useState(false)
  const getAnimeFromMAL = async () => {
    setIsLoading(true);
    const { success, message, data } = await getAnimeDetail(anime.malId)
    if (success) {
      toast.success(message);
      setValue('picture', data.main_picture.large, { shouldDirty: true })
      setValue('title', data.title, { shouldDirty: true })
      setValue('titleEN', data.alternative_titles?.en || null, { shouldDirty: true })
      setValue('releaseAt', data.start_date || null, { shouldDirty: true })
      setValue('episodeTotal', data.num_episodes || 0, { shouldDirty: true })
      setValue('status', data.status || 'not_yet_aired', { shouldDirty: true })
    } else {
      toast.error(message);
    }
    setIsLoading(false);
  }

  // Component

  const handleClick = () => {
    reset();
    handleClose();
  }

  return (
    <AnimeWrapper 
      anime={anime} handleClose={handleClick} 
      onSubmit={handleSubmit(onSubmit)} isSubmitting={isSubmitting}
    >
      <Box className="flex flex-wrap flex-col md:flex-row justify-between gap-2.5">
        {menuSelect.map((menu, i) => {
          return <InputField menu={menu} key={i} control={control} />
        })}
      </Box>

      <Box className="flex flex-col lg:flex-row items-center justify-between gap-5">
        <Button 
          onClick={getAnimeFromMAL} startIcon={<CloudDownloadOutlined />} disabled={isLoading}
          variant="contained" size="small" sx={{ textTransform: 'none', bgcolor: '#2e51a2' }}
        >
          Cek status di MyAnimeList
        </Button>
        <Button onClick={() => handleIsPlatform(true)} endIcon={<ArrowForward />} variant="contained" size="small" sx={{ 
          textTransform: 'none', my: '0.55rem'
        }}>
          Jadwal platform
        </Button>
      </Box>
    </AnimeWrapper>
  )
}

function EditPlatform({ handleClose, handleIsPlatform, anime, setAnime }) {  
  // Form

  // Settings
  const platforms = anime.platforms;
  const { register, control, setValue, formState: { dirtyFields, errors, isSubmitting }, watch, handleSubmit } = useForm({
    resolver: zodResolver(updateAnimePlatformSchema), mode: 'onChange', values: {
      platformId: platforms[0]?.platform.id || '',
      link: platforms[0]?.link || null, 
      accessType: platforms[0]?.accessType || '', 
      nextEpisodeAiringAt: platforms[0]?.nextEpisodeAiringAt ? dayjs(platforms[0]?.nextEpisodeAiringAt).toISOString() : null, 
      lastEpisodeAiredAt: platforms[0]?.lastEpisodeAiredAt ? dayjs(platforms[0]?.lastEpisodeAiredAt).toISOString() : null, 
      intervalInDays: platforms[0]?.intervalInDays || 7, 
      episodeAired: platforms[0]?.episodeAired || null, 
      isMainPlatform: platforms[0]?.isMainPlatform || false,
      isHiatus: platforms[0]?.isHiatus || false,
    }
  })

  // Get list of platform from database
  const [menus, setMenus] = useState([
    { text: 'Muse - YouTube', value: 26 },
    { text: 'AniOne - YouTube', value: 27 },
    { text: 'Bstation', value: 28 },
  ])
  useEffect(() => {
    const getPlatformsProvider = async () => {
      const { data, success, message } = await getPlatforms();
      if (success) {
        setMenus(data.map((menu) => {
          return {
            text: menu.name,
            value: menu.id,
          }
        }))
      } else {
        toast.error(message)
      }
    }
    getPlatformsProvider()
  }, [])
  
  // Menu item
  const menuSelect = [
    {
      name: 'Pilih platform',
      id: 'platformId',
      type: 'select',
      register: register('platformId'),
      error: errors.platformId,
      isDirty: dirtyFields.platformId,
      menus: menus
    },
    {
      name: 'Link',
      id: 'link',
      type: 'textField',
      isTextField: true,
      register: register('link'),
      error: errors.link,
      isDirty: dirtyFields.link,
    },
    {
      name: 'Tipe akses',
      id: 'accessType',
      type: 'select',
      register: register('accessType'),
      error: errors.accessType,
      isDirty: dirtyFields.accessType,
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
      fieldType: 'number',
      endAdornment: 'Eps',
      register: register('episodeAired', { valueAsNumber: true }),
      error: errors.episodeAired,
      isDirty: dirtyFields.episodeAired,
    },
    {
      name: 'Episode sebelumnya',
      id: 'lastEpisodeAiredAt',
      type: 'dateTime',
      register: register('lastEpisodeAiredAt'),
      error: errors.lastEpisodeAiredAt,
      isDirty: dirtyFields.lastEpisodeAiredAt,
    },
    {
      name: 'Episode berikutnya',
      id: 'nextEpisodeAiringAt',
      type: 'dateTime',
      register: register('nextEpisodeAiringAt'),
      error: errors.nextEpisodeAiringAt,
      isDirty: dirtyFields.nextEpisodeAiringAt,
    },
  ]

  // Handle which platform is selected
  const platformId = watch('platformId')
  const platformMap = new Map(
    platforms.map((platform) => [platform.platform.id, platform])
  )
  useEffect(() => {
    const selectedPlatform = platformMap.get(platformId)
    setValue('platformId', platformId || '', { shouldValidate: true })
    setValue('link', selectedPlatform?.link || null, { shouldValidate: true })
    setValue('accessType', selectedPlatform?.accessType || '', { shouldValidate: true })
    setValue(
      'nextEpisodeAiringAt', selectedPlatform?.nextEpisodeAiringAt ? 
      dayjs(selectedPlatform.nextEpisodeAiringAt).toISOString() : 
      null
    , { shouldValidate: true })
    setValue(
      'lastEpisodeAiredAt', selectedPlatform?.lastEpisodeAiredAt ? 
      dayjs(selectedPlatform.lastEpisodeAiredAt).toISOString() : 
      null
    , { shouldValidate: true })
    setValue('intervalInDays', selectedPlatform?.intervalInDays || 7, { shouldValidate: true })
    setValue('episodeAired', selectedPlatform?.episodeAired || null, { shouldValidate: true })
    setValue('isMainPlatform', selectedPlatform?.isMainPlatform || false, { shouldValidate: true })
    setValue('isHiatus', selectedPlatform?.isHiatus || false, { shouldValidate: true })
  }, [platformId])

  // Submit edit anime platform
  const onSubmit = async (req) => {    
    const { success, message, data: newPlatform } = await updateAnimePlatform(
      anime.id, req.platformId, req.link, req.accessType, req.nextEpisodeAiringAt, req.lastEpisodeAiredAt, 
      req.intervalInDays, req.episodeAired, req.isMainPlatform, req.isHiatus
    );
    if (success) {
      let platformAnime = [...platforms]

      // If main platform change, set others isMainPlatform to false
      if (req.isMainPlatform) { 
        platformAnime = platformAnime.map(platform => {
          return {
            ...platform,
            isMainPlatform: false,
          }
        })
      }

      // Update changed platform
      const index = platformAnime.findIndex(platform => platform.id === newPlatform.id)
      if (index !== -1) {
        platformAnime[index] = newPlatform
      } else {
        platformAnime.push(newPlatform)
      }
      anime.platforms = platformAnime;

      // Update selected platform
      if (
        ((anime.selectedPlatform.id === newPlatform.id) || req.isMainPlatform) && 
        (!anime.myListStatus.animePlatformId || (anime.myListStatus.animePlatformId === newPlatform.id))
        // Update selected platform if:
        // - The currently selected platform is the one being updated, OR the updated platform is set as isMainPlatform
        // AND
        // - The user hasn't selected a platform yet, OR the selected platform is the same as the one being updated
      ) {
        console.log(!anime.myListStatus.platformId);
        anime.selectedPlatform = newPlatform;
      }
      setAnime(anime)
      toast.success(message);
    } else {
      toast.error(message);
    }
  }

  return (
    <AnimeWrapper anime={anime} handleClose={handleClose} onSubmit={handleSubmit(onSubmit)} isSubmitting={isSubmitting}
      platform={platformMap.get(platformId)} setAnime={setAnime}
    >
      <Box className="flex flex-wrap flex-col md:flex-row justify-between gap-2.5">
        {menuSelect.map((menu, i) => {
          return <InputField menu={menu} key={i} control={control} />
        })}
      </Box>

      <Box className="flex flex-col-reverse md:flex-col-reverse lg:flex-row items-center justify-between gap-5">
        <Button onClick={() => handleIsPlatform(false)} startIcon={<ArrowBack />} variant="contained" size="small" sx={{ 
          textTransform: 'none', my: '0.55rem'
        }}>
          Pengaturan anime
        </Button>
        <Box className="pr-5 md:pr-2 flex flex-col justify-end">
          <Controller 
            render={({ field }) => (
              <Switch text={'Jadikan sebagai platform utama'} labelPlacement="start" field={field} />
            )}
            name={'isMainPlatform'}
            control={control}
          />
          <Controller 
            render={({ field }) => (
              <Switch text={'Update tidak berjalan'} labelPlacement="start" field={field} />
            )}
            name={'isHiatus'}
            control={control}
          />
        </Box>
      </Box>
    </AnimeWrapper>
  )
}

function DeletePlatform({ open, handleIsOpen, platform, anime, setAnime }) {
  // Settings
  const { handleSubmit, formState: { isSubmitting } } = useForm({
    resolver: zodResolver(deleteAnimePlatformSchema), mode: 'onChange', values: {
      animeId: anime.id || 0, platformId: platform.platform?.id || 0
    }
  })

  // Submit delete anime
  const onSubmit = async (req) => {
    const { success, message, data: newPlatform } = await deleteAnimePlatform(req.animeId, req.platformId);
    if (success) {
      const platformAnime = [...anime.platforms]
      const index = platformAnime.findIndex(platform => platform.id === newPlatform.id)
      if (index !== -1) {
        platformAnime.splice(index, 1);
        anime.platforms = platformAnime;
        setAnime(anime)
      } 
      toast.success(message)
    } else {
      toast.error(message)
    }
  }
  return (
    <Dialog
      open={open}
      onClose={() => handleIsOpen(false)}
      component={'form'}
      onSubmit={handleSubmit(onSubmit)}
    >
      <DialogTitle>{`Hapus platform ${platform.platform.name} dari anime "${anime.title}"?`}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {
            `Tindakan ini akan mempengaruhi list anime pengguna.
            Jika pengguna telah menandai platform ini dalam list anime mereka, 
            informasi mengenai platform ini akan dihapus`
          }
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button 
          startIcon={<Close />} color="secondary" variant="contained" 
          onClick={() => handleIsOpen(false)} disabled={isSubmitting} 
        >
          Batal
        </Button>
        <Button endIcon={<Check />} variant="contained" type="submit" disabled={isSubmitting}> 
          Ya
        </Button>
      </DialogActions>
    </Dialog>
  )
}