import React, { useState } from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  TableContainer, 
  Table, 
  TableHead, 
  TableBody, 
  TableRow, 
  TableCell, 
  Paper, 
  Modal, 
  Button 
} from '@mui/material';
import { 
  Person, 
  BookOnline, 
  TravelExplore 
} from "@mui/icons-material";
import useSWR from 'swr';
import axios from 'axios';

axios.defaults.withCredentials = true;

const getApiBaseUrl = () => {
  const protocol = window.location.protocol === 'https:' ? 'https' : 'http';
  const baseUrl = process.env.REACT_APP_API_BASE_URL.replace(/^https?:\/\//, '');
  return `${protocol}://${baseUrl}`;
};

const fetcher = (url) => axios.get(url).then((res) => res.data);

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(price);
};

export const UserDashboard = () => {
  const { data: userData } = useSWR(`${getApiBaseUrl()}/getuser`, fetcher);
  const { data: bookingData } = useSWR(`${getApiBaseUrl()}/getbooking`, fetcher);
  const { data: wisataData } = useSWR(`${getApiBaseUrl()}/getwisata`, fetcher);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [open, setOpen] = useState(false);

  const handleOpen = (booking) => {
    setSelectedBooking(booking);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedBooking(null);
    setOpen(false);
  };

  if (!userData || !bookingData || !wisataData) return <Typography>Loading...</Typography>;

  const totalUsers = userData.data.length;
  const totalBookings = bookingData.data.length;
  const totalWisata = wisataData.data.length;

  return (
    <Box sx={{ flexGrow: 1, p: { xs: 1, sm: 3 }, backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      {/* Statistics Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{
            bgcolor: "#73C7C7",
            color: "white",
            textAlign: "center",
            boxShadow: 3,
            transition: "0.3s",
            "&:hover": { transform: "scale(1.05)", boxShadow: 6 },
          }}>
            {/* <CardContent>
              <Person sx={{ fontSize: 40 }} />
              <Typography variant="h6" gutterBottom>Total Users</Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>{totalUsers}</Typography>
            </CardContent> */}
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{
            bgcolor: "#BAD8B6",
            color: "white",
            textAlign: "center",
            boxShadow: 3,
            transition: "0.3s",
            "&:hover": { transform: "scale(1.05)", boxShadow: 6 },
          }}>
            <CardContent>
              <BookOnline sx={{ fontSize: 40 }} />
              <Typography variant="h6" gutterBottom>Total Bookings</Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>{totalBookings}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{
            bgcolor: "#e17055",
            color: "white",
            textAlign: "center",
            boxShadow: 3,
            transition: "0.3s",
            "&:hover": { transform: "scale(1.05)", boxShadow: 6 },
          }}>
            <CardContent>
              <TravelExplore sx={{ fontSize: 40 }} />
              <Typography variant="h6" gutterBottom>Travel Packages</Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>{totalWisata}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bookings Table */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h6" gutterBottom>Booking Data</Typography>
        <TableContainer component={Paper} sx={{ overflowX: 'auto', maxWidth: '100%', borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Booking Date</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Package</TableCell>
                <TableCell>Total People</TableCell>
                <TableCell>Total Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookingData.data.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{formatDate(booking.tanggalBooking)}</TableCell>
                  <TableCell>{booking.user.username}</TableCell>
                  <TableCell>{booking.wisatum.nama}</TableCell>
                  <TableCell>{booking.jumlahOrang}</TableCell>
                  <TableCell>{formatPrice(booking.totalHarga)}</TableCell>
                  <TableCell>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: booking.status === 'pending' ? '#ffeeba' : '#c3e6cb',
                      color: booking.status === 'pending' ? '#856404' : '#155724'
                    }}>
                      {booking.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      onClick={() => handleOpen(booking)}
                    >
                      Detail
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Detail Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="booking-detail-modal"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 400 },
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}>
          {selectedBooking && (
            <>
              <Typography variant="h6" gutterBottom>Booking Details</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography><strong>Customer:</strong> {selectedBooking.user.username}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography><strong>Email:</strong> {selectedBooking.user.email}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography><strong>Phone:</strong> {selectedBooking.user.phone}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography><strong>Package:</strong> {selectedBooking.wisatum.nama}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography><strong>Location:</strong> {selectedBooking.wisatum.lokasi}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography><strong>Category:</strong> {selectedBooking.wisatum.kategori.namaKategori}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography><strong>Booking Date:</strong> {formatDate(selectedBooking.tanggalBooking)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography><strong>Total People:</strong> {selectedBooking.jumlahOrang}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography><strong>Total Price:</strong> {formatPrice(selectedBooking.totalHarga)}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography><strong>Status:</strong> {selectedBooking.status}</Typography>
                </Grid>
              </Grid>
              <Box sx={{ mt: 3, textAlign: 'right' }}>
                <Button variant="contained" onClick={handleClose}>Close</Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default UserDashboard;