import { Typography, Button, CircularProgress } from '@mui/material';
import { Send } from '@mui/icons-material';
import { Form, TitleAndSubtitle } from './AuthPage';
import { useEffect, useRef } from 'react';
import { resendVerification } from '../../services/auth.service';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useRequireLogin } from '../../hooks/useRequireLogin';
import { useResendCountdown } from '../../hooks/useResendCountdown';
import useVerifyEmail from '../../hooks/useVerifyEmail';

export default function EmailVerificationPage() {
  const verifyEmailUser = useVerifyEmail()
  const didRun = useRef(false)
  const [ searchParam ] = useSearchParams();
  const { isLoggedIn } = useRequireLogin();
  const { seconds, canResend, start } = useResendCountdown(60)

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;
    
    const token = searchParam.get('token');
    if (token) verifyEmailUser(token);
  }, [searchParam, verifyEmailUser])

  const { handleSubmit, formState: { isSubmitting } } = useForm()

  const handleResend = async () => {
    if (!canResend) return;
    const { success, message } = await resendVerification();
    if (success) {
      toast.success(message);
      start()
    } else {
      toast.error(message)
    }
  };  

  return (
    <>
      {/* Title and subtitle */}
      <TitleAndSubtitle title={'Yōkoso!!!'} subtitle={'Cari tempat nonton anime terbaik? Yuk eksplor disini!'}/>
      
      {
        isLoggedIn === null ? (<CircularProgress className='m-auto' />) : 
        isLoggedIn === false ? null : 
        <Form onSubmit={handleSubmit(handleResend)}>
          <Typography textAlign={'center'}>Belum menerima tautan verifikasi?</Typography>
          <Button variant="contained" color="primary" endIcon={<Send />} type="submit" disabled={!canResend || isSubmitting} size="large">
            Kirim tautan {!canResend ? ` ulang dalam ${seconds} detik` : ''}
          </Button>
        </Form>
      }

      {/* Reset password form */}
      {/* <ButtonLink variant="contained" color="primary" startIcon={<ArrowBack />} to={'/'} size="large">
        Kembali
      </ButtonLink> */}
    </>
  )
}