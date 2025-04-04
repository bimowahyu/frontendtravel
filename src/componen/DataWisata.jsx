import React, { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
  IconButton,
  Modal,
  Button,
  Fab
} from "@mui/material";
import {
  Card,
} from "react-bootstrap";
import useSWR, { mutate } from "swr";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import DetailsIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
// import { CreateWisata } from "./AdminModal/Wisata/createWisata";
// import { UpdateWisata } from "./AdminModal/Wisata/updateWisata";

import CreateWisata from "./AdminModal/Wisata/createWisata";
import UpdateWisata from "./AdminModal/Wisata/updateWisata";

const getApiBaseUrl = () => {
  const protocol = window.location.protocol === "https:" ? "https" : "http";
  const baseUrl = process.env.REACT_APP_API_BASE_URL.replace(/^https?:\/\//, "");
  return `${protocol}://${baseUrl}`;
};

const fetcher = (url) => axios.get(url, { withCredentials: true }).then((res) => res.data);

export const DataWisata = () => {
  const { data: wisataData, error: wisataError } = useSWR(`${getApiBaseUrl()}/getwisata`, fetcher);
  
  // State for modals
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  
  const [selectedWisata, setSelectedWisata] = useState(null);
  const [selectedWisataId, setSelectedWisataId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Detail modal handlers
  const handleDetailOpen = (wisata) => {
    setSelectedWisata(wisata);
    setDetailModalOpen(true);
  };

  const handleDetailClose = () => {
    setDetailModalOpen(false);
    setSelectedWisata(null);
  };

  // Create modal handlers
  const handleCreateOpen = () => {
    setCreateModalOpen(true);
  };

  const handleCreateClose = () => {
    setCreateModalOpen(false);
  };

  // Update modal handlers
  const handleUpdateOpen = (wisata) => {
    setSelectedWisataId(wisata.id);
    setUpdateModalOpen(true);
  };

  const handleUpdateClose = () => {
    setUpdateModalOpen(false);
    setSelectedWisataId(null);
  };

  // Refresh data after create/update/delete
  const refreshData = () => {
    mutate(`${getApiBaseUrl()}/getwisata`);
    setSnackbar({ open: true, message: "Data berhasil diperbarui", severity: "success" });
  };

  // Delete handler
  const deleteWisata = async(id) => {
    const userConfirm = window.confirm('Apakah anda yakin ingin menghapus wisata ini?');

    if (userConfirm) {
      try {
        await axios.delete(`${getApiBaseUrl()}/deletewisata/${id}`, {
          withCredentials: true
        });
        setSnackbar({ open: true, message: "Wisata berhasil dihapus", severity: "success" });
        refreshData();
      } catch (error) {
        setSnackbar({ open: true, message: "Gagal menghapus wisata", severity: "error" });
      }
    }
  };

  if (wisataError) return <Typography>Error loading data</Typography>;
  if (!wisataData) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ flexGrow: 1, p: 3, backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3
      }}>
        <Typography variant="h6" gutterBottom>
          Manage Wisata
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateOpen}
        >
          Tambah Wisata
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#fafafa' }}>
              <TableCell>No</TableCell>
              <TableCell>Nama</TableCell>
              <TableCell>Deskripsi</TableCell>
              <TableCell>Lokasi</TableCell>
              <TableCell>Harga</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Kategori</TableCell>
              <TableCell>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {wisataData.data.map((wisata, index) => (
              <TableRow
                key={wisata.id}
                sx={{
                  '&:hover': { backgroundColor: '#f5f5f5' },
                  transition: 'background-color 0.2s',
                }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{wisata.nama}</TableCell>
                <TableCell>{wisata.deskripsi}</TableCell>
                <TableCell>{wisata.lokasi}</TableCell>
                <TableCell>Rp {parseInt(wisata.harga).toLocaleString()}</TableCell>
                <TableCell>
                  <Box sx={{
                    backgroundColor: 
                    wisata.status === 'penuh' ? '#fff3cd' :
                    wisata.status === 'tersedia' ? '#d1e7dd' :
                    wisata.status === 'cancelled' ? '#f8d7da' : '#f8f9fa',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    display: 'inline-block'
                  }}>
                    {wisata.status}
                  </Box>
                </TableCell>
                <TableCell>{wisata.kategori.namaKategori || 'N/A'}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleDetailOpen(wisata)}
                      sx={{ 
                        color: 'primary.main',
                        '&:hover': { backgroundColor: 'primary.lighter' },
                      }}
                    >
                      <DetailsIcon fontSize="small"/>
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleUpdateOpen(wisata)}
                      sx={{ 
                        color: 'warning.main',
                        '&:hover': { backgroundColor: 'warning.lighter' },
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => deleteWisata(wisata.id)}
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

      {/* Detail Modal */}
      <Modal
        open={detailModalOpen}
        onClose={handleDetailClose}
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
          {selectedWisata && (
            <>
              <Typography id="modal-title" variant="h6" gutterBottom>
                Detail Wisata
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" gutterBottom>
                  <strong>Wisata:</strong> {selectedWisata.nama}
                </Typography>
                
                <Typography variant="body1" gutterBottom>
                  <strong>Deskripsi:</strong> {selectedWisata.deskripsi}
                </Typography>
                
                <Typography variant="body1" gutterBottom>
                  <strong>Lokasi:</strong> {selectedWisata.lokasi}
                </Typography>
                
                <Typography variant="body1" gutterBottom>
                  <strong>Harga:</strong> Rp {parseInt(selectedWisata.harga).toLocaleString()}
                </Typography>
                
                <Typography variant="body1" gutterBottom>
                  <strong>Status:</strong>{" "}
                  <Box sx={{
                    backgroundColor: 
                      selectedWisata.status === 'penuh' ? '#fff3cd' :
                      selectedWisata.status === 'tersedia' ? '#d1e7dd' :
                      selectedWisata.status === 'cancelled' ? '#f8d7da' : '#f8f9fa',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    display: 'inline-block'
                  }}>
                    {selectedWisata.status}
                  </Box>
                </Typography>
                
                <Typography variant="body1" gutterBottom>
                  <strong>Kategori:</strong> {selectedWisata.kategori?.namaKategori || 'N/A'}
                </Typography>
                
                {selectedWisata.gambar && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1" gutterBottom>
                      <strong>Gambar:</strong>
                    </Typography>
                    {/* <Box sx={{ maxWidth: '100%', mt: 1 }}>
                      <img
                        src={`${getApiBaseUrl()}/uploads/${selectedWisata.gambar}`}
                        alt={selectedWisata.nama}
                        style={{ maxWidth: '100%', borderRadius: 4 }}
                      /> */}
                       <Card.Img
                    variant="top"
                    src={`${getApiBaseUrl()}/public/uploads/wisata/${selectedWisata.gambar}`}
                    className="rounded-top-4 object-fit-cover"
                    style={{ height: '250px' }}
                    alt={selectedWisata.nama}
                  />
                    </Box>
                  
                )}
                
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button onClick={handleDetailClose} variant="outlined">
                    Tutup
                  </Button>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Modal>

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
    <CreateWisata 
      open={createModalOpen}  // Pass the open state
      handleClose={handleCreateClose} 
      refreshData={refreshData} 
    />
  </Box>
</Modal>

{/* Update Modal */}
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
    <Typography id="update-modal-title" variant="h6" gutterBottom>
      Edit Wisata
    </Typography>
    {selectedWisataId && (
      <UpdateWisata 
        open={updateModalOpen}  // Pass the open state
        wisataId={selectedWisataId} 
        handleClose={handleUpdateClose} 
        refreshData={refreshData} 
      />
    )}
  </Box>
</Modal>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DataWisata