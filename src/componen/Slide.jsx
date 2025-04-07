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
import CreateSlide from "./AdminModal/Slide/CreateSlide";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import UpdateSlide from "./AdminModal/Slide/UpdateSlide";

const getApiBaseUrl = () => {
  const protocol = window.location.protocol === "https:" ? "https" : "http";
  const baseUrl = process.env.REACT_APP_API_BASE_URL.replace(/^https?:\/\//, "");
  return `${protocol}://${baseUrl}`;
};
  
const fetcher = (url) => axios.get(url, { withCredentials: true }).then((res) => res.data);

export const Slide = () => {
  const { data: slideData, error: slideError } = useSWR(
    `${getApiBaseUrl()}/getslide`,
    fetcher
  );
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedSlideId, setSelectedSlideId] = useState(null);
    const [createModalOpen, setCreateModalOpen] = useState(false);

  if (slideError) return <Typography>Error loading data</Typography>;
  if (!slideData) return <Typography>Loading...</Typography>;

  const handleUpdateOpen = (slide) => {
    setSelectedSlideId(slide.id);
    setUpdateModalOpen(true);
  };

  const handleUpdateClose = () => {
    setUpdateModalOpen(false);
    setSelectedSlideId(null);
  };

  const refreshData = () => {
    mutate(`${getApiBaseUrl()}/getslide`);
    setSnackbar({ open: true, message: "Data berhasil diperbarui", severity: "success" });
  };

  const handleUpdateError = (errorMessage) => {
    setSnackbar({ 
      open: true, 
      message: errorMessage || "Gagal memperbarui data slide", 
      severity: "error" 
    });
  };
  const handleCreateOpen = () => {
    setCreateModalOpen(true);
  };

  const handleCreateClose = () => {
    setCreateModalOpen(false);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3, backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
      <TableContainer component={Paper} sx={{ boxShadow: "0 1px 3px rgba(0,0,0,0.12)" }}>
        <Table>
          <TableHead>
          <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateOpen}
        >
          Tambah Slide
        </Button>
            <TableRow sx={{ backgroundColor: "#fafafa" }}>
              <TableCell>No</TableCell>
              <TableCell>Deskripsi</TableCell>
              <TableCell>Urutan</TableCell>
              <TableCell>Gambar</TableCell>
              <TableCell>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {slideData.data.map((slide, index) => (
              <TableRow key={slide.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{slide.deskripsi}</TableCell>
                <TableCell>{slide.urutan}</TableCell>
                <TableCell>
                  <Card sx={{ maxWidth: 150 }}>
                    <img
                      src={`${getApiBaseUrl()}${slide.urlGambar}`}
                      alt="Slide"
                      style={{ width: "100%", height: "150px", objectFit: "cover" }}
                    />
                  </Card>
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleUpdateOpen(slide)}
                    sx={{
                      color: "warning.main",
                      "&:hover": { backgroundColor: "warning.lighter" },
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
         {/* Create Modal */}
<Modal
  open={createModalOpen}
  onClose={handleCreateClose}
  aria-labelledby="create-modal-title"
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
    <Typography id="create-modal-title" variant="h6" gutterBottom>
      Tambah Wisata Baru
    </Typography>
    <CreateSlide 
      open={createModalOpen}  // Pass the open state
      handleClose={handleCreateClose} 
      refreshData={refreshData} 
    />
  </Box>
</Modal>

      {updateModalOpen && selectedSlideId && (
        <UpdateSlide 
          open={updateModalOpen}
          handleClose={handleUpdateClose} 
          refreshData={refreshData}
          onError={handleUpdateError}
          slideId={selectedSlideId}
        />
      )}
    </Box>
  );
};