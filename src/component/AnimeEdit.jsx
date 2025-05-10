import { Check, Close, CloudDownloadOutlined, Delete, Save } from "@mui/icons-material";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import Switch from "./Switch";
import AnimeImage from "./AnimeImage";
import SlideNumber from "./SlideNumber";
import convertAnimeStatus from "../helper/convertAnimeStatus";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "./InputField";
import { deleteAnime, updateAnime } from "../services/explore.service";
import { toast } from "react-toastify";
import { deleteAnimeListSchema, updateAnimeListSchema } from "../validators/animeList.validator";
import { deleteAnimeList, updateAnimeList } from "../services/animeList.service";
import { getMyAnimeListStatus } from "../services/mal.service";

export default function AnimeEdit({ isOpen, handleClick, anime }) {
  // Form

  // Settings
  const { handleSubmit, control, formState: { errors, isSubmitting, dirtyFields }, reset, setValue, watch } = useForm({
    resolver: zodResolver(updateAnimeListSchema), mode: 'onChange', values: {
      animePlatformId: anime.myListStatus?.animePlatformId || 0,
      startDate: anime.myListStatus?.startDate ? dayjs(anime.myListStatus.startDate).format('YYYY-MM-DD') : null, 
      finishDate: anime.myListStatus?.finishDate ? dayjs(anime.myListStatus.finishDate).format('YYYY-MM-DD') : null, 
      progress: anime.myListStatus?.progress || 0, 
      score: anime.myListStatus?.score || 0, 
      episodesDifference: anime.myListStatus?.episodesDifference || 0, 
      status: anime.myListStatus?.status || 'plan_to_watch', 
      isSyncedWithMal: anime.myListStatus?.isSyncedWithMal || false
    }
  })

  // Watch input value for mobile
  const status = watch('status');
  const score = watch('score');
  const progress = watch('progress');
  
  // Menu item
  const totalEpisode = anime.platforms[0]?.episodeAired || anime.num_episodes || 99;
  const menuSelect = [
    {
      name: 'Status',
      id: 'status',
      type: 'select',
      error: errors.status,
      isDirty: dirtyFields.status,
      menus: [
        { text: 'Berjalan', color: '#00BC7D', value: 'watching' },
        { text: 'Selesai', color: '#0092B8', value: 'completed' },
        { text: 'Direncanakan', color: '#90A1B9', value: 'plan_to_watch' },
        { text: 'Ditunda', color: '#F0B100', value: 'on_hold' },
        { text: 'Ditinggalkan', color: '#FB2C36', value: 'dropped' },
      ]
    },
    {
      name: 'Progres',
      id: 'progress',
      type: 'select',
      error: errors.progress,
      isDirty: dirtyFields.progress,
      menus: [
        { text: '-', value: 0 },
        ...Array(totalEpisode + 1).fill(null).map((_, i) => {
          return {
            text: (i + 1).toString(),
            value: i + 1
          }
        })
      ]
    },
    {
      name: 'Score',
      id: 'score',
      type: 'select',
      error: errors.score,
      isDirty: dirtyFields.score,
      menus: [
        { text: '-', value: 0 },
        ...Array(10).fill(null).map((_, i) => {
          return {
            text: (10 - i).toString(),
            value: 10 - i
          }
        })
      ]
    },
    {
      name: 'Platform',
      id: 'animePlatformId',
      type: 'select',
      error: errors.animePlatformId,
      isDirty: dirtyFields.animePlatformId,
      menus: [
        { text: '-', value: 0 },
        ...(anime.platforms.length ? 
          anime.platforms.map(platform => {
            return {
              text: platform.platform.name,
              value: platform.id,
            }
          }) : []
        )
      ]
    },
    {
      name: 'Mulai nonton',
      id: 'startDate',
      type: 'date',
      error: errors.startDate,
      isDirty: dirtyFields.startDate,
    },
    {
      name: 'Selesai nonton',
      id: 'finishDate',
      type: 'date',
      error: errors.finishDate,
      isDirty: dirtyFields.finishDate,
    },
  ]

  // Submit edit anime list
  const onSubmit = async (req) => {
    if (req.animePlatformId === 0) req.animePlatformId = null;
    const { success, data, message } = await updateAnimeList(
      anime.id, req.animePlatformId, req.startDate, req.finishDate, 
      req.progress, req.score, req.episodesDifference, req.status, req.isSyncedWithMal
    )
    if (success) {
      toast.success(message)
      handleClose()
      delete data.anime;
      anime.myListStatus = data;
    } else {
      toast.error(message)
    }
  };

  // Get list status from MyAnimeList
  const [isLoading, setIsLoading] = useState(false)
  const checkMyAnimeListStatus = async () => {
    setIsLoading(true);
    const { success, message, data } = await getMyAnimeListStatus(anime.malId)
    const my_list_status = data.my_list_status;
    if (success) {
      toast.success(message);
      console.log(my_list_status);
      setValue('startDate', my_list_status.start_date || null, { shouldDirty: true })
      setValue('finishDate', my_list_status.finish_date || null, { shouldDirty: true })
      setValue('progress', my_list_status.num_episodes_watched || 0, { shouldDirty: true })
      setValue('score', my_list_status.score || 0, { shouldDirty: true })
      setValue('status', my_list_status.status || 'plan_to_watch', { shouldDirty: true })
    } else {
      toast.error(message);
    }
    setIsLoading(false);
  }

  // Component

  // Responsive
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Dialog edit anime list
  const descriptionElementRef = useRef(null);
  useEffect(() => {
    if (isOpen) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [isOpen]);
  const handleClose = () => {
    reset()
    handleClick()
  }

  // Dialog delete anime list
  const [open, setOpen] = useState(false);
  const handleOpen = (value) => {
    setOpen(value)
  }

  return (
    <>
    <Dialog
      component={'form'}
      onSubmit={handleSubmit(onSubmit)}
      fullScreen={isMobile}
      open={isOpen}
      onClose={handleClose}
      scroll={'paper'}
      maxWidth={'md'}
      aria-labelledby="anime-title"
      aria-describedby="anime-description"
    >
      <DialogContent dividers={true} className="flex flex-wrap flex-col md:flex-row gap-5">
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
              {anime.status ? convertAnimeStatus(anime.status) : ''}
              {(anime.status && anime.num_episodes) ? ', ' : ''}
              {anime.num_episodes ? `${anime.num_episodes} eps` : ''}
            </Typography>
          </Box>

          {/* Core Form */}
          <Box className="flex flex-col gap-5"> 
            {/* Dekstop */}
            <Box className="hidden md:flex flex-wrap flex-col md:flex-row justify-between gap-2.5">
              {menuSelect.map((menu, i) => (
                <InputField menu={menu} key={i} control={control} isSubmitting={isSubmitting} />
              ))}
            </Box>

            {/* Mobile */}
            <Box className="flex flex-col gap-5 md:hidden">
              <Box className="flex flex-wrap gap-2.5">
                <Typography fontSize={'small'}>Status</Typography>
                <Box className="flex flex-wrap gap-2.5">
                  {menuSelect[0].menus.map((menu, i) => (
                    <Button key={i} 
                      variant={menu === status ? 'contained' : 'outlined'} 
                      onClick={() => setValue('status', menu.value)} 
                      color="default" disableElevation
                      sx={
                        menu.value === status ? 
                        { backgroundColor: menu.color, color: '#FFF', textTransform: 'none' } : 
                        { border: "1px solid rgba(0, 0, 0, 0.23)", color: 'rgba(0, 0, 0, 0.5)', textTransform: 'none' }
                      }
                    >
                      {menu.text}
                    </Button>
                  ))}
                </Box>
              </Box>
              <Box className="flex flex-col gap-2.5">
                <Typography fontSize={'small'}>Progress: {progress ? progress : ' - '}</Typography>
                <SlideNumber value={progress} setValue={(value) => setValue('progress', value)} menu={menuSelect[1].menus} />
              </Box>
              <Box className="flex flex-col gap-2.5">
                <Typography fontSize={'small'}>Score: {score ? score : ' - '}</Typography>
                <SlideNumber value={score} setValue={(value) => setValue('score', value)} menu={menuSelect[2].menus} />
              </Box>
            </Box>

            {/* <Box className="flex flex-col md:flex-row justify-between gap-5 md:gap-2.5">
              <DatePicker label={'Mulai nonton'} defaultValue={dayjs()} className="w-full" slotProps={
                isMobile && { textField: { variant: 'standard'} }
              }/> 
              <DatePicker label={'Selesai nonton'} defaultValue={dayjs()} className="w-full"slotProps={
                isMobile && { textField: { variant: 'standard'} }
              }/> 
            </Box> */}

            <Box className="flex flex-col lg:flex-row items-center justify-between gap-5">
              <Button 
                startIcon={<CloudDownloadOutlined />} variant="contained" size="small" 
                sx={{ 
                  textTransform: 'none', bgcolor: '#2e51a2'
                }}
                onClick={checkMyAnimeListStatus} disabled={isLoading}
              >
                Cek status MyAnimeList saya
              </Button>
              <Box className="pr-5 md:pr-2">
                <Controller 
                  render={({ field }) => (
                    <Switch text={'Sinkronisasi dengan MyAnimeList'} labelPlacement="start" field={field} />
                  )}
                  name={'isSyncedWithMal'}
                  control={control}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions {...(isMobile && { sx: { justifyContent: 'space-between' } })}>
        <Button 
          onClick={() => handleOpen(true)} disabled={isSubmitting || !anime.myListStatus?.status}
          startIcon={<Delete />} variant="contained" color="secondary" 
        >
          Hapus
        </Button>
        <Box className="flex gap-3">
          {isMobile && <Button color="init" onClick={handleClose}>Batal</Button>}
          <Button endIcon={<Save />} variant="contained" type="submit" disabled={isSubmitting}>
            Simpan
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
    <AnimeListDelete
      anime={anime} open={open} handleOpen={handleOpen} handleCloseEditAnime={handleClick} 
    />
    </>
  )
}

function AnimeListDelete({ anime, open, handleOpen, handleCloseEditAnime }) {
  // Form

  // Setting
  const { control, handleSubmit, formState: { isSubmitting }, reset } = useForm({
    resolver: zodResolver(deleteAnimeListSchema), values: {
      isSyncedWithMal: anime.myListStatus?.isSyncedWithMal || false
    }
  })

  // Submit delete anime list
  const onSubmit = async (req) => {
    // Update isSyncedWithMal first
    const statusSynced = await updateAnimeList(
      anime.id, undefined, undefined, undefined, undefined, undefined, undefined, undefined, req.isSyncedWithMal
    )
    if (!statusSynced.success) {
      toast.error(statusSynced.message)
      return
    }

    // If all done, delete anime list
    const { success, message } = await deleteAnimeList(anime.id);
    if (success) {
      toast.success(message);
      handleOpen(false);
      handleCloseEditAnime();
      delete anime.myListStatus;
    } else {
      toast.error(message);
    }
  }

  // Component

  const handleClose = () => {
    reset()
    handleOpen(false)
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      component={'form'}
      onSubmit={handleSubmit(onSubmit)}
    >
      <DialogTitle>{`Hapus anime "${anime.title}" dari list Anda?`}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {
            `Tindakan ini juga akan menghapus status di MyAnimeList Anda. 
            Silakan matikan fitur sinkronisasi jika tetap ingin mempertahankan list di MyAnimeList`
          }
        </DialogContentText>
        <Box className="mt-5 text-right ">
          <Controller 
            render={({ field }) => (
              <Switch text={'Sinkronisasi dengan MyAnimeList'} labelPlacement="start" field={field}/>
            )}
            name={'isSyncedWithMal'}
            control={control}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button 
          startIcon={<Close />} color="secondary" variant="contained" 
          onClick={handleClose} disabled={isSubmitting} 
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