import { useEffect, useState } from "react";
import {
  Button,
  Container,
  Image,
  Nav,
  Spinner,
  Alert,
  Navbar,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import useSWR from "swr";
import { ArrowUpIcon } from "../icons";
import "./Menu.css";

// Redux imports
import { useSelector, useDispatch } from 'react-redux';
import { Logout } from "../../../fitur/AuthSlice";

const getApiBaseUrl = () => {
  const protocol = window.location.protocol === "https:" ? "https" : "http";
  const baseUrl = process.env.REACT_APP_API_BASE_URL.replace(/^https?:\/\//, "");
  return `${protocol}://${baseUrl}`;
};

const fetcher = (url) => axios.get(url).then((res) => res.data);

export const Menu = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { isAuthenticated, user, isLoading: authLoading } = useSelector(state => state.auth);
  const userRole = user?.data?.role;
  const { data: logoData, error } = useSWR(`${getApiBaseUrl()}/getkonfigurasi`, fetcher);
  const [scrolling, setScrolling] = useState(false);

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    setScrolling(scrollPosition > 50);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const handleLogin = () => navigate('/login');
  const handleSignup = () => navigate('/signup');
  const handleLogout = async () => {
    await dispatch(Logout());
    navigate('/');
  };
  const handleDashboard = async () => {
    navigate('/userdashboard');
  };

  if (error) return <Alert variant="danger">Gagal memuat logo!</Alert>;
  if (!logoData) return (
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );

  const logoUrl = `${getApiBaseUrl()}${logoData.data.logoTravel}`;
  const handleScrollToTopButton = () => window.scrollTo({ top: 0 });

  return (
    <>
      <Navbar
        fixed='top'
        collapseOnSelect
        expand='lg'
        className={`${
          scrolling ? "bg-white shadow-sm" : "bg-transparent"
        } pb-4`}
      >
        <Container>
          {/* Logo with smaller size */}
          {/* <Navbar.Brand href='#hero'>
            <Image
              src={logoUrl}
              alt={logoData.data.namaTravel || "Logo"}
              className='d-inline-block align-top'
              style={{ maxHeight: '80px' }} 
            />
          </Navbar.Brand> */}
          {/* Navbar Toggler for Responsive */}
          <Navbar.Toggle
            aria-controls='responsive-navbar-nav'
            className='border-0'
          />
          <Navbar.Collapse
            id='responsive-navbar-nav'
            className='justify-content-end font-open-sans mt-3'
          >
            <Nav className='gap-xl-5 gap-lg-4 gap-md-2'>
              {authLoading ? (
                <Spinner animation="border" size="sm" />
              ) : isAuthenticated ? (
                <>
                  {user && <span className="me-3 d-flex align-items-center">Hi, { user.data.username}</span>}
                  {/* {user && console.log("User data:", user) && <span className="me-3 d-flex align-items-center">Hi, {user.data?.username}</span>} */}
                  <Button
                    variant='light'
                    className='bg-transparent border-0 fw-medium'
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                  {user && userRole  === "user" && (
                  <Button
                    variant='light'
                    className='bg-transparent border-0 fw-medium'
                    onClick={handleDashboard}
                  >
                    Dashboard
                  </Button>
                  )}
                </>
              ) : (
                <>
                  <Button
                    variant='light'
                    className='bg-transparent border-0 fw-medium'
                    onClick={handleLogin}
                  >
                    Login
                  </Button>
                  <Button 
                    variant='outline-dark fw-medium'
                    onClick={handleSignup}
                  >
                    Sign up
                  </Button>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Scroll To Top Button  */}
      {scrolling && (
        <Button
          variant='light'
          className='scroll-to-top position-fixed end-0 bottom-0 border-0 p-2 m-3 rounded-circle z-1 d-flex justify-content-center align-items-center'
          onClick={handleScrollToTopButton}
        >
          <ArrowUpIcon />
        </Button>
      )}
    </>
  );
};