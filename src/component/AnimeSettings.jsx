import { useEffect, useRef, useState } from "react"
import { Box, Button, Dialog, DialogActions, DialogContent, InputAdornment, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import AnimeButton from "./AnimeButton";
import { ArrowBack, ArrowForward, Check, Close, CloudDownloadOutlined, Settings } from "@mui/icons-material";
import AnimeImage from "./AnimeImage";
import { InputSelect } from "./SortAndFilter";
import { DatePicker, DateTimePicker } from '@mui/x-date-pickers';
import Switch from "./Switch";
import dayjs from "dayjs";

export default function AnimeSettings({ sx }) {

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
        <DialogContent dividers={true} className="flex flex-wrap flex-col md:flex-row gap-5">
          <Box className="hidden md:block max-w-50">
            <AnimeImage isDialog={true} />
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
                Slime Taoshite 300-nen, Shiranai Uchi ni Level Max ni Nattemashita: Sono Ni
              </Typography>
              <Typography fontWeight={'normal'} fontSize={'small'}>On going, 12 eps</Typography>
            </Box>
            <Box className="flex flex-col gap-5">
              {
                isPlatform ? 
                <EditPlatform handleClose={handleClose} handleIsPlatform={handleIsPlatform}/> :
                <EditAnime handleClose={handleClose} handleIsPlatform={handleIsPlatform}/> 
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

function EditAnime({ handleClose, handleIsPlatform }) {
  const menuSelect = [
    {
      name: 'Judul utama (Romaji)',
      isTextField: true,
    },
    {
      name: 'Judul Inggris',
      isTextField: true,
    },
    {
      name: 'Judul Indonesia',
      isTextField: true,
    },
    {
      name: 'Link gambar',
      isTextField: true,
    },
    {
      name: 'Tanggal rilis',
      isTextField: true,
      type: 'date',
    },
    {
      name: 'Total episode',
      isTextField: true,
      type: 'number',
      endAdornment: 'Eps'
    },
    {
      name: 'Berjalan',
      isTextField: true,
      type: 'dateTime',
    },
    {
      name: 'Tamat',
      isTextField: true,
      type: 'dateTime',
    },
  ]

  return (
    <>
    <Box className="flex flex-wrap flex-col md:flex-row justify-between gap-2.5">
      {menuSelect.map((menu, i) => {
        return <InputField menu={menu} key={i} />
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

function EditPlatform({ handleIsPlatform }) {
  const menus = [
    {
      name: 'Pilih platform',
      isMultiple: false,
      menus: [
        { text: 'Muse - YouTube' },
        { text: 'AniOne - YouTube' },
        { text: 'Bstation' },
        { text: 'Netflix' },
        { text: 'Catchplay+' },
        { text: 'Crunchyroll' },
        { text: 'Platform baru' },
      ]
    },
    {
      name: 'Link',
      isTextField: true,
    },
    {
      name: 'Tipe akses',
      isMultiple: false,
      menus: [
        { text: 'Gratis' },
        { text: 'Waktu terbatas' },
        { text: 'Langganan' },
      ]
    },
    {
      name: 'Episode tayang',
      isTextField: true,
      type: 'number',
      endAdornment: 'Eps'
    },
    {
      name: 'Episode sebelumnya',
      isTextField: true,
      type: 'dateTime',
    },
    {
      name: 'Episode berikutnya',
      isTextField: true,
      type: 'dateTime',
    },
  ]
  return (
    <>
    <Box className="flex flex-wrap flex-col md:flex-row justify-between gap-2.5">
      {menus.map((menu, i) => {
        return <InputField menu={menu} key={i} />
      })}
    </Box>

    <Box className="flex flex-col md:flex-col-reverse lg:flex-row items-center justify-between gap-5">
      <Button onClick={() => handleIsPlatform(false)} startIcon={<ArrowBack />} variant="contained" size="small" sx={{ 
        textTransform: 'none',
      }}>
        Pengaturan anime
      </Button>
      <Box className="pr-5 md:pr-2">
        <Switch text={'Jadikan sebagai platform utama'} labelPlacement="start"/>
      </Box>
    </Box>
    </>
  )
}

function InputField({ menu }) {
  return menu.type === 'date' ? (
    <DatePicker label={menu.name} defaultValue={dayjs()} size="small"
      sx={{ width: { md: 'calc(50% - 0.4rem)' }, marginTop: '0.5rem' }}
    />
  ) : menu.type === 'dateTime' ? (
    <DateTimePicker label={menu.name} defaultValue={dayjs()} size="small"
      sx={{ width: { md: 'calc(50% - 0.4rem)' }, marginTop: '0.5rem' }} slotProps={{ textField: { size: 'small' } }}
    />
  ) : menu.isTextField ? (
    <TextField
      size="small"
      label={menu.name}
      id="outlined-start-adornment"
      type={menu.type && menu.type}
      fullWidth
      sx={{ width: { md: 'calc(50% - 0.4rem)' }, marginTop: '0.5rem' }}
      slotProps={ menu.endAdornment && {
        input: {
          endAdornment: <InputAdornment position="end">{menu.endAdornment}</InputAdornment>,
        },
      }}
    />
  ) : (
    <InputSelect name={menu.name} menu={menu.menus} isMultiple={menu.isMultiple} sx={{ width: { md: 'calc(50% - 0.4rem)' }, marginTop: '0.5rem' }} />
  )
}