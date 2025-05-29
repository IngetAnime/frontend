import { Add, Check, Download, Person } from "@mui/icons-material";
import { Avatar, Box, Button, Card, CircularProgress, Container, FormControl, InputLabel, MenuItem, Select, Tab, Tabs, TextField, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { importMyAnimeListSchema, updateUserProfileSchema } from "../validators/user.validator";
import ButtonLink from "../component/ButtonLink";
import { getUserInformation, importAnimeList, checkEmailAvailability, checkUsernameAvailability, updateUserProfile } from "../services/user.service";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getGoogleAuthUrl, getMALAuthUrl } from "../services/auth.service";

export default function Settings({ }) {
  const { isLoggedIn, userData, setUserData } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn === false) {
      const lastPath = localStorage.getItem('lastPath');
      navigate(lastPath || '/')
    }
  }, [isLoggedIn, navigate])

  return (
    <Box className="flex flex-col gap-4 px-4 sm:px-6 pt-5">
      {
        isLoggedIn ? 
        <>
          <Typography variant="h2">Pengaturan Akun</Typography>
          <Container className="flex flex-col items-center">
            <Card variant="outlined" className="p-5 flex flex-col gap-10 w-full">
              <Profile userData={userData} setUserData={setUserData} />
              <Box className="flex-1 flex flex-col lg:flex-row gap-7.5 lg:gap-10 justify-between">
                <ExternalAccount userData={userData} setUserData={setUserData} isLoggedIn={isLoggedIn} />
                <ImportMyAnimeList />
              </Box>
            </Card>
          </Container>
        </> :
        <CircularProgress />
      }
    </Box>
  )
}

function Profile({ userData, setUserData }) {
  const { register, setError, clearErrors, watch, handleSubmit, formState: { errors, isSubmitting } } = useForm({ 
    resolver: zodResolver(updateUserProfileSchema), mode: 'onChange', values: {
      username: userData.username, email: userData.email
    }
  });
  const email = watch('email');
  const username = watch('username');
  const [emailMessage, setEmailMessage] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');

  const onSubmit = async (req) => {
    const { data, success, message } = await updateUserProfile(req.username, req.email);
    if (success) {
      setUserData(prev => ({
        ...prev, ...data
      }));
      toast.success(message);
    } else {
      toast.error(message);
    }
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout( async () => {
      setEmailMessage('Mengecek ...');
      if (errors.email) return; // Local error
      if (email === userData.email) { setEmailMessage(''); return; } // Not change
      const { status, message } = await checkEmailAvailability(email); // Hit API
      if (status === 400 || status === 409) {
        setError('email', { message: message });
      } else {
        setEmailMessage(message);
      }
    }, 1000)

    return () => clearTimeout(delayDebounceFn);
  }, [email, userData]);

  useEffect(() => {
    const delayDebounceFn = setTimeout( async () => {
      setUsernameMessage('Mengecek ...');
      if (errors.username) return; // Local error
      if (username === userData.username) { setUsernameMessage(''); return; } // Not change
      const { status, message } = await checkUsernameAvailability(username); // Hit API
      if (status === 400 || status === 409) {
        setError('username', { message: message });
      } else {
        setUsernameMessage(message);
      }
    }, 1000)

    return () => clearTimeout(delayDebounceFn);
  }, [username, userData]);

  return (
    <Box className="flex flex-col gap-2.5">
      <Typography>Profil</Typography>
      <Box className="flex flex-col md:flex-row gap-10 items-center">
        <Avatar 
          {...(userData ? { src: userData.picture, alt: userData.username } : {})} 
          sx={{ width: '10rem', height: '10rem' }}
        />
        <Box className="flex flex-col gap-2.5 w-full" component={'form'} onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            size="small"
            disabled={isSubmitting}
            id="email"
            label="Email"
            autoComplete="email"
            {...register('email', { 
              onChange: () => { 
                clearErrors('root'); 
                clearErrors('email'); 
              }
            })}
            helperText={
              errors.email ? errors.email.message : 
              errors.root ? 'Email tidak cocok' :
              emailMessage
            }
            {...((errors.email) && { error: true })}
            {...((errors.root) && { error: true })}
          />
          <TextField
            fullWidth
            size="small"
            disabled={isSubmitting}
            id="username"
            label="Username"
            autoComplete="username"
            {...register('username', { 
              onChange: () => { 
                clearErrors('root'); 
                clearErrors('username'); 
              }
            })}
            helperText={
              errors.username ? errors.username.message : 
              errors.root ? 'Username tidak cocok' :
              usernameMessage
            }
            {...((errors.username) && { error: true })}
            {...((errors.root) && { error: true })}
          />
          <Button startIcon={<Check />} variant="contained" type="submit" disabled={isSubmitting}>Simpan</Button>
        </Box>
      </Box>
    </Box>
  )
}

