import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Modal,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Grid,
  Paper,
  Alert
} from "@mui/material";
import axios from "axios";
const getApiBaseUrl = () => {
  const protocol = window.location.protocol === "https:" ? "https" : "http";
  const baseUrl = process.env.REACT_APP_API_BASE_URL.replace(/^https?:\/\//, "");
  return `${protocol}://${baseUrl}`;
};


const CreateKagetori = ({ open, handleClose, refreshData }) => {
  const [formData, setFormData] = useState({
    namaKategori: "",
   
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      
      // Send POST request
      const response = await axios.post(
        `${getApiBaseUrl()}/createKategori`,
        data,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      if (response.status === 201) {
        setFormData({
          namaKategori: "",
         
        });
      
        handleClose();
        if (refreshData) refreshData();
      }
    } catch (err) {
      setError(err.response?.data?.msg || err.message || "Terjadi kesalahan saat membuat Kategori");
      console.error("Error creating Kategori:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="create-kategori-modal"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', md: 600 },
          maxHeight: '90vh',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          overflowY: 'auto'
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Tambah Kategori
        </Typography>
        
        {error && (
          <Box sx={{ mb: 2 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Nama kategori"
                name="namaKategori"
                value={formData.namaKategori}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
            <Button 
              onClick={handleClose}
              variant="outlined"
              disabled={loading}
            >
              Batal
            </Button>
            <Button 
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateKagetori;