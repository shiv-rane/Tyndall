import { Navigate, Outlet } from 'react-router-dom';

// Function to check if the token has expired
const isTokenExpired = (token) => {
  const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
  const expiryTime = decodedToken.exp * 1000; // Convert expiry time from seconds to milliseconds
  const currentTime = Date.now();
  return currentTime > expiryTime;
};

const ProtectedRoute = () => {
  const token = JSON.parse(localStorage.getItem('token'));

  // If there's no token or the token is expired, redirect to login
  if (!token || isTokenExpired(token.token)) {
    localStorage.removeItem('token'); // Clean up expired token
    return <Navigate to="/login" />;
  }

  // If the token is valid, render the nested route (Outlet)
  return <Outlet />;
};

export default ProtectedRoute;

