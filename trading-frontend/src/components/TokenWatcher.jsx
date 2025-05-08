// TokenWatcher.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      if (isTokenExpired(token)) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    const intervalId = setInterval(checkToken, 60 * 1000); // check every 60 sec
    checkToken(); // run immediately on mount

    return () => clearInterval(intervalId);
  }, [navigate]);

  return null;
};

export default TokenWatcher;
