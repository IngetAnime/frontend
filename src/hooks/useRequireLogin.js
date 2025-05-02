import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

export function useRequireLogin(redirectTo = "/auth/login") {
  const { isLoggedIn } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn === false) {
      navigate(redirectTo);
    }
  }, [isLoggedIn, navigate, redirectTo]);

  return { isLoggedIn };
}