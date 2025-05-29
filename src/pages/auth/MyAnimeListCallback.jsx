import { CircularProgress } from "@mui/material";
import { TitleAndSubtitle } from "./AuthPage";
import { useSearchParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import useMalLogin from "../../hooks/useMalLogin";

export default function MyAnimeListCallback() {
  const loginWithMal = useMalLogin()
  const didRun = useRef(false)
  const [ searchParam ] = useSearchParams();
  
  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;
    
    const code = searchParam.get('code');
    const state = searchParam.get('state');
    if (code && state) loginWithMal(code, state);
  }, [searchParam, loginWithMal])
  
  return (
    <>
      <TitleAndSubtitle title={'Yōkoso!!!'} subtitle={'Cari tempat nonton anime terbaik? Yuk eksplor disini!'}/>
      <CircularProgress className='m-auto' />
    </>
  )
}