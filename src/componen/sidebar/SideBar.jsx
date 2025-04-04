import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { LogoutOutlined } from "@mui/icons-material";
import { Logout, reset, Me } from "../../fitur/AuthSlice";

export const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Improved state selection - handle possible undefined states
  const auth = useSelector((state) => state.auth || {});
  const { user, isLoading } = auth;
    
  // Extract role from the proper path in the data structure
  const userRole = user?.data?.role;
  
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  useEffect(() => {
    // Only fetch user data if we don't already have it
    if (!user) {
      dispatch(Me());
    }
  }, [dispatch, user]); // Add user as dependency to prevent infinite calls
  
  useEffect(() => {
    console.log("Auth state:", auth);
    console.log("User data:", user);
    console.log("User role:", userRole);
  }, [auth, user, userRole]);

  const handleLogoutClick = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setOpenConfirmDialog(true);
  };

  const handleConfirmLogout = () => {
    dispatch(Logout());
    dispatch(reset());
    navigate("/");
    setOpenConfirmDialog(false);
  };

  const handleCancelLogout = () => {
    setOpenConfirmDialog(false);
  };

  const navLinkStyle = {
    textDecoration: "none",
    color: "#cbd5e1",
    padding: "12px",
    borderRadius: "8px",
    transition: "all 0.3s ease",
    display: "block",
    "&:hover": {
      backgroundColor: "#B1F0F7",
      color: "white",
      transform: "translateX(8px)",
    },
    "&.active": {
      backgroundColor: "#B1F0F7",
      color: "white",
      boxShadow: "0 4px 6px rgba(177, 240, 247, 0.2)",
    },
  };

  // Handle loading state
  if (isLoading) {
    return <div>Loading...</div>; // Consider a better loading indicator
  }

  return (
    <Box
      sx={{
        bgcolor: "#0A5EB0",
        color: "blue",
        display: { xs: "block", lg: "flex" },
        flexDirection: "column",
        height: "100vh",
        width: { xs: 200, lg: 250 },
        position: "fixed",
        top: 0,
        left: 0,
        p: 2,
        zIndex: 1200,
        overflowY: "auto",
        overflowX: "hidden",
        WebkitOverflowScrolling: "touch",
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "rgba(0,0,0,0.1)",
          borderRadius: "10px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#B1F0F7",
          borderRadius: "10px",
          "&:hover": {
            backgroundColor: "#90E0E7",
          },
        },
        transition: {
          xs: "none",
          lg: "all 0.3s ease" 
        }
      }}
    >
      {/* Logo Section with Animation */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 60,
          mb: 3,
          borderBottom: "1px solid rgb(46, 125, 251)",
          transition: "transform 0.3s ease",
          "&:hover": {
            transform: "scale(1.05)",
          },
        }}
      >
        {/* Logo placeholder */}
      </Box>

      {/* Navigation Links with Hover Effects */}
     {/* User links - available to all users */}
      <Stack spacing={2} sx={{ flex: 1 }}>
      <>
  {/* User links - available to all users */}
  {user && userRole === "user" && (
    <>
      <Typography component={NavLink} to="/userdashboard" sx={navLinkStyle}>
        Dashboard
      </Typography>
      <Typography component={NavLink} to="/pelunasan" sx={navLinkStyle}>
        Pelunasan
      </Typography>
      <Typography component={NavLink} to="/history" sx={navLinkStyle}>
        History
      </Typography>
      <Typography component={NavLink} to="/pemberangkatan" sx={navLinkStyle}>
        Pemberangkatan
      </Typography>
      <Typography component={NavLink} to="/updateprofile" sx={navLinkStyle}>
        Update Profile
      </Typography>
    </>
  )}
</>

        {/* Admin links - only show if user exists and has admin role */}
        {user && userRole  === "admin" && (
          <>
            <Typography component={NavLink} to="/dashboard" sx={navLinkStyle}>
              Dashboard
            </Typography>
            <Typography component={NavLink} to="/userlist" sx={navLinkStyle}>
              Data Pengguna
            </Typography>
            <Typography component={NavLink} to="/databooking" sx={navLinkStyle}>
              Data Booking
            </Typography>
            <Typography component={NavLink} to="/konfigurasi" sx={navLinkStyle}>
              Konfigurasi
            </Typography>
            <Typography component={NavLink} to="/wisata" sx={navLinkStyle}>
              List Wisata
            </Typography>
            <Typography component={NavLink} to="/kategori" sx={navLinkStyle}>
              List Kategori
            </Typography>
          </>
        )}

        {/* Logout Button with Enhanced Styling */}
        <Button
          onClick={handleLogoutClick}
          sx={{
            width: "100%",
            justifyContent: "flex-start",
            color: "#cbd5e1",
            p: 2,
            borderRadius: 1,
            textTransform: "none",
            transition: "all 0.3s ease",
            "&:hover": {
              bgcolor: "#FB4141",
              color: "white",
              transform: "translateX(8px)",
            },
            minHeight: "48px",
            touchAction: "manipulation",
          }}
          startIcon={<LogoutOutlined />}
        >
          Log Out
        </Button>
      </Stack>

      <Divider
        sx={{
          bgcolor: "#B1F0F7",
          my: 2,
          opacity: 0.6,
          transition: "opacity 0.3s ease",
          "&:hover": {
            opacity: 1,
          },
        }}
      />

      {/* Logout Dialog */}
      <Dialog
        open={openConfirmDialog}
        onClose={handleCancelLogout}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
          },
        }}
      >
        <DialogTitle sx={{ fontSize: "1.2rem", fontWeight: 600 }}>
          Konfirmasi Logout
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Apakah Anda yakin ingin keluar dari aplikasi?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCancelLogout}
            color="secondary"
            sx={{
              borderRadius: 1,
              textTransform: "none",
              "&:hover": { bgcolor: "rgba(0,0,0,0.05)" },
            }}
          >
            Batal
          </Button>
          <Button
            onClick={handleConfirmLogout}
            color="error"
            autoFocus
            sx={{
              borderRadius: 1,
              textTransform: "none",
              "&:hover": { bgcolor: "#FB4141", color: "white" },
            }}
          >
            Keluar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Sidebar;