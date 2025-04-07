import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Grid,
  CircularProgress
} from "@mui/material";
import axios from "axios";

const getApiBaseUrl = () => {
  const protocol = window.location.protocol === "https:" ? "https" : "http";
  const baseUrl = process.env.REACT_APP_API_BASE_URL.replace(/^https?:\/\//, "");
  return `${protocol}://${baseUrl}`;
};

const UpdateKategori = ({ open, handleClose, kategoriId, refreshData }) => {
  const [formData, setFormData] = useState({
    namaKategori: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [error, setError] = useState("");

  // Fetch kategori data when modal opens and kategoriId changes
  useEffect(() => {
    if (!kategoriId) return;
    
    const fetchData = async () => {
      setFetchingData(true);
      try {
        const response = await axios.get(`${getApiBaseUrl()}/getkategori/${kategoriId}`, { 
          withCredentials: true 
        });
        
        if (response.data && response.data.data) {
          const kategori = response.data.data;
          setFormData({
            namaKategori: kategori.namaKategori || "",
          });
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Gagal memuat data kategori");
      } finally {
        setFetchingData(false);
      }
    };

    fetchData();
  }, [kategoriId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // If no changes, just close the modal
    if (!formData.namaKategori.trim()) {
      handleClose();
      return;
    }
    
    setLoading(true);
    setError("");
  
    try {
      // Create FormData object
      const data = new FormData();
      data.append('namaKategori', formData.namaKategori);
  
      // Send the PUT request
      await axios.put(
        `${getApiBaseUrl()}/updatekategori/${kategoriId}`,
        data,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      // Force an immediate closure of the modal
      handleClose();
      
      // Refresh data after modal is closed
      setTimeout(() => {
        if (typeof refreshData === 'function') {
          refreshData();
        }
      }, 300);
      
    } catch (err) {
      console.error("Error updating kategori:", err);
      setError(err.response?.data?.msg || "Terjadi kesalahan saat memperbarui kategori");
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}
      
      <TextField
        margin="normal"
        required
        fullWidth
        id="namaKategori"
        label="Nama Kategori"
        name="namaKategori"
        value={formData.namaKategori}
        onChange={handleChange}
        autoFocus
      />
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
        <Button 
          type="button"
          variant="outlined" 
          onClick={handleClose}
          disabled={loading}
        >
          Batal
        </Button>
        <Button 
          type="submit"
          variant="contained"
          disabled={loading}
        >
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </Box>
    </Box>
  );
};

export default UpdateKategori;