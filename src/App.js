import React,{useEffect } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Landing } from "./componen/Landing";
import { DashboardPages } from "./pages/DashboardPages";
import { UserListPages } from "./pages/UserListPages";
import { DataBookingPages } from './pages/DataBookingPages';
import { LoginPage } from './componen/Login';
import { Me } from './fitur/AuthSlice';
import { useDispatch  } from 'react-redux';
import { KategoriPages } from './pages/KategoriPages';
import { ProfilePages } from './pages/ProfilePages';
import { WisataPages } from './pages/WisataPages';
import LandingPages from './pages/LandingPages';
// import { UtamaLanding } from './componen/landing/utamaLanding';

//User
import { UserDashboardPages } from './pages/user/UserDashboardPages';




function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(Me());
  }, [dispatch]);
  return (
   <BrowserRouter>
   <Routes>
    <Route path="/" element={<LandingPages />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/dashboard" element={<DashboardPages />} />
    <Route path="/userlist" element={<UserListPages />} />
    <Route path="/databooking" element={<DataBookingPages />} />
    <Route path="/kategori" element={<KategoriPages />} />
    <Route path="/wisata" element={<WisataPages />} />
    <Route path="/profile" element={<ProfilePages />} />

    {/* USER ROUTE */}
    <Route path="/userdashboard" element={<UserDashboardPages />} />
    



   </Routes>
   
   </BrowserRouter>
  );
}

export default App;
