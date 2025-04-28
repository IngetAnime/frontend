import { Close, CloudDownloadOutlined, Edit, FileUpload, Refresh } from "@mui/icons-material";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { InputSelect } from "./SortAndFilter";
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from "dayjs";
import Switch from "./Switch";
import AnimeImage from "./AnimeImage";

export default function AnimeEdit() {
  const totalEpisode = 12;
  const menuSelect = [
    {
      name: 'Status',
      isMultiple: false,
      menus: [
        { text: 'Berjalan' },
        { text: 'Selesai' },
        { text: 'Ditunda' },
        { text: 'Ditinggalkan' },
        { text: 'Direncanakan' },
      ]
    },
    {
      name: 'Progres',
      isMultiple: false,
      menus: [
        ...Array(totalEpisode + 1).fill(null).map((_, i) => {
          return {
            text: i.toString()
          }
        })
      ]
    },
    {
      name: 'Score',
      isMultiple: false,
      menus: [
        ...Array(10 + 1).fill(null).map((_, i) => {
          return {
            text: i.toString()
          }
        })
      ]
    },
    {
      name: 'Platform',
      isMultiple: false,
      menus: [
        { text: 'Muse - YouTube' },
        { text: 'AniOne - YouTube' },
        { text: 'Bstation' },
        { text: 'Netflix' },
        { text: 'Catchplay+' },
        { text: 'Crunchyroll' },
      ]
    }

  ]
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
      <IconButton size="small" onClick={handleClickOpen}><Edit fontSize="small"/></IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={'paper'}
        maxWidth={'md'}
        aria-labelledby="anime-title"
        aria-describedby="anime-description"
      >
        <DialogTitle id="anime-title">
          <Typography variant="h2">Perbarui Status Anime</Typography>
        </DialogTitle>  
        <DialogContent dividers={true} className="flex flex-col md:flex-row gap-5">
          <Box className="hidden md:block">
            <AnimeImage />
          </Box>
          <Box className="flex flex-col gap-5">
            <Box textAlign={'center'}>
              <Typography 
                sx={{ 
                  display: '-webkit-box', WebkitLineClamp: { xs: 2, md: 1 }, WebkitBoxOrient: 'vertical', 
                  fontWeight: 'bold'
                }}
                className="overflow-hidden"
              >
                Slime Taoshite 300-nen, Shiranai Uchi ni Level Max ni Nattemashita: Sono Ni
              </Typography>
              <Typography fontWeight={'normal'} fontSize={'small'}>On going, 12 eps</Typography>
            </Box>
            <Box className="flex flex-col gap-5"> 
              <Box className="flex flex-wrap flex-col md:flex-row justify-between gap-2.5">
                {menuSelect.map((menu, i) => (
                  <InputSelect name={menu.name} menu={menu.menus} isMultiple={menu.isMultiple} sx={{ width: { md: '49%'}, marginTop: '0.5rem' }} key={i} />
                ))}
              </Box>
              <Box className="flex flex-col md:flex-row justify-between gap-5 md:gap-2.5">
                <DatePicker label={'Mulai nonton'} defaultValue={dayjs()} className="w-full"/> 
                <DatePicker label={'Selesai nonton'} defaultValue={dayjs()} className="w-full"/> 
              </Box>
              <Box className="flex flex-col md:flex-row items-center justify-between gap-5">
                <Button onClick={handleClose} startIcon={<CloudDownloadOutlined />} variant="contained" size="small" sx={{ 
                  textTransform: 'none', bgcolor: '#2e51a2'
                }}>
                  Cek status MyAnimeList saya
                </Button>
                <Box className="pr-5 md:pr-2">
                  <Switch text={'Sinkronisasi dengan MyAnimeList'} labelPlacement="start"/>
                </Box>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} startIcon={<Close />} variant="contained" color="secondary">Batal</Button>
          <Button onClick={handleClose} endIcon={<FileUpload />} variant="contained">Simpan</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}