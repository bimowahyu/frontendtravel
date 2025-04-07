import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Landing } from "./componen/Landing";
import { DashboardPages } from "./pages/DashboardPages";
import { UserListPages } from "./pages/UserListPages";
import { DataBookingPages } from './pages/DataBookingPages';
import { LoginPage } from './componen/Login';
import { Me } from './fitur/AuthSlice';
import { useDispatch } from 'react-redux';
import { KategoriPages } from './pages/KategoriPages';
import { ProfilePages } from './pages/ProfilePages';
import { WisataPages } from './pages/WisataPages';
import LandingPages from './pages/LandingPages';
import { KonfigurasiPages } from './pages/KonfigurasiPages';
import { SlidePages } from './pages/SlidePages';

// User
import { UserDashboardPages } from './pages/user/UserDashboardPages';
import BookingConfirmation from './componen/landing/BookTrip/BookingConfirmation';
import BookingForm from './componen/landing/BookTrip/BookingForm';
import Payment from './componen/landing/BookTrip/Payment ';
import PaymentStatus from './componen/landing/BookTrip/PaymentStatus';

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
        <Route path="/konfigurasi" element={<KonfigurasiPages />} />
        <Route path="/slide" element={<SlidePages />} />
        
        {/* USER ROUTE */}
        <Route path="/userdashboard" element={<UserDashboardPages />} />
        <Route path="/booking/:wisataId" element={<BookingForm />} />
        <Route path="/booking-confirmation" element={<BookingConfirmation />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/booking-status" element={<PaymentStatus />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;