import { Box, Typography, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import ButtonLink from '../../component/ButtonLink';
import { TitleAndSubtitle } from './AuthPage';

export default function EmailVerificationPage() {
  return (
    <>
      {/* Title and subtitle */}
      <TitleAndSubtitle title={'Yōkoso!!!'} subtitle={'Cari tempat nonton anime terbaik? Yuk eksplor disini!'}/>
      
      {/* Reset password form */}
      <ButtonLink variant="contained" color="primary" startIcon={<ArrowBack />} to={'/'} size="large">
        Kembali
      </ButtonLink>
    </>
  )
}