import { CircularProgress } from "@mui/material";
import { TitleAndSubtitle } from "./AuthPage";
import { useSearchParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import useGoogleLogin from "../../hooks/useGoogleLogin";

export default function GoogleCallback() {
  const loginWithGoogle = useGoogleLogin()
  const didRun = useRef(false)
  const [ searchParam ] = useSearchParams();
  
  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;
    
    const code = searchParam.get('code');
    const state = searchParam.get('state');
    loginWithGoogle(code, state);
  }, [searchParam, loginWithGoogle])

  return (
    <>
      <TitleAndSubtitle title={'Yōkoso!!!'} subtitle={'Cari tempat nonton anime terbaik? Yuk eksplor disini!'}/>
      <CircularProgress className='m-auto' />
    </>
  )
}