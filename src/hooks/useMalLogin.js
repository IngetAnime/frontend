import { useNavigate } from "react-router-dom";
import { loginWithMal } from "../services/auth.service";
import { toast } from "react-toastify";
import useLogin from "./useLogin";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

export default function useMalLogin() {
  const navigate = useNavigate()
  const loginUser = useLogin()
  const { setUserData } = useContext(AppContext)
  const lastPath = localStorage.getItem('lastPath') || '/';
  const malLogin = async (code, state) => {
    if (!code || !state) return;
    const stateDedoced = JSON.parse(atob(state));
    const { success, message, data } = await loginWithMal(code, state);
    if (success) {
      if (stateDedoced.mode === 'connect') {
        setUserData((prev) => ({
          ...prev, data
        }));
        toast.success(message);
        navigate('/user');
      } else {
        loginUser(data);
      }
    } else {
      toast.error(message);
      navigate(stateDedoced.mode === 'connect' ? '/user' : lastPath);
    }
  }

  return malLogin;
}