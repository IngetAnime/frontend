import { useNavigate } from "react-router-dom";
import { loginWithGoogle } from "../services/auth.service";
import { toast } from "react-toastify";
import useLogin from "./useLogin";

export default function useGoogleLogin() {
  const navigate = useNavigate()
  const loginUser = useLogin()
  const googleLogin = async (code) => {
    if (!code) return;
    const { success, message, data } = await loginWithGoogle(code);
    if (success) {
      loginUser(data)
      navigate('/')
    } else {
      toast.error(message)
    }
  }

  return googleLogin;
}