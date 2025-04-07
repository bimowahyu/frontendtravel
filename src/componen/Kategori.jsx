import React, { useState, useCallback } from "react";
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
  Button,
  IconButton,
  Modal
} from "@mui/material";
import useSWR, { mutate } from "swr";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CreateKagetori from "./AdminModal/Kategori/createKategori";
import AddIcon from "@mui/icons-material/Add";
import UpdateKategori from "./AdminModal/Kategori/updateKategori";

const getApiBaseUrl = () => {
  const protocol = window.location.protocol === "https:" ? "https" : "http";
  const baseUrl = process.env.REACT_APP_API_BASE_URL.replace(/^https?:\/\//, "");
  return `${protocol}://${baseUrl}`;
};

const fetcher = (url) => axios.get(url, { withCredentials: true }).then((res) => res.data);

const Kategori = () => {
  const { data: kategoriData, error: kategoriError } = useSWR(
    `${getApiBaseUrl()}/getkategori`,
    fetcher
  );
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedKategoriId, setSelectedKategoriId] = useState(null);

  // Memoized callback functions to prevent unnecessary re-renders
  const handleUpdateOpen = useCallback((kategori) => {
    setSelectedKategoriId(kategori.id);
    setUpdateModalOpen(true);
  }, []);

  const handleUpdateClose = useCallback(() => {
    setUpdateModalOpen(false);
  }, []);

  const handleCreateOpen = useCallback(() => {
    setCreateModalOpen(true);
  }, []);

  const handleCreateClose = useCallback(() => {
    setCreateModalOpen(false);
  }, []);

  const refreshData = useCallback(() => {
    mutate(`${getApiBaseUrl()}/getkategori`);
    setSnackbar({ open: true, message: "Data berhasil diperbarui", severity: "success" });
  }, []);

  const deleteKategori = useCallback(async (id) => {
    const userConfirm = window.confirm("Apakah anda yakin ingin menghapus kategori ini?");
    if (userConfirm) {
      try {
        await axios.delete(`${getApiBaseUrl()}/deletekategori/${id}`, {
          withCredentials: true,
        });
        setSnackbar({ open: true, message: "Kategori berhasil dihapus", severity: "success" });
        mutate(`${getApiBaseUrl()}/getkategori`);
      } catch (error) {
        setSnackbar({ open: true, message: "Gagal menghapus kategori", severity: "error" });
      }
    }
  }, []);

  if (kategoriError) return <Typography>Error loading data</Typography>;
  if (!kategoriData) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ flexGrow: 1, p: 3, backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Manage Kategori
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateOpen}
        >
          Tambah Kategori
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: "0 1px 3px rgba(0,0,0,0.12)" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#fafafa" }}>
              <TableCell>No</TableCell>
              <TableCell>Nama Kategori</TableCell>
              <TableCell>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {kategoriData.data.map((kategori, index) => (
              <TableRow
                key={kategori.id}
                sx={{
                  "&:hover": { backgroundColor: "#f5f5f5" },
                  transition: "background-color 0.2s",
                }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{kategori.namaKategori}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => deleteKategori(kategori.id)}
                      sx={{
                        color: "error.main",
                        "&:hover": { backgroundColor: "error.lighter" },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleUpdateOpen(kategori)}
                      sx={{ 
                        color: 'warning.main',
                        '&:hover': { backgroundColor: 'warning.lighter' },
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
            Edit Kategori
          </Typography>
          <UpdateKategori 
            open={updateModalOpen}
            handleClose={handleUpdateClose} 
            kategoriId={selectedKategoriId} 
            refreshData={refreshData} 
          />
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
            Tambah Kategori Baru
          </Typography>
          <CreateKagetori 
            open={createModalOpen}
            handleClose={handleCreateClose} 
            refreshData={refreshData} 
          />
        </Box>
      </Modal>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Kategori;