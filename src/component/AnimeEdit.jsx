import { Check, Close, CloudDownloadOutlined, Edit, FileUpload, Refresh } from "@mui/icons-material";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Slide, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { InputSelect } from "./SortAndFilter";
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from "dayjs";
import Switch from "./Switch";
import AnimeImage from "./AnimeImage";
import SlideNumber from "./SlideNumber";
import AnimeButton from "./AnimeButton";

export default function AnimeEdit() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const totalEpisode = 12;
  const menuSelect = [
    {
      name: 'Status',
      isMultiple: false,
      menus: [
        { 
          text: 'Berjalan',
          color: '#00BC7D',
        },
        { 
          text: 'Selesai',
          color: '#0092B8',
        },
        { 
          text: 'Direncanakan',
          color: '#90A1B9',
        },
        { 
          text: 'Ditunda',
          color: '#F0B100',
        },
        { 
          text: 'Ditinggalkan',
          color: '#FB2C36',
        },
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

  // Form
  const [progress, setProgress] = useState(0);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState('Direncanakan');

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
        fullScreen={isMobile}
        open={open}
        onClose={handleClose}
        scroll={'paper'}
        maxWidth={'md'}
        aria-labelledby="anime-title"
        aria-describedby="anime-description"
      >
        <DialogContent dividers={true} className="flex flex-col md:flex-row gap-5">
          <Box className="hidden md:block">
            <AnimeImage />
          </Box>
          <Box className="flex flex-col gap-5">
            <Box textAlign={'center'}>
              <Typography 
                sx={{ 
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', 
                  fontWeight: 'bold'
                }}
                className="overflow-hidden"
              >
                Slime Taoshite 300-nen, Shiranai Uchi ni Level Max ni Nattemashita: Sono Ni
              </Typography>
              <Typography fontWeight={'normal'} fontSize={'small'}>On going, 12 eps</Typography>
            </Box>
            <Box className="flex flex-col gap-5"> 
              {/* Dekstop */}
              <Box className="hidden md:flex flex-wrap flex-col md:flex-row justify-between gap-2.5">
                {menuSelect.map((menu, i) => (
                  <InputSelect name={menu.name} menu={menu.menus} isMultiple={menu.isMultiple} sx={{ width: { md: '49%'}, marginTop: '0.5rem' }} key={i} />
                ))}
              </Box>

              {/* Mobile */}
              <Box className="flex flex-col gap-5 md:hidden">
                <Box className="flex flex-wrap gap-2.5">
                  <Typography fontSize={'small'}>Status</Typography>
                  <Box className="flex flex-wrap gap-2.5">
                    {menuSelect[0].menus.map((menu, i) => (
                      <Button key={i} variant={menu.text === status ? 'contained' : 'outlined'} onClick={() => setStatus(menu.text)} 
                        color="default" disableElevation
                        sx={
                          menu.text === status ? 
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
                  <Typography fontSize={'small'}>Progress: {progress}</Typography>
                  <SlideNumber value={progress} setValue={setProgress} menu={menuSelect[1].menus} />
                </Box>
                <Box className="flex flex-col gap-2.5">
                  <Typography fontSize={'small'}>Score: {score}</Typography>
                  <SlideNumber value={score} setValue={setScore} menu={menuSelect[2].menus} />
                </Box>
              </Box>

              <Box className="flex flex-col md:flex-row justify-between gap-5 md:gap-2.5">
                <DatePicker label={'Mulai nonton'} defaultValue={dayjs()} className="w-full" slotProps={
                  isMobile && { textField: { variant: 'standard'} }
                }/> 
                <DatePicker label={'Selesai nonton'} defaultValue={dayjs()} className="w-full"slotProps={
                  isMobile && { textField: { variant: 'standard'} }
                }/> 
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
          <Button onClick={handleClose} endIcon={<Check />} variant="contained">Simpan</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}