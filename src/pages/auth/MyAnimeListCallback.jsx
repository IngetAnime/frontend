import { CircularProgress } from "@mui/material";
import { TitleAndSubtitle } from "./AuthPage";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { loginWithMal } from "../../services/auth.service";
import useLogin from "../../hooks/useLogin";

export default function MyAnimeListCallback() {
  const [ searchParam ] = useSearchParams();
  const navigate = useNavigate();
  const login = useLogin();
  
  const [hasExchanged, setHasExchanged] = useState(false);
  useEffect(() => {
    const code = searchParam.get('code')
    if (!code) {
      toast.error('Code MyAnimeList tidak ditemukan')
      return;
    }

    if (hasExchanged) return;
    
    const exchangeCode = async () => {
      try {
        setHasExchanged(true)
        const { data } = await loginWithMal(code);
        login(data)
      } catch(err) {
        console.log(err);
        // toast.error('Terjadi kesalahan')
        // navigate('/auth/login')
      }
    }

    exchangeCode();
  }, [searchParam, navigate, login, hasExchanged])
  return (
    <>
      <TitleAndSubtitle title={'Yōkoso!!!'} subtitle={'Cari tempat nonton anime terbaik? Yuk eksplor disini!'}/>
      <CircularProgress className='m-auto' />
    </>
  )
}