function ExternalAccount({ userData, setUserData, isLoggedIn }) {
  const navigate = useNavigate();
  const lastPath = localStorage.getItem('lastPath');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const { success, data } = await getUserInformation();
      if (success) {
        setUserData(data);
        setIsLoading(false);
      } else {
        navigate(lastPath)
      }
    }

    getData();
  }, [isLoggedIn])

  return (
    <Box className="flex flex-col gap-2.5 w-full">
      <Typography>Akun eksternal</Typography>
      <Box className="flex gap-2.5">
        <ButtonLink 
          fullWidth sx={{ textTransform: 'none' }}
          variant="contained" color="default" 
          startIcon={<img src="/images/google.png" alt="MAL" style={{ height: 15 }}/>}
          onClick={async () => {
            try {
              const { data } = await getGoogleAuthUrl('connect');
              window.location.href = data.authorizationUrl
            } catch(err) {
              toast.error('Terjadi kesalahan')
            }
          }}  
        >
          <Typography className="overflow-hidden flex items-center" fontSize={'small'}>
            {
              isLoading ? 
              <CircularProgress size={'1rem'} sx={{ color: 'black' }} /> :
              userData.googleId ? userData.googleEmail : 'Belum terhubung'
            }
          </Typography>
        </ButtonLink>
        <ButtonLink 
          fullWidth sx={{ textTransform: 'none', background: '#2E51A2' }} 
          variant="contained" color="primary" 
          startIcon={<img src="/images/mal.png" alt="MAL" style={{ height: 25 }}/>}
          onClick={async () => {
            try {
              const { data } = await getMALAuthUrl('connect');
              window.location.href = data.authorizationUrl
            } catch(err) {
              toast.error('Terjadi kesalahan')
            }
          }}  
        >
          <Typography className="overflow-hidden flex items-center" fontSize={'small'}>
            {
              isLoading ? 
              <CircularProgress size={'1rem'} sx={{ color: '#FFF' }} /> :
              userData.myAnimeList ? userData.myAnimeList.name : 'Belum terhubung'
            }
          </Typography>
        </ButtonLink>
      </Box>
    </Box>
  )
}

function ImportMyAnimeList() {
  const { control, formState: { isSubmitting }, handleSubmit } = useForm({
    resolver: zodResolver(importMyAnimeListSchema), values: {
      type: 'latest_updated',
      isSyncedWithMAL: false
    }
  })

  const onSubmit = async (req) => {
    const { success, message } = await importAnimeList(req.type, req.isSyncedWithMAL);
    if (success) {
      toast.success(message)
    } else {
      toast.error(message);
    }
  }

  const selectItem = [
    {
      text: 'Lewati duplikat',
      value: 'skip_duplicates',
      description: 'Hanya menambahkan list yang belum ada, jika sudah ada akan dilewati'
    },
    {
      text: 'Timpa semuanya',
      value: 'overwrite_all',
      description: 'Seluruh list yang sudah ada akan diganti dengan list MyAnimeList'
    },
    {
      text: 'Terakhir diubah',
      value: 'latest_updated',
      description: 'Jika list MyAnimeList lebih baru diubah, list lama akan diganti'
    },
  ]

  return (
    <Box className="flex flex-col gap-2.5 justify-center w-full">
      <Typography>Integrasi list dari MyAnimeList</Typography>
      <Box component={'form'} className="flex gap-2.5 items-center" onSubmit={handleSubmit(onSubmit)}>
        <FormControl size="small" disabled={isSubmitting} className="w-full">
          <InputLabel id={'type'}>Tipe</InputLabel>
          <Controller
            render={({ field }) => (
              <Select { ...field }
              labelId={'type'}
              id={'type'}
              label={'Tipe'}
              >
                {selectItem.map((item, index) => (
                  <MenuItem value={item.value ?? item.text} className="flex items-center" key={index}>
                    {item.text}
                  </MenuItem>
                ))}
              </Select>
            )}
            name={'type'} 
            control={control}
          />
        </FormControl>
        <Box>
          <Button variant="contained" startIcon={<Add />} type="submit" disabled={isSubmitting}>Tambah</Button>
        </Box>
      </Box>
    </Box>
  )
}