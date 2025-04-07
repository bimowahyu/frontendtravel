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
  Alert
} from "@mui/material";
import axios from "axios";
import { Konfigurasi } from "../../Konfigurasi";

const getApiBaseUrl = () => {
  const protocol = window.location.protocol === "https:" ? "https" : "http";
  const baseUrl = process.env.REACT_APP_API_BASE_URL.replace(/^https?:\/\//, "");
  return `${protocol}://${baseUrl}`;
};

const CreateSlide = ({ open, handleClose, refreshData }) => {
  const [formData, setFormData] = useState({
    konfigurasiId: "",
    deskripsi: "",
    urutan: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [konfigurasi, setKonfigurasi] = useState([]);
  
  useEffect(() => {
    const fetchKonfigurasi = async () => {
      try {
        const response = await axios.get(`${getApiBaseUrl()}/getkonfigurasi`, { withCredentials: true });
        setKonfigurasi(response.data.data || []);
      } catch (err) {
        console.error("Error fetching konfigurasi:", err);
      }
    };

    if (open) {
      fetchKonfigurasi();
      // Reset form state when modal opens
      setFormData({
        konfigurasiId: "",
        deskripsi: "",
        urutan: "",
      });
      setSelectedImage(null);
      setImagePreview(null);
      setError("");
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = new FormData();
      
      // Add form fields to FormData
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      
      // Add image to FormData if selected
      if (selectedImage) {
        data.append('urlGambar', selectedImage);
      }
    
      const response = await axios.post(
        `${getApiBaseUrl()}/createslide`,
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
          konfigurasiId: "",
          deskripsi: "",
          urutan: "",
        });
        setSelectedImage(null);
        setImagePreview(null);
        handleClose();
        if (refreshData) refreshData();
      }
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.msg || err.message || "Terjadi kesalahan saat membuat slide");
      console.error("Error creating slide:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="create-slide-modal"
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
          Tambah Slide Baru
        </Typography>
        
        {error && (
          <Box sx={{ mb: 2 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Konfigurasi</InputLabel>
                <Select
                  name="konfigurasiId"
                  value={formData.konfigurasiId}
                  label="Konfigurasi"
                  onChange={handleChange}
                >
                  {Array.isArray(konfigurasi) ? (
                    konfigurasi.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.namaTravel || `Konfigurasi #${item.id}`}
                      </MenuItem>
                    ))
                  ) : konfigurasi && konfigurasi.id ? (
                    <MenuItem key={konfigurasi.id} value={konfigurasi.id}>
                      {konfigurasi.namaTravel || `Konfigurasi #${konfigurasi.id}`}
                    </MenuItem>
                  ) : (
                    <MenuItem disabled>Tidak ada konfigurasi tersedia</MenuItem>
                  )}
                </Select>
                {(!konfigurasi || (Array.isArray(konfigurasi) && konfigurasi.length === 0)) && (
                  <FormHelperText>Tidak ada konfigurasi tersedia</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Deskripsi"
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={3}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Urutan"
                name="urutan"
                value={formData.urutan}
                onChange={handleChange}
                margin="normal"
                type="number"
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ mt: 2, mb: 1, height: '56px' }}
              >
                Upload Gambar Slide
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
              <FormHelperText>Format: JPG, PNG, WebP (Max: 5MB)</FormHelperText>
              
              {imagePreview && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <img 
                    src={imagePreview} 
                    alt="Preview"
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '200px',
                      objectFit: 'contain',
                      borderRadius: '4px'
                    }}
                  />
                </Box>
              )}
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
              disabled={loading || !formData.konfigurasiId || !formData.urutan || !selectedImage}
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateSlide;