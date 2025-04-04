import React, { useState } from 'react';
import {
  Box,
  Typography,
  Modal,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
  IconButton
} from '@mui/material';
import useSWR, { mutate } from 'swr';
import axios from 'axios';
import moment from 'moment';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const getApiBaseUrl = () => {
  const protocol = window.location.protocol === 'https:' ? 'https' : 'http';
  const baseUrl = process.env.REACT_APP_API_BASE_URL.replace(/^https?:\/\//, '');
  return `${protocol}://${baseUrl}`;
};

const fetcher = (url) => axios.get(url, { withCredentials: true }).then((res) => res.data);

export const DataBooking = () => {
  const { data: bookingData, error: bookingError } = useSWR(`${getApiBaseUrl()}/getbooking`, fetcher);
  const [open, setOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleOpen = (booking) => {
    setSelectedBooking(booking);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedBooking(null);
  };

  const deleteBooking = async(id) => {
    const userConfirm = window.confirm('Apakah anda yakin ingin menghapus booking ini?');

    if (userConfirm) {
      try {
        await axios.delete(`${getApiBaseUrl()}/deletebooking/${id}`, {
          withCredentials: true
        });
        setSnackbar({ open: true, message: "Booking berhasil dihapus", severity: "success" });
        mutate(`${getApiBaseUrl()}/getbooking`);
      } catch (error) {
        setSnackbar({ open: true, message: "Gagal menghapus booking", severity: "error" });
      }
    }
  };

  if (bookingError) return <Typography>Error loading data</Typography>;
  if (!bookingData) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ flexGrow: 1, p: 3, backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3
      }}>
        <Typography variant="h6" gutterBottom>
          Manage Booking
        </Typography>
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#fafafa' }}>
              <TableCell>No</TableCell>
              <TableCell>Tanggal Booking</TableCell>
              <TableCell>Nama Wisata</TableCell>
              <TableCell>Jumlah Orang</TableCell>
              <TableCell>Total Harga</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookingData.data.map((booking, index) => (
              <TableRow
                key={booking.id}
                sx={{
                  '&:hover': { backgroundColor: '#f5f5f5' },
                  transition: 'background-color 0.2s',
                }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{moment(booking.tanggalBooking).format('DD/MM/YYYY')}</TableCell>
                <TableCell>{booking.wisatum.nama}</TableCell>
                <TableCell>{booking.jumlahOrang}</TableCell>
                <TableCell>Rp {parseInt(booking.totalHarga).toLocaleString()}</TableCell>
                <TableCell>
                  <Box sx={{
                    backgroundColor: 
                      booking.status === 'pending' ? '#fff3cd' :
                      booking.status === 'confirmed' ? '#d1e7dd' :
                      booking.status === 'cancelled' ? '#f8d7da' : '#f8f9fa',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    display: 'inline-block'
                  }}>
                    {booking.status}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleOpen(booking)}
                      sx={{ 
                        color: 'primary.main',
                        '&:hover': { backgroundColor: 'primary.lighter' },
                      }}
                    >
                      Detail
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => deleteBooking(booking.id)}
                      sx={{ 
                        color: 'error.main',
                        '&:hover': { backgroundColor: 'error.lighter' },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal Detail */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 400 },
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
          }}
        >
          {selectedBooking && (
            <>
              <Typography id="modal-title" variant="h6" gutterBottom>
                Detail Booking
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" gutterBottom>
                  <strong>Wisata:</strong> {selectedBooking.wisatum.nama}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Tanggal:</strong> {moment(selectedBooking.tanggalBooking).format('DD MMMM YYYY')}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Jumlah Orang:</strong> {selectedBooking.jumlahOrang}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Total Harga:</strong> Rp {parseInt(selectedBooking.totalHarga).toLocaleString()}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Status:</strong> {selectedBooking.status}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Pemesan:</strong> {selectedBooking.user.username}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Email:</strong> {selectedBooking.user.email}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Telepon:</strong> {selectedBooking.user.phone}
                </Typography>
              </Box>
              <Box sx={{ mt: 3, textAlign: 'right' }}>
                <Button variant="contained" onClick={handleClose}>
                  Tutup
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DataBooking;