// TokenWatcher.jsx
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const expiryTime = decodedToken.exp * 1000;
    return Date.now() > expiryTime;
  } catch (error) {
    return true; // Treat invalid token as expired
  }
};

const TokenWatcher = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      const publicRoutes = ["/login", "/register"];

      if (isTokenExpired(token) && !publicRoutes.includes(location.pathname)) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    const intervalId = setInterval(checkToken, 60 * 1000); // check every 60 sec
    checkToken(); // run immediately on mount

    return () => clearInterval(intervalId);
  }, [navigate, location.pathname]);

  return null;
};

export default TokenWatcher;
