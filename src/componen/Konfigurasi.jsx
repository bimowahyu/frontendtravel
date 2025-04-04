import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Snackbar,
  Alert,
  TableContainer,
  Paper,
  IconButton
} from "@mui/material";
import axios from "axios";
import useSWR, { mutate } from "swr";
import { useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import UpdateKonfigurasi from "./AdminModal/Konfigurasi/UpdateKonfigurasi";

const getApiBaseUrl = () => {
    const protocol = window.location.protocol === "https:" ? "https" : "http";
    const baseUrl = process.env.REACT_APP_API_BASE_URL.replace(/^https?:\/\//, "");
    return `${protocol}://${baseUrl}`;
  };
  
const fetcher = (url) => axios.get(url, { withCredentials: true }).then((res) => res.data);

export const Konfigurasi = () => {
   const { data: konfigurasiData, error: konfigurasiError } = useSWR(
      `${getApiBaseUrl()}/getkonfigurasi`,
      fetcher
    );
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
      const [updateModalOpen, setUpdateModalOpen] = useState(false);
      
      const [selectedKonfigurasi, setSelectedKonfigurasi] = useState(null);
      const [selectedKonfigurasiId, setSelectedKonfigurasiId] = useState(null);
      if (konfigurasiError) return <Typography>Error loading data</Typography>;
      if (!konfigurasiData) return <Typography>Loading...</Typography>;
      const handleUpdateOpen = () => {
        setSelectedKonfigurasiId(konfigurasiData.data.id);
        setUpdateModalOpen(true);
      };
      const handleUpdateClose = () => {
        setUpdateModalOpen(false);
        setSelectedKonfigurasiId(null);
      };
        const refreshData = () => {
          mutate(`${getApiBaseUrl()}/getkonfigurasi`);
          setSnackbar({ open: true, message: "Data berhasil diperbarui", severity: "success" });
        };
      return (
        <Box sx={{ flexGrow: 1, p: 3, backgroundColor: "#f4f6f8", minHeight: "100vh" }}>

    
          <TableContainer component={Paper} sx={{ boxShadow: "0 1px 3px rgba(0,0,0,0.12)" }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#fafafa" }}>
                
                  <TableCell>Nama Travel</TableCell>
                  <TableCell>Alamat Travel</TableCell>
                  <TableCell>No Telp Travel</TableCell>
                  <TableCell>Tentang Kami</TableCell>
                  <TableCell>Text</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Footer</TableCell>
                  <TableCell>Logo Travel</TableCell>
                  <TableCell>Background Travel</TableCell>
                  <TableCell>Aksi</TableCell>
                </TableRow>
              </TableHead>
              {/* <TableBody>
                {konfigurasiData.data.id((konfigurasi, index) => (
                  <TableRow
                    key={konfigurasi.id}
                    sx={{
                      "&:hover": { backgroundColor: "#f5f5f5" },
                      transition: "background-color 0.2s",
                    }}
                  > */}
                  <TableBody>
                   <TableRow key={konfigurasiData.data.id}>
                    {/* <TableCell>{index + 1}</TableCell> */}
                    <TableCell>{konfigurasiData.data.namaTravel}</TableCell>
                    <TableCell>{konfigurasiData.data.alamatTravel}</TableCell>
                    <TableCell>{konfigurasiData.data.noTelpTravel}</TableCell>
                    <TableCell>{konfigurasiData.data.tentangKami}</TableCell>
                    <TableCell>{konfigurasiData.data.text}</TableCell>
                    <TableCell>{konfigurasiData.data.email}</TableCell>
                    <TableCell>{konfigurasiData.data.footer}</TableCell>
                    <TableCell>
                            <Card sx={{ maxWidth: 150 }}>
                              <img
                                src={`${getApiBaseUrl()}${konfigurasiData.data.logoTravel}`}
                                alt="Logo Travel"
                                style={{ width: "100%", height: "150px", objectFit: "cover" }}
                              />
                            </Card>
                          </TableCell>


                    {/* <TableCell>{konfigurasi.background}</TableCell> */}
                    <TableCell>
                          <Card sx={{ maxWidth: 150 }}>
                            <img
                              src={`${getApiBaseUrl()}${konfigurasiData.data.background}`}
                              alt="Logo Travel"
                              style={{ width: "100%", height: "150px", objectFit: "cover" }}
                            />
                          </Card>
                        </TableCell>
                        <TableCell>
                        <IconButton
                                              size="small"
                                              onClick={() => handleUpdateOpen(konfigurasiData)}
                                              sx={{ 
                                                color: 'warning.main',
                                                '&:hover': { backgroundColor: 'warning.lighter' },
                                              }}
                                            >
                                              <EditIcon fontSize="small" />
                                            </IconButton>
                                            </TableCell>

                    {/* <TableCell>{konfigurasi.namaTravel}</TableCell> */}
                   
                  </TableRow>
               
              </TableBody>
            </Table>
          </TableContainer>
    
<Snackbar
  open={snackbar.open}
  autoHideDuration={6000}
  onClose={() => setSnackbar({ ...snackbar, open: false })}
>
  <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
    {snackbar.message}
  </Alert>
</Snackbar>

{/* Modal should be here, outside of the Snackbar */}
<Modal
  open={updateModalOpen}
  onClose={handleUpdateClose}
  aria-labelledby="update-modal-title"
>
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: { xs: '90%', sm: 600 },
      bgcolor: 'background.paper',
      borderRadius: 2,
      boxShadow: 24,
      p: 3,
      maxHeight: '90vh',
      overflow: 'auto',
    }}
  >
    
    {selectedKonfigurasiId && (
      <UpdateKonfigurasi 
      open={updateModalOpen}
      handleClose={handleUpdateClose} 
      refreshData={refreshData} 
    />
    )}
  </Box>
</Modal>
        </Box>
      );
    };
    
